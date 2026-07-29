from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    """
    Custom user model used for both Devotees and Volunteers (and staff/admin).
    `user_type` distinguishes the account type across the whole system.
    """

    class UserType(models.TextChoices):
        DEVOTEE = "devotee", "Devotee"
        VOLUNTEER = "volunteer", "Volunteer"
        ADMIN = "admin", "Admin"

    email = models.EmailField(unique=True)
    full_name = models.CharField(max_length=150)
    user_type = models.CharField(max_length=20, choices=UserType.choices, default=UserType.DEVOTEE)
    phone = models.CharField(max_length=20, blank=True, default="")
    firebase_uid = models.CharField(max_length=255, unique=True, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        indexes = [
            models.Index(fields=["email"]),
            models.Index(fields=["user_type"]),
        ]

    def __str__(self):
        return f"{self.full_name} ({self.username})"
