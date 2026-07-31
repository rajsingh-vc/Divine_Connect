from rest_framework import serializers

from .models import Alert, LiveFestivalInfo


class AlertSerializer(serializers.ModelSerializer):
    class Meta:
        model = Alert
        fields = ["id", "alert_code", "severity", "category", "description", "is_active", "created_at"]
        read_only_fields = ["id", "alert_code", "created_at"]


class LiveFestivalInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = LiveFestivalInfo
        fields = [
            "id", "title", "start_time", "end_time", "description",
            "is_active", "created_at", "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]

    def validate(self, attrs):
        start = attrs.get("start_time", getattr(self.instance, "start_time", None))
        end = attrs.get("end_time", getattr(self.instance, "end_time", None))
        if start and end and end <= start:
            raise serializers.ValidationError({"end_time": "End time must be after start time."})
        return attrs