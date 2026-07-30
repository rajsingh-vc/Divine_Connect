from django.contrib.auth import get_user_model
from django.db import transaction
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters, permissions, viewsets
from rest_framework.parsers import MultiPartParser, FormParser

from .models import TempleInfo
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import ContentPage, Announcement, GalleryItem, FAQ, NewsPost
from .serializers import (
    ContentPageSerializer,
    AnnouncementSerializer,
    GalleryItemSerializer,
    FAQSerializer,
    NewsPostSerializer,
    TempleInfoSerializer,
)

User = get_user_model()


class IsAdminOrReadOnly(permissions.BasePermission):
    """Anyone authenticated can view; only admins can upload/edit/delete."""

    def has_permission(self, request, view):
        if not (request.user and request.user.is_authenticated):
            return False
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user.user_type == User.UserType.ADMIN


class IsAdminOrReadOnlyNews(permissions.BasePermission):
    """Anyone authenticated can view; only admins can create/edit/delete."""

    def has_permission(self, request, view):
        if not (request.user and request.user.is_authenticated):
            return False
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user.user_type == User.UserType.ADMIN


class NewsPostViewSet(viewsets.ModelViewSet):
    serializer_class = NewsPostSerializer
    permission_classes = [IsAdminOrReadOnlyNews]
    parser_classes = [MultiPartParser, FormParser]
    lookup_field = "pk"

    def get_queryset(self):
        qs = NewsPost.objects.all()
        user = self.request.user
        if not (user and user.is_authenticated and user.user_type == User.UserType.ADMIN):
            qs = qs.filter(status=NewsPost.Status.PUBLISHED)
        return qs

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)


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


class GalleryItemViewSet(viewsets.ModelViewSet):
    queryset = GalleryItem.objects.select_related("uploaded_by")
    serializer_class = GalleryItemSerializer
    permission_classes = [IsAdminOrReadOnly]
    parser_classes = [MultiPartParser, FormParser]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ["year", "media_type"]
    search_fields = ["title", "description"]
    ordering_fields = ["year", "created_at"]

    def perform_create(self, serializer):
        serializer.save(uploaded_by=self.request.user)


class FAQViewSet(viewsets.ModelViewSet):
    """FAQs module. Public users only see published FAQs; admins see and manage all."""
    serializer_class = FAQSerializer
    permission_classes = [IsAdminOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ["is_published"]
    search_fields = ["question", "answer"]
    ordering_fields = ["order", "created_at"]

    def get_queryset(self):
        qs = FAQ.objects.all()
        if not (self.request.user.is_authenticated and self.request.user.user_type == User.UserType.ADMIN):
            qs = qs.filter(is_published=True)
        return qs




class TempleInfoViewSet(viewsets.ViewSet):
    """Singleton resource — GET returns the one row, PATCH updates it. Admin-only writes."""
    permission_classes = [IsAdminOrReadOnly]
    parser_classes = [MultiPartParser, FormParser]

    def list(self, request):
        obj = TempleInfo.load()
        serializer = TempleInfoSerializer(obj, context={"request": request})
        return Response(serializer.data)

    @action(detail=False, methods=["patch"])
    def update_info(self, request):
        obj = TempleInfo.load()
        serializer = TempleInfoSerializer(obj, data=request.data, partial=True, context={"request": request})
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)