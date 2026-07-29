from django.urls import path
from rest_framework.routers import DefaultRouter

from .views import AiInsightViewSet, AlertViewSet, dashboard_stats, revenue_mix, visitor_flow

router = DefaultRouter()
router.register(r"insights", AiInsightViewSet, basename="ai-insight")
router.register(r"alerts", AlertViewSet, basename="alert")

urlpatterns = [
    path("stats/", dashboard_stats, name="dashboard-stats"),
    path("visitor-flow/", visitor_flow, name="dashboard-visitor-flow"),
    path("revenue-mix/", revenue_mix, name="dashboard-revenue-mix"),
] + router.urls
