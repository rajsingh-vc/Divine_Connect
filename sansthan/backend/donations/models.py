from django.db import models


class Donation(models.Model):
    class Purpose(models.TextChoices):
        GENERAL = "general", "General Fund"
        ANNADAAN = "annadaan", "Annadaan"
        CONSTRUCTION = "construction", "Construction"
        EDUCATION = "education", "Education"

    donation_code = models.CharField(max_length=20, unique=True, editable=False)
    devotee = models.ForeignKey("devotees.Devotee", on_delete=models.SET_NULL, null=True, blank=True, related_name="donations")
    donor_name = models.CharField(max_length=150, blank=True, default="")
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    purpose = models.CharField(max_length=30, choices=Purpose.choices, default=Purpose.GENERAL)
    is_anonymous = models.BooleanField(default=False)
    payment_reference = models.CharField(max_length=100, blank=True, default="")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]
        indexes = [models.Index(fields=["donation_code"]), models.Index(fields=["purpose"])]

    def save(self, *args, **kwargs):
        if not self.donation_code:
            last = Donation.objects.order_by("-id").first()
            next_id = (last.id + 1) if last else 1
            self.donation_code = f"DON-{70000 + next_id}"
        super().save(*args, **kwargs)

    def __str__(self):
        return self.donation_code
