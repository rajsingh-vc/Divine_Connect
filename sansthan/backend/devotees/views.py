from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import Devotee
from .permissions import IsAdminOrReadOnly
from .serializers import DevoteeSerializer


class DevoteeViewSet(viewsets.ModelViewSet):
    """Read (list/retrieve/search): any authenticated user — admin,
    volunteer, devotee. Write (create/update/partial_update/destroy):
    admins only — see IsAdminOrReadOnly."""

    queryset = Devotee.objects.select_related("user").all()
    serializer_class = DevoteeSerializer
    permission_classes = [IsAdminOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ["tier", "city"]
    search_fields = ["full_name", "devotee_code", "mobile"]
    ordering_fields = ["created_at", "visits", "total_donated"]

    @action(detail=False, methods=["get"], url_path="search")
    def search(self, request):
        """GET /api/devotees/search/?q=... — searches name and devotee ID."""
        from django.db.models import Q

        q = request.query_params.get("q", "")
        qs = self.get_queryset()
        if q:
            qs = qs.filter(Q(full_name__icontains=q) | Q(devotee_code__icontains=q))
        page = self.paginate_queryset(qs)
        serializer = self.get_serializer(page or qs, many=True)
        return self.get_paginated_response(serializer.data) if page is not None else Response(serializer.data)