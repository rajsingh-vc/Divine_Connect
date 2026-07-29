from rest_framework import serializers
from .models import Volunteer, Verification, VolunteerApproval, Notification, AuditLog


class VerificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Verification
        fields = [
            "aadhaar_number", "aadhaar_front", "aadhaar_back",
            "pan_number", "pan_front", "pan_back",
            "license_number", "license_front", "license_back",
            "live_photo",
        ]


class VolunteerApprovalSerializer(serializers.ModelSerializer):
    time_remaining_seconds = serializers.IntegerField(read_only=True)
    reference_volunteer_name = serializers.CharField(source="reference_volunteer.name", read_only=True)

    class Meta:
        model = VolunteerApproval
        fields = [
            "id", "reference_volunteer", "reference_volunteer_name", "reference_comment",
            "reference_status", "reference_action_at",
            "admin_status", "admin_action_at", "admin_action_by",
            "auto_rejected", "deadline", "time_remaining_seconds", "created_at",
        ]
        read_only_fields = ["reference_action_at", "admin_action_at", "admin_action_by", "auto_rejected", "deadline"]


class VolunteerListSerializer(serializers.ModelSerializer):
    reference_volunteer_name = serializers.CharField(source="reference_volunteer.name", read_only=True, default="")
    approval = VolunteerApprovalSerializer(read_only=True)

    class Meta:
        model = Volunteer
        fields = [
            "id", "volunteer_code", "public_id", "name", "email", "phone", "profile_photo",
            "is_volunteer", "status", "reference_volunteer", "reference_volunteer_name",
            "approval", "created_at",
        ]


class VolunteerDetailSerializer(serializers.ModelSerializer):
    verification = VerificationSerializer(read_only=True)
    approval = VolunteerApprovalSerializer(read_only=True)

    class Meta:
        model = Volunteer
        fields = [
            "id", "volunteer_code", "public_id", "name", "email", "phone", "profile_photo",
            "is_volunteer", "status", "reference_volunteer", "created_by",
            "verification", "approval", "created_at", "updated_at",
        ]


class VolunteerRegisterSerializer(serializers.Serializer):
    """Used when an approved volunteer registers a new volunteer (Step 1-2 of the form)."""
    name = serializers.CharField(max_length=150)
    email = serializers.EmailField()
    phone = serializers.CharField(max_length=20)
    profile_photo = serializers.ImageField(required=False)

    aadhaar_number = serializers.CharField(required=False, allow_blank=True)
    aadhaar_front = serializers.ImageField(required=False)
    aadhaar_back = serializers.ImageField(required=False)
    pan_number = serializers.CharField(required=False, allow_blank=True)
    pan_front = serializers.ImageField(required=False)
    pan_back = serializers.ImageField(required=False)
    license_number = serializers.CharField(required=False, allow_blank=True)
    license_front = serializers.ImageField(required=False)
    license_back = serializers.ImageField(required=False)
    live_photo = serializers.ImageField(required=False)

    # Required for the "register" flow (approved volunteer referring someone
    # new). Optional for the devotee "apply" flow, where the reference
    # volunteer itself is also optional (see `reference_volunteer` below).
    reference_comment = serializers.CharField(max_length=1000, required=False, allow_blank=True, default="")

    # Devotee "apply" flow only: an optional reference volunteer picked from
    # the list of already-approved volunteers. Ignored by "register" (the
    # reference there is always the logged-in volunteer, set server-side).
    reference_volunteer = serializers.PrimaryKeyRelatedField(
        queryset=Volunteer.objects.filter(status=Volunteer.Status.ADMIN_APPROVED),
        required=False,
        allow_null=True,
    )


class VolunteerApplySerializer(serializers.Serializer):
    """Submission API used by the Flutter app — devotee applying to become
    a volunteer. Only the fields the frontend actually collects:
    name, email, phone, document photo(s), selfie, optional reference.
    """
    name = serializers.CharField(max_length=150)
    email = serializers.EmailField()
    phone = serializers.CharField(max_length=20)

    # "document photo" -> stored against the Aadhaar fields on Verification.
    document_front = serializers.ImageField()
    document_back = serializers.ImageField(required=False)
    document_number = serializers.CharField(required=False, allow_blank=True, default="")

    selfie = serializers.ImageField()  # stored as live_photo

    reference_volunteer = serializers.PrimaryKeyRelatedField(
        queryset=Volunteer.objects.filter(status=Volunteer.Status.ADMIN_APPROVED),
        required=False,
        allow_null=True,
    )


class ReferenceActionSerializer(serializers.Serializer):
    action = serializers.ChoiceField(choices=["approve", "reject"])


class AdminActionSerializer(serializers.Serializer):
    action = serializers.ChoiceField(choices=["approve", "reject"])
    override = serializers.BooleanField(required=False, default=False)
    # Optional on approve; required on reject — shown to the applicant and
    # stored in the audit log (e.g. "Blurry photo", "Aadhaar number unreadable").
    reason = serializers.CharField(max_length=500, required=False, allow_blank=True, default="")


class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = ["id", "title", "message", "type", "related_volunteer", "is_read", "created_at"]


class AuditLogSerializer(serializers.ModelSerializer):
    actor_name = serializers.CharField(source="actor.get_full_name", read_only=True, default="")

    class Meta:
        model = AuditLog
        fields = ["id", "action", "actor", "actor_name", "detail", "created_at"]