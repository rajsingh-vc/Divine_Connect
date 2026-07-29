from django.conf import settings
from django.db import models


class Devotee(models.Model):
    class Tier(models.TextChoices):
        MEMBER = "member", "Member"
        VIP = "vip", "VIP"

    # Nullable: a devotee profile can either be linked to a login (self-signup)
    # or be a walk-in record created directly by staff from the console — in
    # that case there's no user account, so name/email live on this model.
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="devotee_profile", null=True, blank=True
    )
    devotee_code = models.CharField(max_length=20, unique=True, editable=False)
    full_name = models.CharField(max_length=150)
    email = models.EmailField(blank=True, default="")
    mobile = models.CharField(max_length=20, blank=True, default="")
    city = models.CharField(max_length=100, blank=True, default="")
    tier = models.CharField(max_length=20, choices=Tier.choices, default=Tier.MEMBER)
    visits = models.PositiveIntegerField(default=0)
    total_donated = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]
        indexes = [models.Index(fields=["devotee_code"]), models.Index(fields=["city"])]

    def save(self, *args, **kwargs):
        if not self.devotee_code:
            last = Devotee.objects.order_by("-id").first()
            next_id = (last.id + 1) if last else 1
            self.devotee_code = f"DVT-{10000 + next_id}"
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.devotee_code} - {self.full_name}"
