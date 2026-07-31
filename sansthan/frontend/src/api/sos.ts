import { api } from "@/lib/api";

export type SOSAlertType =
  | "fire"
  | "lost_child_item"
  | "security"
  | "medical"
  | "volunteer_support";

export type SOSStatus = "open" | "in_progress" | "resolved" | "closed";
export type SOSResponseStatus = "awaiting_response" | "responded";

export interface SOSAlert {
  id: number;
  sos_code: string;
  alert_type: SOSAlertType;
  alert_type_display: string;
  status: SOSStatus;
  status_display: string;
  description: string;
  image: string | null;
  location: string;
  latitude: number | null;
  longitude: number | null;
  raised_by: number | null;
  raised_by_name: string;
  volunteer_id: string | null;
  resolved_by: number | null;
  resolved_by_name: string;
  resolution_notes: string;
  responded_at: string | null;
  response_status: SOSResponseStatus;
  response_status_display: string;
  created_at: string;
  updated_at: string;
}

export interface SOSAlertListParams {
  alert_type?: SOSAlertType;
  status?: SOSStatus;
  search?: string;
  ordering?: string;
}

export interface SOSAlertPayload {
  alert_type: SOSAlertType;
  description?: string;
  location?: string;
  latitude?: number | null;
  longitude?: number | null;
  image?: File | null;
  // admin-only — backend ignores these from non-admins regardless
  status?: SOSStatus;
  resolution_notes?: string;
}

function toFormData(payload: SOSAlertPayload): FormData {
  const fd = new FormData();
  fd.append("alert_type", payload.alert_type);
  if (payload.description !== undefined) fd.append("description", payload.description);
  if (payload.location !== undefined) fd.append("location", payload.location);
  if (payload.latitude !== null && payload.latitude !== undefined)
    fd.append("latitude", String(payload.latitude));
  if (payload.longitude !== null && payload.longitude !== undefined)
    fd.append("longitude", String(payload.longitude));
  if (payload.image) fd.append("image", payload.image);
  if (payload.status) fd.append("status", payload.status);
  if (payload.resolution_notes !== undefined)
    fd.append("resolution_notes", payload.resolution_notes);
  return fd;
}

export async function getSOSAlerts(params: SOSAlertListParams = {}): Promise<SOSAlert[]> {
  const { data } = await api.get("/sos/alerts/", { params });
  // handle both paginated ({results: [...]}) and plain-array responses
  return Array.isArray(data) ? data : data.results;
}

export async function getSOSAlert(id: number): Promise<SOSAlert> {
  const { data } = await api.get(`/sos/alerts/${id}/`);
  return data;
}

export async function createSOSAlert(payload: SOSAlertPayload): Promise<SOSAlert> {
  const { data } = await api.post("/sos/alerts/", toFormData(payload), {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}

export async function updateSOSAlert(
  id: number,
  payload: Partial<SOSAlertPayload>,
): Promise<SOSAlert> {
  const { data } = await api.patch(
    `/sos/alerts/${id}/`,
    toFormData(payload as SOSAlertPayload),
    { headers: { "Content-Type": "multipart/form-data" } },
  );
  return data;
}

export async function deleteSOSAlert(id: number): Promise<void> {
  await api.delete(`/sos/alerts/${id}/`);
}

// Best-effort browser geolocation — never blocks the panic-button tap.
export function captureLocation(): Promise<{ latitude: number | null; longitude: number | null }> {
  return new Promise((resolve) => {
    if (!("geolocation" in navigator)) {
      resolve({ latitude: null, longitude: null });
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ latitude: pos.coords.latitude, longitude: pos.coords.longitude }),
      () => resolve({ latitude: null, longitude: null }),
      { timeout: 5000, maximumAge: 60000 },
    );
  });
}