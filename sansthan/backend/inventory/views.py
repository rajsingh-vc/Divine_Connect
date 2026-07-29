from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters, viewsets

from .models import InventoryItem
from .serializers import InventoryItemSerializer


class InventoryItemViewSet(viewsets.ModelViewSet):
    queryset = InventoryItem.objects.all()
    serializer_class = InventoryItemSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    search_fields = ["item_name", "sku"]
    ordering_fields = ["stock", "item_name"]
