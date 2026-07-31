import random
import string
from datetime import timedelta

from django.conf import settings
from django.db import models
from django.utils import timezone


def volunteer_photo_path(instance, filename):
    return f"volunteer_photos/{instance.volunteer_code or 'pending'}/{filename}"


def verification_doc_path(instance, filename):
    return f"volunteer_verification/{instance.volunteer.volunteer_code}/{filename}"


def generate_volunteer_code():
    alphabet = string.ascii_uppercase + string.digits
    while True:
        code = "VOL-" + "".join(random.choices(alphabet, k=6))
        if not Volunteer.objects.filter(volunteer_code=code).exists():
            return code


class Volunteer(models.Model):
    class Status(models.TextChoices):
        PENDING_VOLUNTEER_APPROVAL = "pending_volunteer_approval", "Pending Volunteer Approval"
        VOLUNTEER_APPROVED = "volunteer_approved", "Volunteer Approved"
        VOLUNTEER_REJECTED = "volunteer_rejected", "Volunteer Rejected"
        ADMIN_APPROVED = "admin_approved", "Admin Approved"
        ADMIN_REJECTED = "admin_rejected", "Admin Rejected"
        AUTO_REJECTED = "auto_rejected", "Auto Rejected"

    devotee = models.OneToOneField(
        "devotees.Devotee", on_delete=models.CASCADE, related_name="volunteer_profile", null=True, blank=True
    )
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="volunteer_profile_v2", null=True, blank=True
    )

    volunteer_code = models.CharField(max_length=20, unique=True, editable=False)
    public_id = models.CharField(max_length=20, unique=True, null=True, blank=True, default=None, editable=False)
    name = models.CharField(max_length=150)
    email = models.EmailField()
    phone = models.CharField(max_length=20)
    profile_photo = models.ImageField(upload_to=volunteer_photo_path, null=True, blank=True)

    is_volunteer = models.BooleanField(default=False)
    status = models.CharField(max_length=30, choices=Status.choices, default=Status.PENDING_VOLUNTEER_APPROVAL)

    reference_volunteer = models.ForeignKey(
        "self", null=True, blank=True, on_delete=models.SET_NULL, related_name="referred_volunteers"
    )
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, null=True, blank=True, on_delete=models.SET_NULL, related_name="created_volunteers"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["volunteer_code"]),
            models.Index(fields=["status"]),
            models.Index(fields=["is_volunteer"]),
        ]

    def save(self, *args, **kwargs):
        if not self.volunteer_code:
            self.volunteer_code = generate_volunteer_code()
        super().save(*args, **kwargs)

    @property
    def can_register_volunteers(self):
        return self.is_volunteer and self.status in (
            Volunteer.Status.ADMIN_APPROVED,
        )

    def __str__(self):
        return f"{self.volunteer_code} - {self.name}"


class Verification(models.Model):
    volunteer = models.OneToOneField(Volunteer, on_delete=models.CASCADE, related_name="verification")

    aadhaar_number = models.CharField(max_length=20, blank=True, default="")
    aadhaar_front = models.ImageField(upload_to=verification_doc_path, null=True, blank=True)
    aadhaar_back = models.ImageField(upload_to=verification_doc_path, null=True, blank=True)

    pan_number = models.CharField(max_length=20, blank=True, default="")
    pan_front = models.ImageField(upload_to=verification_doc_path, null=True, blank=True)
    pan_back = models.ImageField(upload_to=verification_doc_path, null=True, blank=True)

    license_number = models.CharField(max_length=30, blank=True, default="")
    license_front = models.ImageField(upload_to=verification_doc_path, null=True, blank=True)
    license_back = models.ImageField(upload_to=verification_doc_path, null=True, blank=True)

    live_photo = models.ImageField(upload_to=verification_doc_path, null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Verification · {self.volunteer.volunteer_code}"


class VolunteerApproval(models.Model):
    class RefStatus(models.TextChoices):
        PENDING = "pending", "Pending"
        APPROVED = "approved", "Approved"
        REJECTED = "rejected", "Rejected"
        AUTO_REJECTED = "auto_rejected", "Auto Rejected"

    class AdminStatus(models.TextChoices):
        PENDING = "pending", "Pending"
        APPROVED = "approved", "Approved"
        REJECTED = "rejected", "Rejected"

    volunteer = models.OneToOneField(Volunteer, on_delete=models.CASCADE, related_name="approval")
    reference_volunteer = models.ForeignKey(
        Volunteer, on_delete=models.SET_NULL, null=True, related_name="reference_approvals"
    )
    reference_comment = models.TextField(blank=True, default="")

    reference_status = models.CharField(max_length=20, choices=RefStatus.choices, default=RefStatus.PENDING)
    reference_action_at = models.DateTimeField(null=True, blank=True)

    admin_status = models.CharField(max_length=20, choices=AdminStatus.choices, default=AdminStatus.PENDING)
    admin_action_at = models.DateTimeField(null=True, blank=True)
    admin_action_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, null=True, blank=True, on_delete=models.SET_NULL, related_name="volunteer_admin_actions"
    )

    auto_rejected = models.BooleanField(default=False)
    deadline = models.DateTimeField()

    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if not self.deadline:
            self.deadline = timezone.now() + timedelta(hours=24)
        super().save(*args, **kwargs)

    @property
    def time_remaining_seconds(self):
        remaining = (self.deadline - timezone.now()).total_seconds()
        return max(0, int(remaining))

    def __str__(self):
        return f"Approval · {self.volunteer.volunteer_code}"


