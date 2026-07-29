from rest_framework import serializers

from devotees.models import Devotee
from volunteers.models import Volunteer

from .models import Bill, Booking, Seva


class SevaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Seva
        fields = [
            "id", "name", "category", "price", "duration_minutes",
            "slots_per_day", "capacity", "priest", "description", "is_active",
        ]


class BookingSerializer(serializers.ModelSerializer):
    devotee_name = serializers.CharField(source="devotee.full_name", read_only=True)
    seva_name = serializers.CharField(source="seva.name", read_only=True)
    bill_number = serializers.CharField(source="bill.bill_number", read_only=True, default="")

    class Meta:
        model = Booking
        fields = [
            "id", "booking_code", "devotee", "devotee_name", "seva", "seva_name",
            "date", "slot", "amount", "channel", "status", "created_at",
            "payment_id", "bill", "bill_number",
        ]
        read_only_fields = ["id", "booking_code", "created_at", "payment_id", "bill", "bill_number"]


# ---------------------------------------------------------------------------
# Bills — "Sevas & Services" > Generate Bill > Razorpay > Invoice flow
# ---------------------------------------------------------------------------
class BillSerializer(serializers.ModelSerializer):
    devotee_name = serializers.CharField(source="devotee.full_name", read_only=True)
    devotee_code = serializers.CharField(source="devotee.devotee_code", read_only=True)
    devotee_mobile = serializers.CharField(source="devotee.mobile", read_only=True)
    seva_name = serializers.CharField(source="seva.name", read_only=True)
    volunteer_name = serializers.CharField(source="volunteer.full_name", read_only=True, default=None)
    volunteer_code = serializers.CharField(source="volunteer.volunteer_code", read_only=True, default=None)
    created_by_name = serializers.CharField(source="created_by.full_name", read_only=True, default=None)

    class Meta:
        model = Bill
        fields = [
            "id", "bill_number", "invoice_number",
            "devotee", "devotee_name", "devotee_code", "devotee_mobile",
            "seva", "seva_name", "amount",
            "volunteer", "volunteer_name", "volunteer_code",
            "created_by", "created_by_name",
            "payment_status", "razorpay_order_id", "razorpay_payment_id",
            "created_at", "paid_at",
        ]
        read_only_fields = [
            "id", "bill_number", "invoice_number", "created_by",
            "payment_status", "razorpay_order_id", "razorpay_payment_id",
            "created_at", "paid_at",
        ]


class GenerateBillSerializer(serializers.Serializer):
    """Input for POST /api/bills/generate/ — the 'Generate Bill' button on the
    Sevas & Services page: pick a seva, choose a devotee, optionally record the
    volunteer who brought them in."""

    devotee = serializers.PrimaryKeyRelatedField(queryset=Devotee.objects.all())
    seva = serializers.PrimaryKeyRelatedField(queryset=Seva.objects.all())
    volunteer = serializers.PrimaryKeyRelatedField(queryset=Volunteer.objects.all(), required=False, allow_null=True)
    amount = serializers.DecimalField(max_digits=10, decimal_places=2, required=False)