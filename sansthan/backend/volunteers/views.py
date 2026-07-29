from django.contrib.auth import get_user_model
from django.db import transaction
from django.utils import timezone
from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import Volunteer, Verification, VolunteerApproval, Notification, AuditLog, VolunteerIdSequence
from .serializers import (
    VolunteerListSerializer, VolunteerDetailSerializer, VolunteerRegisterSerializer,
    VolunteerApplySerializer, ReferenceActionSerializer, AdminActionSerializer,
    NotificationSerializer, AuditLogSerializer,
)
from .notifications import notify, notify_reference_required, notify_admins_new_application
from .realtime import push_status_update

User = get_user_model()


class IsApprovedVolunteer(permissions.BasePermission):
    def has_permission(self, request, view):
        vol = getattr(request.user, "volunteer_profile_v2", None)
        return bool(vol and vol.can_register_volunteers)


class VolunteerViewSet(viewsets.ModelViewSet):
    queryset = Volunteer.objects.select_related("reference_volunteer", "approval", "verification")
    permission_classes = [permissions.IsAuthenticated]

    def get_serializer_class(self):
        if self.action == "retrieve":
            return VolunteerDetailSerializer
        return VolunteerListSerializer

    def get_queryset(self):
        qs = super().get_queryset()
        search = self.request.query_params.get("search")
        status_filter = self.request.query_params.get("status")
        if search:
            qs = qs.filter(name__icontains=search) | qs.filter(phone__icontains=search) | qs.filter(email__icontains=search)
        if status_filter:
            qs = qs.filter(status=status_filter)
        return qs.order_by(self.request.query_params.get("ordering", "-created_at"))

    def get_permissions(self):
        # ModelViewSet's destroy action defaults to the class-level
        # IsAuthenticated permission, which would let ANY logged-in user
        # delete ANY volunteer. Restrict deletion to admins only; every
        # other action keeps its existing permission_classes untouched.
        if self.action == "destroy":
            return [permissions.IsAdminUser()]
        return super().get_permissions()

    # -------- Devotee -> apply to become volunteer (Flutter submission API) --------
    @action(detail=False, methods=["post"], url_path="apply", permission_classes=[permissions.IsAuthenticated])
    def apply(self, request):
        """Submission API for the Flutter app.

        Fields: name, email, phone, document photo(s), selfie, optional
        reference volunteer.

        - Reference chosen: application goes to both the reference volunteer
          AND the admin. The reference volunteer's decision is informational
          for the admin (see admin_action's override handling) — the admin
          still makes the final call.
        - No reference chosen: application goes straight to the admin.

        Re-applying after rejection: Volunteer.devotee/user are OneToOne
        fields, so a devotee can only ever have one Volunteer row — a plain
        second Volunteer.objects.create() would throw an IntegrityError.
        Instead, if the devotee's existing row is in a rejected state, we
        reset that same row in place (new name/email/phone/docs/reference,
        status back to pending) so they can re-apply as many times as they
        want, with same or different details each time. If the existing row
        is still pending or already approved, re-apply is blocked with a
        clear message instead of silently failing.

        Wrapped in transaction.atomic() so a failure partway through (e.g.
        Verification create fails) can't leave a half-created/half-reset
        Volunteer row sitting in the DB, which is what previously made it
        look like "network error" on the client while a record still
        appeared for admins.
        """
        devotee = getattr(request.user, "devotee_profile", None)
        if not devotee:
            return Response({"detail": "Only devotees can apply to become volunteers."}, status=400)

        existing = Volunteer.objects.filter(devotee=devotee).first()
        if existing and existing.status not in (
            Volunteer.Status.VOLUNTEER_REJECTED,
            Volunteer.Status.ADMIN_REJECTED,
            Volunteer.Status.AUTO_REJECTED,
        ):
            return Response(
                {"detail": f"You already have an application in progress (status: {existing.get_status_display()})."},
                status=400,
            )

        serializer = VolunteerApplySerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data
        reference = data.get("reference_volunteer")

        with transaction.atomic():
            if existing:
                # Re-apply: reset the same row in place instead of inserting
                # a new one (OneToOne on devotee/user forbids a second row).
                volunteer = existing
                volunteer.name = data["name"]
                volunteer.email = data["email"]
                volunteer.phone = data["phone"]
                volunteer.reference_volunteer = reference
                volunteer.status = Volunteer.Status.PENDING_VOLUNTEER_APPROVAL
                volunteer.is_volunteer = False
                volunteer.public_id = None
                # A prior rejection may have cleared volunteer_code (see
                # admin_action) — regenerate it since document upload paths
                # need a non-null code to build their storage folder.
                if not volunteer.volunteer_code:
                    from .models import generate_volunteer_code
                    volunteer.volunteer_code = generate_volunteer_code()
                volunteer.save()

                # Old verification/approval belong to the rejected attempt —
                # replace them cleanly rather than leaving stale data behind.
                Verification.objects.filter(volunteer=volunteer).delete()
                VolunteerApproval.objects.filter(volunteer=volunteer).delete()
            else:
                volunteer = Volunteer.objects.create(
                    devotee=devotee, user=request.user,
                    name=data["name"], email=data["email"], phone=data["phone"],
                    reference_volunteer=reference,
                    status=Volunteer.Status.PENDING_VOLUNTEER_APPROVAL,
                )

            Verification.objects.create(
                volunteer=volunteer,
                aadhaar_number=data.get("document_number", ""),
                aadhaar_front=data.get("document_front"),
                aadhaar_back=data.get("document_back"),
                live_photo=data.get("selfie"),
            )
            AuditLog.objects.create(
                volunteer=volunteer,
                action="devotee_reapplied" if existing else "devotee_applied",
                actor=request.user,
            )

            if reference:
                VolunteerApproval.objects.create(volunteer=volunteer, reference_volunteer=reference)
                AuditLog.objects.create(volunteer=volunteer, action="reference_selected", actor=request.user,
                                         detail=f"Reference: {reference.name}")

        # Notifications fire after the transaction commits, so a notify
        # failure can never roll back an otherwise-successful application.
        if reference:
            notify_reference_required(reference, volunteer)
        notify_admins_new_application(volunteer)

        return Response({
            "id": volunteer.id,
            "volunteer_code": volunteer.volunteer_code,
            "status": volunteer.status,
            "message": "Application submitted. Document uploaded successfully.",
        }, status=201)

    # -------- Approved volunteer registers a new volunteer --------
    @action(detail=False, methods=["post"], url_path="register", permission_classes=[IsApprovedVolunteer])
    def register(self, request):
        reference = request.user.volunteer_profile_v2
        serializer = VolunteerRegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        if not data.get("reference_comment"):
            return Response({"detail": "Reference comment is required."}, status=400)

        with transaction.atomic():
            volunteer = Volunteer.objects.create(
                name=data["name"], email=data["email"], phone=data["phone"],
                profile_photo=data.get("profile_photo"),
                reference_volunteer=reference, created_by=request.user,
                status=Volunteer.Status.PENDING_VOLUNTEER_APPROVAL,
            )
            Verification.objects.create(
                volunteer=volunteer,
                aadhaar_number=data.get("aadhaar_number", ""), aadhaar_front=data.get("aadhaar_front"), aadhaar_back=data.get("aadhaar_back"),
                pan_number=data.get("pan_number", ""), pan_front=data.get("pan_front"), pan_back=data.get("pan_back"),
                license_number=data.get("license_number", ""), license_front=data.get("license_front"), license_back=data.get("license_back"),
                live_photo=data.get("live_photo"),
            )
            VolunteerApproval.objects.create(
                volunteer=volunteer, reference_volunteer=reference,
                reference_comment=data["reference_comment"],
            )
            AuditLog.objects.create(volunteer=volunteer, action="registered_with_reference", actor=request.user,
                                     detail=f"Reference: {reference.name}")

        notify_reference_required(reference, volunteer)
        notify_admins_new_application(volunteer)

        return Response(VolunteerDetailSerializer(volunteer, context=self.get_serializer_context()).data, status=201)

    # -------- Reference volunteer approves/rejects --------
    @action(detail=True, methods=["post"], url_path="reference-action", permission_classes=[permissions.IsAuthenticated])
    def reference_action(self, request, pk=None):
        volunteer = self.get_object()
        approval = getattr(volunteer, "approval", None)
        if not approval:
            return Response({"detail": "No approval record."}, status=400)

        me = getattr(request.user, "volunteer_profile_v2", None)
        if not me or approval.reference_volunteer_id != me.id:
            return Response({"detail": "Not the reference volunteer for this application."}, status=403)
        if approval.reference_status != VolunteerApproval.RefStatus.PENDING:
            return Response({"detail": "Already actioned."}, status=400)

        serializer = ReferenceActionSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        act = serializer.validated_data["action"]

        approval.reference_status = VolunteerApproval.RefStatus.APPROVED if act == "approve" else VolunteerApproval.RefStatus.REJECTED
        approval.reference_action_at = timezone.now()
        approval.save()

        volunteer.status = Volunteer.Status.VOLUNTEER_APPROVED if act == "approve" else Volunteer.Status.VOLUNTEER_REJECTED
        volunteer.save()

        AuditLog.objects.create(volunteer=volunteer, action=f"reference_{act}d", actor=request.user)

        for admin in User.objects.filter(is_staff=True):
            notify(admin, "Reference Decision Recorded",
                   f"Reference {'approved' if act == 'approve' else 'rejected'} {volunteer.name}.",
                   Notification.Type.STATUS_UPDATE, related_volunteer=volunteer)

        push_status_update(volunteer.id, {"volunteer_id": volunteer.id, "status": volunteer.status})
        return Response(VolunteerDetailSerializer(volunteer, context=self.get_serializer_context()).data)

    # -------- Admin approves/rejects --------
    @action(detail=True, methods=["post"], url_path="admin-action", permission_classes=[permissions.IsAdminUser])
    def admin_action(self, request, pk=None):
        """Approval / Rejection API for the admin panel.

        Response contract (exactly what the frontend needs, nothing else):
        - approve -> {"id": "vol_1", "message": "approve"}
        - reject  -> {"message": "rejected", "reason": "<reason>"}
        """
        volunteer = self.get_object()
        approval = getattr(volunteer, "approval", None)

        serializer = AdminActionSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        act = serializer.validated_data["action"]
        override = serializer.validated_data["override"]
        reason = serializer.validated_data.get("reason", "")

        if act == "reject" and not reason:
            return Response({"detail": "A reason is required when rejecting an application."}, status=400)

        # Devotee applications (via /apply/) only get a VolunteerApproval row
        # if a reference volunteer was chosen. For those without one, admin
        # approval is a direct decision with no reference to check against.
        if approval:
            if approval.reference_status == VolunteerApproval.RefStatus.REJECTED and act == "approve" and not override:
                return Response({"detail": "Reference rejected. Set override=true to approve anyway."}, status=400)

            approval.admin_status = VolunteerApproval.AdminStatus.APPROVED if act == "approve" else VolunteerApproval.AdminStatus.REJECTED
            approval.admin_action_at = timezone.now()
            approval.admin_action_by = request.user
            approval.save()

        with transaction.atomic():
            if act == "approve":
                volunteer.status = Volunteer.Status.ADMIN_APPROVED
                volunteer.is_volunteer = True
                # Mint the public-facing sequential ID (vol_1, vol_2, ...) the
                # first time this application is approved. select_for_update()
                # inside next_code() makes this safe under concurrent approvals.
                if not volunteer.public_id:
                    volunteer.public_id = VolunteerIdSequence.next_code()
            else:
                volunteer.status = Volunteer.Status.ADMIN_REJECTED
                # Rejected applicants shouldn't keep a volunteer code — clear
                # it so it isn't seen as ever having been "given" to them.
                volunteer.volunteer_code = None
            volunteer.save()

        # If a devotee applied via /apply/, their existing login account is
        # already linked to this Volunteer record (volunteer.user was set to
        # request.user at application time). On approval, promote that
        # account's role so /auth/me/ and future logins correctly report
        # them as a volunteer instead of still showing "devotee".
        if act == "approve" and volunteer.user and volunteer.user.user_type != User.UserType.VOLUNTEER:
            volunteer.user.user_type = User.UserType.VOLUNTEER
            volunteer.user.save(update_fields=["user_type"])

        AuditLog.objects.create(
            volunteer=volunteer, action=f"admin_{act}d", actor=request.user,
            detail=reason or ("override" if override else ""),
        )

        if volunteer.user:
            if act == "approve":
                notify(
                    volunteer.user, "Volunteer Application Approved", "approve",
                    Notification.Type.STATUS_UPDATE, related_volunteer=volunteer,
                )
            else:
                notify(
                    volunteer.user, "Volunteer Application Rejected", reason,
                    Notification.Type.STATUS_UPDATE, related_volunteer=volunteer,
                )

        push_status_update(volunteer.id, {
            "volunteer_id": volunteer.id,
            "status": volunteer.status,
            "public_id": volunteer.public_id,
            "reason": reason if act == "reject" else None,
        })

        if act == "approve":
            return Response({"id": volunteer.public_id, "message": "approve"}, status=200)
        return Response({"message": "rejected", "reason": reason}, status=200)

    @action(detail=True, methods=["get"], url_path="audit-log")
    def audit_log(self, request, pk=None):
        volunteer = self.get_object()
        logs = volunteer.audit_logs.select_related("actor")
        return Response(AuditLogSerializer(logs, many=True).data)


class NotificationViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Notification.objects.filter(recipient=self.request.user)

    @action(detail=True, methods=["post"], url_path="read")
    def mark_read(self, request, pk=None):
        notif = self.get_object()
        notif.is_read = True
        notif.save()
        return Response(NotificationSerializer(notif).data)

    @action(detail=False, methods=["get"], url_path="unread-count")
    def unread_count(self, request):
        count = self.get_queryset().filter(is_read=False).count()
        return Response({"count": count})