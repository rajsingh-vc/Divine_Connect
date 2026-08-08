import { api, unwrap } from "@/lib/api";

export type VideoSourceType = "youtube" | "upload";

export interface VideoItem {
  id: number;
  source_type: VideoSourceType;
  title: string;
  description: string;
  youtube_url: string;
  youtube_video_id: string;
  embedUrl: string | null;
  fileUrl: string | null;
  thumbnailUrl: string | null;
  uploaded_by: number | null;
  uploadedByName: string;
  createdAt: string;
}

export interface CreateVideoPayload {
  source_type: VideoSourceType;
  title: string;
  description?: string;
  youtube_url?: string;
  file?: File;
}

export async function getVideos() {
  const { data } = await api.get("/content/videos/");
  return unwrap<VideoItem>(data);
}

export async function createVideo(payload: CreateVideoPayload) {
  const form = new FormData();
  form.append("source_type", payload.source_type);
  form.append("title", payload.title);
  if (payload.description) form.append("description", payload.description);
  if (payload.source_type === "youtube" && payload.youtube_url) {
    form.append("youtube_url", payload.youtube_url);
  }
  if (payload.source_type === "upload" && payload.file) {
    form.append("file", payload.file);
  }

  const { data } = await api.post("/content/videos/", form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data as VideoItem;
}

export async function deleteVideo(id: number) {
  await api.delete(`/content/videos/${id}/`);
}