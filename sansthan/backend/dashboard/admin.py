from django.contrib import admin

from .models import AiInsight, Alert

admin.site.register(Alert)
admin.site.register(AiInsight)
