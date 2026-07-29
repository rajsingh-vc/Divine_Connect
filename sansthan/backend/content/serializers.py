from rest_framework import serializers

from .models import ContentPage, Announcement


class ContentPageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContentPage
        fields = ["id", "title", "slug", "body", "status", "created_at", "updated_at"]
        read_only_fields = ["id", "created_at", "updated_at"]


class AnnouncementSerializer(serializers.ModelSerializer):
    sent_by_name = serializers.CharField(source="sent_by.get_full_name", read_only=True, default="")

    class Meta:
        model = Announcement
        fields = ["id", "type", "title", "description", "sent_at", "sent_by", "sent_by_name"]
        read_only_fields = ["id", "sent_at", "sent_by", "sent_by_name"]