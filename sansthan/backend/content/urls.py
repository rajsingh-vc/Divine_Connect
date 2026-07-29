from rest_framework.routers import DefaultRouter

from .views import ContentPageViewSet, AnnouncementViewSet

router = DefaultRouter()
router.register(r"pages", ContentPageViewSet, basename="content-page")
router.register(r"announcements", AnnouncementViewSet, basename="announcement")

urlpatterns = router.urls