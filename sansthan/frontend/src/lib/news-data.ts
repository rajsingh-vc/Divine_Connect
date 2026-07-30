import { api } from "@/lib/api";

export type NewsStatus = "draft" | "published";

export interface NewsPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  photoUrl?: string;
  status: NewsStatus;
  author?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Your NewsPostSerializer already returns camelCase (photoUrl, createdAt,
// updatedAt) via SerializerMethodField / source=, so this mapper is mostly
// passthrough — kept in the same shape as gallery-data.ts for consistency.
function mapItem(raw: any): NewsPost {
  return {
    id: String(raw.id),
    title: raw.title,
    slug: raw.slug,
    excerpt: raw.excerpt ?? "",
    content: raw.content ?? "",
    photoUrl: raw.photoUrl ?? raw.photo_url,
    status: raw.status,
    author: raw.author,
    createdAt: raw.createdAt ?? raw.created_at,
    updatedAt: raw.updatedAt ?? raw.updated_at,
  };
}

export async function fetchNewsPosts(): Promise<NewsPost[]> {
  const { data } = await api.get("/content/news/");
  const list = Array.isArray(data) ? data : data.results ?? [];
  return list.map(mapItem);
}

export async function createNewsPost(payload: {
  title: string;
  excerpt: string;
  content: string;
  status: NewsStatus;
  photo?: File | null;
}): Promise<NewsPost> {
  const form = new FormData();
  form.append("title", payload.title);
  form.append("excerpt", payload.excerpt);
  form.append("content", payload.content);
  form.append("status", payload.status);
  if (payload.photo) form.append("photo", payload.photo);

  const { data } = await api.post("/content/news/", form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return mapItem(data);
}

export async function updateNewsPost(
  id: string,
  payload: {
    title: string;
    excerpt: string;
    content: string;
    status: NewsStatus;
    photo?: File | null;
  }
): Promise<NewsPost> {
  const form = new FormData();
  form.append("title", payload.title);
  form.append("excerpt", payload.excerpt);
  form.append("content", payload.content);
  form.append("status", payload.status);
  if (payload.photo) form.append("photo", payload.photo);

  // PATCH so an edit without a new photo doesn't clobber the existing one
  // (photo is write_only + optional on the serializer).
  const { data } = await api.patch(`/content/news/${id}/`, form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return mapItem(data);
}

export async function deleteNewsPost(id: string): Promise<void> {
  await api.delete(`/content/news/${id}/`);
}

export async function deleteNewsPosts(ids: string[]): Promise<void> {
  await Promise.all(ids.map((id) => deleteNewsPost(id)));
}