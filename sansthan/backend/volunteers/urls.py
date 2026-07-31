from rest_framework.routers import DefaultRouter
from .views import VolunteerViewSet, NotificationViewSet, DutyViewSet

router = DefaultRouter()
router.register("volunteers", VolunteerViewSet, basename="volunteer")
router.register("notifications", NotificationViewSet, basename="volunteer-notification")
router.register("duties", DutyViewSet, basename="duty")

urlpatterns = router.urls