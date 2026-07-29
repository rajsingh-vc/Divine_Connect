from django.db.models import Sum
from django.db.models.functions import TruncMonth
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import Donation
from .serializers import DonationSerializer


class DonationViewSet(viewsets.ModelViewSet):
    queryset = Donation.objects.select_related("devotee").all()
    serializer_class = DonationSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ["purpose", "is_anonymous"]
    search_fields = ["donation_code", "donor_name", "devotee__full_name"]
    ordering_fields = ["created_at", "amount"]

    @action(detail=False, methods=["get"], url_path="trend")
    def trend(self, request):
        """GET /api/donations/trend/ — monthly totals for the trend chart."""
        qs = (
            self.get_queryset()
            .annotate(month=TruncMonth("created_at"))
            .values("month")
            .annotate(amount=Sum("amount"))
            .order_by("month")
        )
        return Response([{"month": row["month"].strftime("%b") if row["month"] else "", "amount": float(row["amount"] or 0)} for row in qs])
