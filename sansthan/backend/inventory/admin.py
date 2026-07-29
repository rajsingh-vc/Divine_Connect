from django.contrib import admin

from .models import InventoryItem


@admin.register(InventoryItem)
class InventoryItemAdmin(admin.ModelAdmin):
    list_display = ("sku", "item_name", "stock", "min_threshold", "status")
    search_fields = ("sku", "item_name")
