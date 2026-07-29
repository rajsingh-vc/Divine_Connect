from rest_framework import serializers

from .models import Devotee


class DevoteeSerializer(serializers.ModelSerializer):
    name = serializers.CharField(source="full_name")

    class Meta:
        model = Devotee
        fields = [
            "id", "devotee_code", "name", "email", "mobile", "city",
            "tier", "visits", "total_donated", "created_at", "user",
        ]
        read_only_fields = ["id", "devotee_code", "created_at"]
        extra_kwargs = {"user": {"required": False, "allow_null": True}}
