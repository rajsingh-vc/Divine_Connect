from django.contrib.auth import get_user_model
from django.db import transaction
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters, permissions, viewsets

from .models import ContentPage, Announcement
from .serializers import ContentPageSerializer, AnnouncementSerializer

User = get_user_model()


class ContentPageViewSet(viewsets.ModelViewSet):
    queryset = ContentPage.objects.all()
    serializer_class = ContentPageSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ["status"]
    search_fields = ["title", "slug"]
    ordering_fields = ["updated_at"]


class AnnouncementViewSet(viewsets.ModelViewSet):
    """Notification Templates module.

    POST creates an Announcement (type: immediate/important, title,
    description) and — inside the same transaction — pushes a Notification
    to every volunteer's bell. GET/list is the send history shown in the
    CMS panel. No update/delete: it's a send log, not an editable draft.
    """
    queryset = Announcement.objects.select_related("sent_by")
    serializer_class = AnnouncementSerializer
    permission_classes = [permissions.IsAdminUser]
    http_method_names = ["get", "post", "head", "options"]
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ["sent_at"]

    def perform_create(self, serializer):
        # Local import to avoid cross-app import ordering issues at startup.
        from volunteers.models import Notification  # adjust path if your app label differs

        with transaction.atomic():
            announcement = serializer.save(sent_by=self.request.user)

            # Announcement.Type.IMMEDIATE (content app) maps to the existing
            # Notification.Type.ANNOUNCEMENT_URGENT (volunteers app) — that
            # enum name is unchanged, only its user-facing label/context in
            # the content app is called "Immediate" now.
            notif_type = (
                Notification.Type.ANNOUNCEMENT_URGENT
                if announcement.type == Announcement.Type.IMMEDIATE
                else Notification.Type.ANNOUNCEMENT_IMPORTANT
            )

            volunteers = User.objects.filter(user_type=User.UserType.VOLUNTEER)
            Notification.objects.bulk_create([
                Notification(
                    recipient=user,
                    title=announcement.title,
                    message=announcement.description,
                    type=notif_type,
                )
                for user in volunteers
            ])