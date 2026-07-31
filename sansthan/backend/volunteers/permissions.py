from rest_framework import permissions


class IsAdminOrReadOnly(permissions.BasePermission):
    """
    Volunteer records — core CRUD access rules:

    - Safe methods (GET list/retrieve): any authenticated user (admin,
      volunteer, devotee) can view the volunteer directory.
    - Unsafe methods (POST/PUT/PATCH/DELETE) on the base CRUD endpoints:
      admins only. This does NOT apply to the custom sub-actions
      (apply / register / reference-action / admin-action) — those set
      their own permission_classes on the @action decorator and take
      precedence over this class-level check.
    """

    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        if request.method in permissions.SAFE_METHODS:
            return True
        return bool(
            request.user.is_staff or getattr(request.user, "user_type", None) == "admin"
        )