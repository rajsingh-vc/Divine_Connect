from rest_framework import serializers

from .models import AiInsight, Alert


class AlertSerializer(serializers.ModelSerializer):
    class Meta:
        model = Alert
        fields = ["id", "alert_code", "severity", "category", "description", "is_active", "created_at"]
        read_only_fields = ["id", "alert_code", "created_at"]


class AiInsightSerializer(serializers.ModelSerializer):
    class Meta:
        model = AiInsight
        fields = ["id", "title", "detail", "created_at"]
        read_only_fields = ["id", "created_at"]
