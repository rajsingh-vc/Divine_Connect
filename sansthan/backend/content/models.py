from django.conf import settings
from django.db import models


class ContentPage(models.Model):
    class Status(models.TextChoices):
        DRAFT = "draft", "Draft"
        PUBLISHED = "published", "Published"

    title = models.CharField(max_length=200)
    slug = models.SlugField(max_length=220, unique=True)
    body = models.TextField(blank=True, default="")
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.DRAFT)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-updated_at"]
        indexes = [models.Index(fields=["slug"]), models.Index(fields=["status"])]

    def __str__(self):
        return self.title


class Announcement(models.Model):
    """A CMS 'Notification Template' send. Creating one fans out a
    Notification to every volunteer's bell — see AnnouncementViewSet.
    """
    class Type(models.TextChoices):
        IMMEDIATE = "immediate", "Immediate"
        IMPORTANT = "important", "Important"

    type = models.CharField(max_length=20, choices=Type.choices)
    title = models.CharField(max_length=200)
    description = models.TextField()
    sent_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, null=True, blank=True, on_delete=models.SET_NULL, related_name="sent_announcements"
    )
    sent_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-sent_at"]
        indexes = [models.Index(fields=["type"]), models.Index(fields=["sent_at"])]

    def __str__(self):
        return f"{self.get_type_display()} — {self.title}"