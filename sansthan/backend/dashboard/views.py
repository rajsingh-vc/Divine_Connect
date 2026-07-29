from django.db.models import Sum
from django.utils import timezone
from rest_framework import viewsets
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from bookings.models import Booking
from devotees.models import Devotee
from donations.models import Donation
from events.models import Event, Visitor
from inventory.models import InventoryItem
from volunteers.models import Volunteer

from .models import AiInsight, Alert
from .serializers import AiInsightSerializer, AlertSerializer


class AlertViewSet(viewsets.ModelViewSet):
    queryset = Alert.objects.all()
    serializer_class = AlertSerializer


class AiInsightViewSet(viewsets.ModelViewSet):
    queryset = AiInsight.objects.all()
    serializer_class = AiInsightSerializer


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def dashboard_stats(request):
    """GET /api/dashboard/stats/ — headline KPIs for the command centre."""
    today = timezone.now().date()

    live_visitors = Visitor.objects.filter(status=Visitor.Status.INSIDE).count()
    todays_bookings = Booking.objects.filter(date=today).count()
    todays_donations = Donation.objects.filter(created_at__date=today).aggregate(total=Sum("amount"))["total"] or 0
    volunteers_on_duty = Volunteer.objects.filter(status=Volunteer.Status.ADMIN_APPROVED).count()
    total_volunteers = Volunteer.objects.count()
    revenue_mtd = Donation.objects.filter(created_at__month=today.month, created_at__year=today.year).aggregate(
        total=Sum("amount")
    )["total"] or 0

    return Response(
        {
            "liveVisitors": {"value": live_visitors},
            "todaysBookings": {"value": todays_bookings},
            "todaysDonations": {"value": float(todays_donations)},
            "volunteersOnDuty": {"value": f"{volunteers_on_duty} / {total_volunteers}"},
            "revenueMTD": {"value": float(revenue_mtd)},
            "totalDevotees": {"value": Devotee.objects.count()},
            "totalEvents": {"value": Event.objects.count()},
            "inventoryAlerts": {
                "value": sum(1 for item in InventoryItem.objects.all() if item.status != InventoryItem.Status.OK)
            },
        }
    )


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def visitor_flow(request):
    """GET /api/dashboard/visitor-flow/ — hourly visitor/booking counts for today."""
    from django.db.models.functions import ExtractHour

    today = timezone.now().date()
    visitors_by_hour = (
        Visitor.objects.filter(check_in__date=today)
        .annotate(hour=ExtractHour("check_in"))
        .values("hour")
        .order_by("hour")
    )
    bookings_by_hour = (
        Booking.objects.filter(date=today)
        .annotate(hour=ExtractHour("created_at"))
        .values("hour")
        .order_by("hour")
    )

    visitor_counts = {row["hour"]: 0 for row in visitors_by_hour}
    for row in Visitor.objects.filter(check_in__date=today):
        visitor_counts[row.check_in.hour] = visitor_counts.get(row.check_in.hour, 0) + 1

    booking_counts = {}
    for b in Booking.objects.filter(date=today):
        h = b.created_at.hour
        booking_counts[h] = booking_counts.get(h, 0) + 1

    result = []
    for hour in range(0, 24, 2):
        result.append(
            {
                "hour": f"{hour:02d}:00",
                "visitors": visitor_counts.get(hour, 0),
                "bookings": booking_counts.get(hour, 0),
            }
        )
    return Response(result)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def revenue_mix(request):
    """GET /api/dashboard/revenue-mix/ — revenue split by donation purpose (proxy for revenue sources)."""
    qs = Donation.objects.values("purpose").annotate(value=Sum("amount")).order_by("-value")
    return Response([{"name": row["purpose"], "value": float(row["value"] or 0)} for row in qs])