class AuditLog(models.Model):
    volunteer = models.ForeignKey(Volunteer, on_delete=models.CASCADE, related_name="audit_logs")
    action = models.CharField(max_length=100)
    actor = models.ForeignKey(settings.AUTH_USER_MODEL, null=True, blank=True, on_delete=models.SET_NULL)
    detail = models.CharField(max_length=255, blank=True, default="")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]


class VolunteerIdSequence(models.Model):
    last_number = models.PositiveIntegerField(default=0)

    @classmethod
    def next_code(cls):
        seq, _ = cls.objects.select_for_update().get_or_create(pk=1)
        seq.last_number += 1
        seq.save(update_fields=["last_number"])
        return f"vol_{seq.last_number}"


class Duty(models.Model):
    """A single duty/task assigned to one volunteer for a given day —
    the volunteer-app "Today's Duties" feed."""

    class Priority(models.TextChoices):
        LOW = "low", "Low"
        NORMAL = "normal", "Normal"
        HIGH = "high", "High"

    class Status(models.TextChoices):
        ASSIGNED = "assigned", "Assigned"
        IN_PROGRESS = "in_progress", "In Progress"
        COMPLETED = "completed", "Completed"
        HELP_REQUESTED = "help_requested", "Help Requested"
        SWAP_REQUESTED = "swap_requested", "Swap Requested"  # NEW

    duty_code = models.CharField(max_length=20, unique=True, editable=False)
    volunteer = models.ForeignKey(Volunteer, on_delete=models.CASCADE, related_name="duties")

    title = models.CharField(max_length=200)
    instructions = models.TextField(blank=True, default="")
    location = models.CharField(max_length=200, blank=True, default="")
    duty_date = models.DateField(default=timezone.localdate)
    time = models.TimeField(null=True, blank=True)

    priority = models.CharField(max_length=10, choices=Priority.choices, default=Priority.NORMAL)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.ASSIGNED)
    help_note = models.CharField(max_length=300, blank=True, default="")

    # NEW — swap workflow. swap_requested_with is the volunteer being asked
    # to take over; pre_swap_status remembers what the duty's status was
    # right before the swap request, so a decline restores it exactly
    # (an in-progress duty shouldn't get bumped back to "assigned").
    swap_requested_with = models.ForeignKey(
        Volunteer, null=True, blank=True, on_delete=models.SET_NULL, related_name="swap_requests_incoming"
    )
    swap_requested_at = models.DateTimeField(null=True, blank=True)
    pre_swap_status = models.CharField(max_length=20, choices=Status.choices, null=True, blank=True)

    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, null=True, blank=True, on_delete=models.SET_NULL, related_name="assigned_duties"
    )
    started_at = models.DateTimeField(null=True, blank=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["duty_date", "time", "-priority"]
        indexes = [
            models.Index(fields=["duty_code"]),
            models.Index(fields=["status"]),
            models.Index(fields=["volunteer", "duty_date"]),
        ]

    def save(self, *args, **kwargs):
        if not self.duty_code:
            last = Duty.objects.order_by("-id").first()
            next_id = (last.id + 1) if last else 1
            self.duty_code = f"DUT-{1000 + next_id}"
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.duty_code} - {self.title} ({self.volunteer.name})"


class Notification(models.Model):
    class Type(models.TextChoices):
        VOLUNTEER_APPROVAL_REQUIRED = "volunteer_approval_required", "Volunteer Approval Required"
        NEW_VOLUNTEER_APPLICATION = "new_volunteer_application", "New Volunteer Application"
        STATUS_UPDATE = "status_update", "Status Update"
        ANNOUNCEMENT_URGENT = "announcement_urgent", "Urgent Announcement"
        ANNOUNCEMENT_IMPORTANT = "announcement_important", "Important Announcement"
        INCIDENT_REPORTED = "incident_reported", "New Incident Reported"
        INCIDENT_RESPONSE = "incident_response", "Incident Response"
        DUTY_ASSIGNED = "duty_assigned", "Duty Assigned"
        DUTY_COMPLETED = "duty_completed", "Duty Completed"
        DUTY_HELP_REQUESTED = "duty_help_requested", "Duty Help/Swap Requested"
        DUTY_STATUS_UPDATE = "duty_status_update", "Duty Status Update"
        DUTY_SWAP_RESPONSE = "duty_swap_response", "Duty Swap Response"  # NEW

    recipient = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="volunteer_notifications")
    title = models.CharField(max_length=150)
    message = models.CharField(max_length=500)
    type = models.CharField(max_length=40, choices=Type.choices)
    related_volunteer = models.ForeignKey(Volunteer, null=True, blank=True, on_delete=models.CASCADE)
    related_incident = models.ForeignKey(
        "incidents.IncidentReport", null=True, blank=True, on_delete=models.CASCADE, related_name="notifications"
    )
    related_duty = models.ForeignKey(
        Duty, null=True, blank=True, on_delete=models.CASCADE, related_name="notifications"
    )
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]