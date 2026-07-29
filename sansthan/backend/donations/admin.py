from django.contrib import admin

from .models import Donation


@admin.register(Donation)
class DonationAdmin(admin.ModelAdmin):
    list_display = ("donation_code", "donor_name", "amount", "purpose", "created_at")
    list_filter = ("purpose", "is_anonymous")
    search_fields = ("donation_code", "donor_name")
