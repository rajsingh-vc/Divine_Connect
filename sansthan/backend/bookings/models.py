from datetime import datetime

from django.conf import settings
from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.utils import timezone


class Seva(models.Model):
    """A seva/service offered by the sansthan (used by Bookings + Sevas & Services page)."""

    name = models.CharField(max_length=150, unique=True)
    category = models.CharField(max_length=100)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    duration_minutes = models.PositiveIntegerField(default=30)
    slots_per_day = models.PositiveIntegerField(default=1)
    capacity = models.PositiveIntegerField(default=1)
    priest = models.CharField(max_length=150, blank=True, default="")
    description = models.TextField(blank=True, default="")
    is_active = models.BooleanField(default=True)
    is_popular = models.BooleanField(default=False)

    # --- Seva scheduling window. start_date/end_date are the new,
    # REQUIRED-for-bookable fields (Sec.1). start_time/end_time already
    # existed and are reused as-is. `seva_date` is kept ONLY as a legacy
    # mirror of start_date so any old code/reports reading it don't break;
    # it is no longer the source of truth. ---
    start_date = models.DateField(null=True, blank=True)
    start_time = models.TimeField(null=True, blank=True)
    end_date = models.DateField(null=True, blank=True)
    end_time = models.TimeField(null=True, blank=True)
    seva_date = models.DateField(null=True, blank=True)  # legacy mirror, do not use for new logic

    class Meta:
        ordering = ["name"]
        indexes = [
            models.Index(fields=["category"]),
            models.Index(fields=["is_popular"]),
            models.Index(fields=["start_date"]),
            models.Index(fields=["is_active"]),
        ]

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        # keep legacy `seva_date` column in sync so nothing reading it breaks
        self.seva_date = self.start_date
        super().save(*args, **kwargs)

    # ------------------------------------------------------------------
    # Schedule helpers — single source of truth for LIVE / bookable state.
    # Always timezone-aware, always uses Django's configured TIME_ZONE.
    # ------------------------------------------------------------------
    @property
    def has_valid_schedule(self) -> bool:
        return bool(self.start_date and self.start_time and self.end_date and self.end_time)

    def _to_aware(self, date_val, time_val):
        if not (date_val and time_val):
            return None
        naive = datetime.combine(date_val, time_val)
        current_tz = timezone.get_current_timezone()
        return timezone.make_aware(naive, current_tz) if timezone.is_naive(naive) else naive

    @property
    def start_datetime(self):
        return self._to_aware(self.start_date, self.start_time)

    @property
    def end_datetime(self):
        return self._to_aware(self.end_date, self.end_time)

    @property
    def is_live(self) -> bool:
        """LIVE strictly means: is_active AND now is within [start, end]."""
        if not self.is_active or not self.has_valid_schedule:
            return False
        start, end = self.start_datetime, self.end_datetime
        now = timezone.now()
        return start <= now <= end

    @property
    def is_bookable(self) -> bool:
        """A devotee may only book while the Seva is inside its own window."""
        if not self.is_active or not self.has_valid_schedule:
            return False
        now = timezone.now()
        return self.start_datetime <= now <= self.end_datetime

    @property
    def schedule_status(self) -> str:
        """LIVE / UPCOMING / EXPIRED / UNSCHEDULED — used for sorting (Sec.6)."""
        if not self.has_valid_schedule:
            return "UNSCHEDULED"
        now = timezone.now()
        if now < self.start_datetime:
            return "UPCOMING"
        if now > self.end_datetime:
            return "EXPIRED"
        return "LIVE"


class Booking(models.Model):
    class Status(models.TextChoices):
        PENDING = "pending", "Pending"
        CONFIRMED = "confirmed", "Confirmed"
        COMPLETED = "completed", "Completed"
        CANCELLED = "cancelled", "Cancelled"

    class Channel(models.TextChoices):
        WEB = "web", "Web"
        MOBILE = "mobile", "Mobile"
        COUNTER = "counter", "Counter"
        WHATSAPP = "whatsapp", "WhatsApp"

    booking_code = models.CharField(max_length=20, unique=True, editable=False)
    devotee = models.ForeignKey("devotees.Devotee", on_delete=models.CASCADE, related_name="bookings")
    seva = models.ForeignKey(Seva, on_delete=models.PROTECT, related_name="bookings")
    date = models.DateField()
    slot = models.CharField(max_length=20)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    channel = models.CharField(max_length=20, choices=Channel.choices, default=Channel.WEB)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.PENDING)
    created_at = models.DateTimeField(auto_now_add=True)

    payment_id = models.CharField(max_length=100, blank=True, default="")
    bill = models.OneToOneField(
        "bookings.Bill", on_delete=models.SET_NULL, null=True, blank=True, related_name="booking"
    )

    # --- Booking QR (NEW — additional to the permanent Entry/Meal/Volunteer
    # QR system in crowd_status; this token is specific to THIS booking) ---
    encrypted_qr = models.TextField(blank=True, default="")
    qr_generated_at = models.DateTimeField(null=True, blank=True)
    qr_scanned_at = models.DateTimeField(null=True, blank=True)
    is_used = models.BooleanField(default=False)
    used_by_volunteer = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True,
        related_name="seva_bookings_scanned",
    )

    class Meta:
        ordering = ["-created_at"]
        indexes = [models.Index(fields=["booking_code"]), models.Index(fields=["date"]), models.Index(fields=["status"])]

    def save(self, *args, **kwargs):
        if not self.booking_code:
            last = Booking.objects.order_by("-id").first()
            next_id = (last.id + 1) if last else 1
            self.booking_code = f"BKG-{50000 + next_id}"
        super().save(*args, **kwargs)

    def __str__(self):
        return self.booking_code

    # Seva start/end datetime is NOT duplicated onto Booking (Sec.4) — it's
    # always read live off the linked Seva via these convenience properties,
    # which the serializer/PDF both use.
    @property
    def seva_start_datetime(self):
        return self.seva.start_datetime

    @property
    def seva_end_datetime(self):
        return self.seva.end_datetime


