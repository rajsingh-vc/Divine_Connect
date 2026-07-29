from .models import Notification
from .realtime import push_notification


def notify(recipient_user, title, message, ntype, related_volunteer=None):
    notif = Notification.objects.create(
        recipient=recipient_user, title=title, message=message,
        type=ntype, related_volunteer=related_volunteer,
    )
    push_notification(recipient_user.id, {
        "id": notif.id, "title": title, "message": message,
        "type": ntype, "volunteer_id": related_volunteer.id if related_volunteer else None,
        "created_at": notif.created_at.isoformat(),
    })
    return notif


def notify_reference_required(reference_volunteer, new_volunteer):
    if not reference_volunteer.user:
        return
    notify(
        reference_volunteer.user,
        "Volunteer Approval Required",
        f"You have been listed as the reference for {new_volunteer.name}. Please Approve or Reject this request.",
        Notification.Type.VOLUNTEER_APPROVAL_REQUIRED,
        related_volunteer=new_volunteer,
    )


def notify_admins_new_application(new_volunteer):
    from django.contrib.auth import get_user_model
    User = get_user_model()
    admins = User.objects.filter(is_staff=True)
    for admin in admins:
        notify(
            admin, "New Volunteer Application",
            f"{new_volunteer.name} applied via reference {new_volunteer.reference_volunteer.name if new_volunteer.reference_volunteer else '—'}.",
            Notification.Type.NEW_VOLUNTEER_APPLICATION,
            related_volunteer=new_volunteer,
        )