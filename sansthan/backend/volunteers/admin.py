from django.contrib import admin
from .models import Volunteer, Verification, VolunteerApproval, Notification, AuditLog

admin.site.register(Volunteer)
admin.site.register(Verification)
admin.site.register(VolunteerApproval)
admin.site.register(Notification)
admin.site.register(AuditLog)