class Bill(models.Model):
    class PaymentStatus(models.TextChoices):
        PENDING = "pending", "Pending"
        PAID = "paid", "Paid"
        FAILED = "failed", "Failed"

    bill_number = models.CharField(max_length=20, unique=True, editable=False)
    invoice_number = models.CharField(max_length=20, unique=True, editable=False)

    devotee = models.ForeignKey("devotees.Devotee", on_delete=models.PROTECT, related_name="bills")
    seva = models.ForeignKey(Seva, on_delete=models.PROTECT, related_name="bills")
    amount = models.DecimalField(max_digits=10, decimal_places=2)

    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name="bills_created"
    )
    volunteer = models.ForeignKey(
        "volunteers.Volunteer", on_delete=models.SET_NULL, null=True, blank=True, related_name="referred_bills"
    )

    payment_status = models.CharField(max_length=20, choices=PaymentStatus.choices, default=PaymentStatus.PENDING)
    razorpay_order_id = models.CharField(max_length=100, blank=True, default="")
    razorpay_payment_id = models.CharField(max_length=100, blank=True, default="")
    razorpay_signature = models.CharField(max_length=255, blank=True, default="")

    created_at = models.DateTimeField(auto_now_add=True)
    paid_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["bill_number"]),
            models.Index(fields=["payment_status"]),
        ]

    def save(self, *args, **kwargs):
        if not self.bill_number:
            last = Bill.objects.order_by("-id").first()
            next_id = (last.id + 1) if last else 1
            self.bill_number = f"BILL{next_id:05d}"
            self.invoice_number = f"INV-{1000 + next_id}"
        super().save(*args, **kwargs)

    def __str__(self):
        return self.bill_number


# ---------------------------------------------------------------------------
# NEW: Meal Booking — separate from Booking (which is Seva-only) and from
# crowd_status.MealCollection (which tracks scans against the devotee's
# PERMANENT meal QR, not a specific booking). This is booking-specific.
# ---------------------------------------------------------------------------
class MealBooking(models.Model):
    class Status(models.TextChoices):
        PENDING = "pending", "Pending"
        CONFIRMED = "confirmed", "Confirmed"
        COMPLETED = "completed", "Completed"
        CANCELLED = "cancelled", "Cancelled"

    booking_code = models.CharField(max_length=20, unique=True, editable=False)
    devotee = models.ForeignKey("devotees.Devotee", on_delete=models.CASCADE, related_name="meal_bookings")
    meal_name = models.CharField(max_length=150)
    meal_date = models.DateField()
    meal_time = models.CharField(max_length=20)
    amount = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.PENDING)
    created_at = models.DateTimeField(auto_now_add=True)

    # --- Booking QR (same shape as Booking's, see bookings/booking_qr.py) ---
    encrypted_qr = models.TextField(blank=True, default="")
    qr_generated_at = models.DateTimeField(null=True, blank=True)
    qr_scanned_at = models.DateTimeField(null=True, blank=True)
    is_used = models.BooleanField(default=False)
    used_by_volunteer = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True,
        related_name="meal_bookings_scanned",
    )

    class Meta:
        ordering = ["-created_at"]
        indexes = [models.Index(fields=["booking_code"]), models.Index(fields=["meal_date"]), models.Index(fields=["status"])]

    def save(self, *args, **kwargs):
        if not self.booking_code:
            last = MealBooking.objects.order_by("-id").first()
            next_id = (last.id + 1) if last else 1
            self.booking_code = f"ML-{5000 + next_id}"
        super().save(*args, **kwargs)

    def __str__(self):
        return self.booking_code


# ---------------------------------------------------------------------------
# Auto-generate the Booking QR the moment a booking is CONFIRMED.
# Uses queryset.update() (not instance.save()) so this never re-triggers
# post_save recursively and never clobbers other fields — same pattern
# crowd_status.ManualCounter's signal uses.
# ---------------------------------------------------------------------------
@receiver(post_save, sender=Booking, dispatch_uid="generate_seva_booking_qr")
def _generate_seva_booking_qr(sender, instance: "Booking", created, **kwargs):
    if instance.status != Booking.Status.CONFIRMED or instance.encrypted_qr:
        return
    from .booking_qr import build_seva_booking_qr  # local import avoids any circularity
    token = build_seva_booking_qr(instance)
    Booking.objects.filter(pk=instance.pk).update(encrypted_qr=token, qr_generated_at=timezone.now())


@receiver(post_save, sender=MealBooking, dispatch_uid="generate_meal_booking_qr")
def _generate_meal_booking_qr(sender, instance: "MealBooking", created, **kwargs):
    if instance.status != MealBooking.Status.CONFIRMED or instance.encrypted_qr:
        return
    from .booking_qr import build_meal_booking_qr
    token = build_meal_booking_qr(instance)
    MealBooking.objects.filter(pk=instance.pk).update(encrypted_qr=token, qr_generated_at=timezone.now())