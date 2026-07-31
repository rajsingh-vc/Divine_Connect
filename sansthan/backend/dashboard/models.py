# The dashboard is a read-only aggregation layer over other apps' models.
# Alert and LiveFestivalInfo are kept as lightweight models so ops staff can
# post live alerts / festival schedule info that shows up on the command
# centre without redeploying.
from django.db import models


class Alert(models.Model):
    class Severity(models.TextChoices):
        HIGH = "high", "High"
        MEDIUM = "medium", "Medium"
        LOW = "low", "Low"

    alert_code = models.CharField(max_length=20, unique=True, editable=False)
    severity = models.CharField(max_length=20, choices=Severity.choices)
    category = models.CharField(max_length=100)
    description = models.CharField(max_length=255)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def save(self, *args, **kwargs):
        if not self.alert_code:
            last = Alert.objects.order_by("-id").first()
            next_id = (last.id + 1) if last else 1
            self.alert_code = f"ALT-{2200 + next_id}"
        super().save(*args, **kwargs)

    def __str__(self):
        return self.alert_code


class LiveFestivalInfo(models.Model):
    """Live festival schedule entries shown on the Command Dashboard —
    e.g. "Aarti" 6:00-6:30 AM, "VIP Darshan" 10:00-11:00 AM. Admins add /
    edit / remove these entries; every logged-in user can view them.
    """

    # Name of the event/slot, e.g. "Aarti", "VIP Darshan", "Annadanam".
    title = models.CharField(max_length=200)
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    description = models.TextField(blank=True, default="")
    # Lets an admin hide a past/cancelled entry without deleting it.
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["start_time"]

    def __str__(self):
        return f"{self.title} ({self.start_time:%d %b, %H:%M})"