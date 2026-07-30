from rest_framework import serializers

from .models import ContentPage, Announcement

from .models import GalleryItem  # add GalleryItem to your existing models import line instead if you prefer

from .models import FAQ  # add FAQ to your existing models import line instead if you prefer


from .models import TempleInfo

class ContentPageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContentPage
        fields = ["id", "title", "slug", "body", "status", "created_at", "updated_at"]
        read_only_fields = ["id", "created_at", "updated_at"]


class AnnouncementSerializer(serializers.ModelSerializer):
    sent_by_name = serializers.CharField(source="sent_by.get_full_name", read_only=True, default="")

    class Meta:
        model = Announcement
        fields = ["id", "type", "title", "description", "sent_at", "sent_by", "sent_by_name"]
        read_only_fields = ["id", "sent_at", "sent_by", "sent_by_name"]




class GalleryItemSerializer(serializers.ModelSerializer):
    uploaded_by_name = serializers.CharField(source="uploaded_by.get_full_name", read_only=True, default="")

    class Meta:
        model = GalleryItem
        fields = [
            "id", "media_type", "file", "thumbnail", "title", "description",
            "year", "uploaded_by", "uploaded_by_name", "created_at",
        ]
        read_only_fields = ["id", "uploaded_by", "uploaded_by_name", "created_at"]




class FAQSerializer(serializers.ModelSerializer):
    class Meta:
        model = FAQ
        fields = ["id", "question", "answer", "order", "is_published", "created_at", "updated_at"]
        read_only_fields = ["id", "created_at", "updated_at"]



from rest_framework import serializers

from .models import NewsPost




class NewsPostSerializer(serializers.ModelSerializer):
    author = serializers.SerializerMethodField()
    photoUrl = serializers.SerializerMethodField()
    createdAt = serializers.DateTimeField(source="created_at", read_only=True)
    updatedAt = serializers.DateTimeField(source="updated_at", read_only=True)

    class Meta:
        model = NewsPost
        fields = [
            "id",
            "title",
            "slug",
            "excerpt",
            "content",
            "photo",
            "photoUrl",
            "status",
            "author",
            "createdAt",
            "updatedAt",
        ]
        read_only_fields = ["id", "slug", "photoUrl", "author", "createdAt", "updatedAt"]
        extra_kwargs = {
            "photo": {"write_only": True, "required": False},
        }

    def get_author(self, obj):
        if obj.author:
            return obj.author.get_full_name() or obj.author.username
        return None

    def get_photoUrl(self, obj):
        request = self.context.get("request")
        if obj.photo and hasattr(obj.photo, "url"):
            url = obj.photo.url
            return request.build_absolute_uri(url) if request else url
        return None

class NewsPostSerializer(serializers.ModelSerializer):
    author = serializers.SerializerMethodField()
    photoUrl = serializers.SerializerMethodField()
    createdAt = serializers.DateTimeField(source="created_at", read_only=True)
    updatedAt = serializers.DateTimeField(source="updated_at", read_only=True)

    class Meta:
        model = NewsPost
        fields = [
            "id",
            "title",
            "slug",
            "excerpt",
            "content",
            "photo",
            "photoUrl",
            "status",
            "author",
            "createdAt",
            "updatedAt",
        ]
        read_only_fields = ["id", "slug", "photoUrl", "author", "createdAt", "updatedAt"]
        extra_kwargs = {
            "photo": {"write_only": True, "required": False},
        }

    def get_author(self, obj):
        if obj.author:
            return obj.author.get_full_name() or obj.author.username
        return None

    def get_photoUrl(self, obj):
        request = self.context.get("request")
        if obj.photo and hasattr(obj.photo, "url"):
            url = obj.photo.url
            return request.build_absolute_uri(url) if request else url
        return None

class TempleInfoSerializer(serializers.ModelSerializer):
    establishedYear = serializers.CharField(source="established_year", required=False, allow_blank=True)
    altPhone = serializers.CharField(source="alt_phone", required=False, allow_blank=True)
    profilePhotoUrl = serializers.SerializerMethodField()

    class Meta:
        model = TempleInfo
        fields = [
            "id", "name", "establishedYear", "registration", "tagline", "about",
            "address", "phone", "altPhone", "email", "website",
            "profile_photo", "profilePhotoUrl", "updated_at",
        ]
        read_only_fields = ["id", "profilePhotoUrl", "updated_at"]
        extra_kwargs = {"profile_photo": {"write_only": True, "required": False}}

    def get_profilePhotoUrl(self, obj):
        request = self.context.get("request")
        if obj.profile_photo and hasattr(obj.profile_photo, "url"):
            url = obj.profile_photo.url
            return request.build_absolute_uri(url) if request else url
        return None