import { api } from "@/lib/api";

export type MediaType = "image" | "video";

export interface GalleryItem {
  id: string;
  type: MediaType;
  url: string;
  thumbnail?: string;
  title: string;
  description: string;
  year: number;
  uploadedBy?: string;
  uploadedAt?: string;
}

// 👇 Adjust field names below to match your actual /gallery/ response shape.
// Assumed snake_case fields (matching your AuthUser convention): media_type, file, thumbnail, uploaded_by, created_at
function mapItem(raw: any): GalleryItem {
  return {
    id: String(raw.id),
    type: raw.media_type ?? raw.type,
    url: raw.file ?? raw.url,
    thumbnail: raw.thumbnail,
    title: raw.title,
    description: raw.description ?? "",
    year: raw.year,
    uploadedBy: raw.uploaded_by_name ?? raw.uploaded_by,
    uploadedAt: raw.created_at ?? raw.uploaded_at,
  };
}

export async function fetchGalleryItems(): Promise<GalleryItem[]> {
  const { data } = await api.get("/content/gallery/");
  const list = Array.isArray(data) ? data : data.results ?? [];
  return list.map(mapItem);
}

export async function uploadGalleryItem(payload: {
  file: File;
  title: string;
  description: string;
  year: number;
}): Promise<GalleryItem> {
  const form = new FormData();
  form.append("file", payload.file);
  form.append("title", payload.title);
  form.append("description", payload.description);
  form.append("year", String(payload.year));
  form.append("media_type", payload.file.type.startsWith("video") ? "video" : "image");

  const { data } = await api.post("/content/gallery/", form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return mapItem(data);
}

export async function deleteGalleryItem(id: string): Promise<void> {
  await api.delete(`/content/gallery/${id}/`);
}

export async function deleteGalleryItems(ids: string[]): Promise<void> {
  await Promise.all(ids.map((id) => deleteGalleryItem(id)));
}