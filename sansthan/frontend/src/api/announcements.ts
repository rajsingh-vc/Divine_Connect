import { api, unwrap } from "@/lib/api";

export type AnnouncementType = "immediate" | "important";

export interface Announcement {
  id: number;
  type: AnnouncementType;
  title: string;
  description: string;
  sent_at: string;
  sent_by: number | null;
  sent_by_name: string;
}

export interface CreateAnnouncementPayload {
  type: AnnouncementType;
  title: string;
  description: string;
}


export async function getAnnouncements() {
  const { data } = await api.get("/content/announcements/");
  return unwrap<Announcement>(data);
}

export async function sendAnnouncement(payload: CreateAnnouncementPayload) {
  const { data } = await api.post("/content/announcements/", payload);
  return data as Announcement;
}

export async function deleteAnnouncement(id: number) {
  await api.delete(`/content/announcements/${id}/`);
}

