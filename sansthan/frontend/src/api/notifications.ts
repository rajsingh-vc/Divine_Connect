import { api, unwrap } from "@/lib/api";

export type NotificationType =
  | "volunteer_approval_required"
  | "new_volunteer_application"
  | "status_update"
  | "announcement_urgent"
  | "announcement_important";

export interface VolunteerNotification {
  id: number;
  title: string;
  message: string;
  type: NotificationType;
  related_volunteer: number | null;
  is_read: boolean;
  created_at: string;
}

export async function getNotifications() {
  const { data } = await api.get("/volunteers/notifications/");
  return unwrap<VolunteerNotification>(data);
}

export async function getUnreadCount() {
  const { data } = await api.get("/volunteers/notifications/unread-count/");
  return data as { count: number };
}

export async function markNotificationRead(id: number) {
  const { data } = await api.post(`/volunteers/notifications/${id}/read/`);
  return data as VolunteerNotification;
}