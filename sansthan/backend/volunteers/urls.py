from rest_framework.routers import DefaultRouter
from .views import VolunteerViewSet, NotificationViewSet

router = DefaultRouter()
router.register("volunteers", VolunteerViewSet, basename="volunteer")
router.register("notifications", NotificationViewSet, basename="volunteer-notification")

urlpatterns = router.urls