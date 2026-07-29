from django.contrib import admin

from .models import ContentPage, Announcement


@admin.register(ContentPage)
class ContentPageAdmin(admin.ModelAdmin):
    list_display = ("title", "slug", "status", "updated_at")
    list_filter = ("status",)
    search_fields = ("title", "slug")


@admin.register(Announcement)
class AnnouncementAdmin(admin.ModelAdmin):
    list_display = ("title", "type", "sent_by", "sent_at")
    list_filter = ("type",)
    search_fields = ("title", "description")
    readonly_fields = ("sent_at",)