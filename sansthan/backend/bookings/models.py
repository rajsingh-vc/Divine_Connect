from django.conf import settings
from django.db import models


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

    class Meta:
        ordering = ["name"]
        indexes = [models.Index(fields=["category"])]

    def __str__(self):
        return self.name


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

    # Populated automatically when this booking was created from a paid Bill
    # (Sevas & Services -> Generate Bill -> Razorpay flow). Left blank/null
    # for bookings made directly on the Booking Management page.
    payment_id = models.CharField(max_length=100, blank=True, default="")
    bill = models.OneToOneField(
        "bookings.Bill", on_delete=models.SET_NULL, null=True, blank=True, related_name="booking"
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


class Bill(models.Model):
    """
    A generated bill/invoice for a devotee taking a seva.

    Powers the "Sevas & Services" console flow:
        pick seva -> choose devotee (+ optional volunteer) -> Generate Bill
        -> pay via Razorpay -> invoice saved.

    Kept separate from `Booking` (which is slot/date driven for the booking
    calendar) — a Bill is the walk-in/counter billing record an
    Admin/Volunteer creates on the spot, with optional volunteer attribution.
    """

    class PaymentStatus(models.TextChoices):
        PENDING = "pending", "Pending"
        PAID = "paid", "Paid"
        FAILED = "failed", "Failed"

    bill_number = models.CharField(max_length=20, unique=True, editable=False)
    invoice_number = models.CharField(max_length=20, unique=True, editable=False)

    devotee = models.ForeignKey("devotees.Devotee", on_delete=models.PROTECT, related_name="bills")
    seva = models.ForeignKey(Seva, on_delete=models.PROTECT, related_name="bills")
    amount = models.DecimalField(max_digits=10, decimal_places=2)

    # Who generated the bill (Admin or Volunteer console user).
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name="bills_created"
    )

    # Set only when a volunteer personally brought the devotee in for this
    # seva — nullable, used for referral / attribution reporting.
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