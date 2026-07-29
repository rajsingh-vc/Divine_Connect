import logging

import razorpay
from django.conf import settings
from django.utils import timezone
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import Bill, Booking, Seva
from .serializers import BillSerializer, BookingSerializer, GenerateBillSerializer, SevaSerializer

logger = logging.getLogger(__name__)


def get_razorpay_client():
    return razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))


class SevaViewSet(viewsets.ModelViewSet):
    queryset = Seva.objects.all()
    serializer_class = SevaSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ["category", "is_active"]
    search_fields = ["name", "category", "priest"]
    ordering_fields = ["price", "name"]


class BookingViewSet(viewsets.ModelViewSet):
    queryset = Booking.objects.select_related("devotee", "seva").all()
    serializer_class = BookingSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ["status", "channel", "date", "seva"]
    search_fields = ["booking_code", "devotee__full_name", "seva__name"]
    ordering_fields = ["created_at", "date", "amount"]


class BillViewSet(viewsets.ModelViewSet):
    """
    Powers the "Sevas & Services" -> Generate Bill -> Razorpay -> Invoice flow.

    - Admins see every bill.
    - Volunteers see only the bills they personally created.
    - Devotees (if ever given console access) see only their own bills.

    Bills are generated (POST /generate/) and paid (POST /<id>/verify/) —
    they are not hand-edited or deleted once created, so plain create/update
    /destroy is intentionally left off the router.
    """

    queryset = Bill.objects.select_related("devotee", "seva", "volunteer", "created_by").all()
    serializer_class = BillSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ["payment_status", "seva", "devotee", "volunteer"]
    search_fields = ["bill_number", "invoice_number", "devotee__full_name", "seva__name"]
    ordering_fields = ["created_at", "amount"]
    http_method_names = ["get", "post", "head", "options"]

    def get_queryset(self):
        qs = super().get_queryset()
        user = self.request.user
        user_type = getattr(user, "user_type", None)
        if user_type == "volunteer":
            return qs.filter(created_by=user)
        if user_type == "devotee":
            return qs.filter(devotee__user=user)
        return qs  # admin/staff see every bill

    @action(detail=False, methods=["post"], url_path="generate")
    def generate(self, request):
        """Step 1: pick a seva + devotee (+ optional volunteer) -> creates a
        Bill and a matching Razorpay order in one call."""
        serializer = GenerateBillSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        seva = data["seva"]
        amount = data.get("amount") or seva.price

        bill = Bill.objects.create(
            devotee=data["devotee"],
            seva=seva,
            amount=amount,
            volunteer=data.get("volunteer"),
            created_by=request.user if request.user.is_authenticated else None,
        )

        client = get_razorpay_client()
        try:
            order = client.order.create({
                "amount": int(amount * 100),  # paise
                "currency": "INR",
                "receipt": bill.bill_number,
                "payment_capture": 1,
                "notes": {"bill_number": bill.bill_number, "seva_name": seva.name},
            })
        except Exception as exc:
            logger.exception("Razorpay order creation failed for bill %s", bill.bill_number)
            bill.delete()
            return Response(
                {"error": "Could not create Razorpay order", "details": str(exc)},
                status=status.HTTP_502_BAD_GATEWAY,
            )

        bill.razorpay_order_id = order["id"]
        bill.save(update_fields=["razorpay_order_id"])

        return Response(
            {
                "bill": BillSerializer(bill).data,
                "razorpay": {
                    "order_id": order["id"],
                    "amount": order["amount"],
                    "currency": order["currency"],
                    "key": settings.RAZORPAY_KEY_ID,
                },
            },
            status=status.HTTP_201_CREATED,
        )

    @action(detail=True, methods=["post"], url_path="verify")
    def verify(self, request, pk=None):
        """Step 2: verify the Razorpay signature returned by checkout.js and
        mark the bill Paid, saving the payment + invoice."""
        bill = self.get_object()
        payment_id = request.data.get("razorpay_payment_id")
        order_id = request.data.get("razorpay_order_id")
        signature = request.data.get("razorpay_signature")

        if not (payment_id and order_id and signature):
            return Response(
                {"verified": False, "message": "Missing Razorpay fields"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if order_id != bill.razorpay_order_id:
            return Response(
                {"verified": False, "message": "Order does not match this bill"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if bill.payment_status == Bill.PaymentStatus.PAID:
            return Response({"verified": True, "bill": BillSerializer(bill).data})

        client = get_razorpay_client()
        try:
            client.utility.verify_payment_signature({
                "razorpay_order_id": order_id,
                "razorpay_payment_id": payment_id,
                "razorpay_signature": signature,
            })
            verified = True
        except razorpay.errors.SignatureVerificationError:
            verified = False

        bill.razorpay_payment_id = payment_id
        bill.razorpay_signature = signature

        if not verified:
            bill.payment_status = Bill.PaymentStatus.FAILED
            bill.save(update_fields=["razorpay_payment_id", "razorpay_signature", "payment_status"])
            return Response(
                {"verified": False, "message": "Invalid payment signature"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        bill.payment_status = Bill.PaymentStatus.PAID
        bill.paid_at = timezone.now()
        bill.save(update_fields=["razorpay_payment_id", "razorpay_signature", "payment_status", "paid_at"])

        # Make this paid bill show up in Booking Management too, with the
        # Razorpay payment id attached, so admins/volunteers see every
        # payment — whether it came from the booking calendar or a
        # Sevas & Services counter bill — in one place.
        if not hasattr(bill, "booking"):
            Booking.objects.create(
                devotee=bill.devotee,
                seva=bill.seva,
                date=timezone.localdate(),
                slot="Walk-in",
                amount=bill.amount,
                channel=Booking.Channel.COUNTER,
                status=Booking.Status.CONFIRMED,
                payment_id=payment_id,
                bill=bill,
            )

        return Response({"verified": True, "bill": BillSerializer(bill).data})