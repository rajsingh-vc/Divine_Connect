from rest_framework import permissions


def _is_admin(user):
    return bool(user.is_staff or getattr(user, "user_type", None) == "admin")


def _is_volunteer(user):
    return getattr(user, "user_type", None) == "volunteer"


class SOSAlertPermission(permissions.BasePermission):
    """
    Emergency SOS access rules:

    - Must be logged in for everything (admin / volunteer / devotee).
    - GET (list/retrieve): any authenticated user — admin, volunteer, devotee.
    - POST (create): volunteers and admins only — this is the panic button;
      devotees never raise it directly.
    - PUT/PATCH/DELETE: admins can update/delete any alert; volunteers can
      only update/delete the alerts *they* raised.
    """

    def has_permission(self, request, view):
        user = request.user
        if not user or not user.is_authenticated:
            return False

        if request.method in permissions.SAFE_METHODS:
            return True

        return _is_admin(user) or _is_volunteer(user)

    def has_object_permission(self, request, view, obj):
        user = request.user

        if request.method in permissions.SAFE_METHODS:
            return True

        if _is_admin(user):
            return True

        if _is_volunteer(user):
            return obj.raised_by_id == user.id

        return False