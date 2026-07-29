from rest_framework import serializers

from .models import Donation


class DonationSerializer(serializers.ModelSerializer):
    devotee_name = serializers.CharField(source="devotee.full_name", read_only=True, default=None)

    class Meta:
        model = Donation
        fields = [
            "id", "donation_code", "devotee", "devotee_name", "donor_name",
            "amount", "purpose", "is_anonymous", "payment_reference", "created_at",
        ]
        read_only_fields = ["id", "donation_code", "created_at"]
