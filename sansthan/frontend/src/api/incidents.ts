import { api, unwrap } from "@/lib/api";

export type IncidentCategory =
  | "medical"
  | "crowd"
  | "security"
  | "queue"
  | "volunteer_support";

export type IncidentSeverity = "low" | "medium" | "high" | "critical";

export type IncidentStatus = "open" | "in_progress" | "resolved" | "closed";

export interface IncidentReport {
  id: number;
  incident_code: string;
  title: string;
  category: IncidentCategory;
  category_display: string;
  severity: IncidentSeverity;
  severity_display: string;
  status: IncidentStatus;
  status_display: string;
  description: string;
  image: string | null;
  location: string;
  reported_by: number | null;
  reported_by_name: string;
  resolved_by: number | null;
  resolved_by_name: string;
  responded_at: string | null;                                    // NEW
  response_status: "awaiting_response" | "responded";              // NEW
  response_status_display: string;                                 // NEW
  resolution_notes: string;
  created_at: string;
  updated_at: string;
}

export interface IncidentReportPayload {
  title: string;
  category: IncidentCategory;
  severity: IncidentSeverity;
  description: string;
  location?: string;
  status?: IncidentStatus;
  resolution_notes?: string;
  /** Pass a File to upload/replace the photo, or omit to leave it unchanged. */
  image?: File | null;
}

export interface IncidentFilters {
  category?: IncidentCategory;
  severity?: IncidentSeverity;
  status?: IncidentStatus;
  search?: string;
  ordering?: string;
}

function toFormData(payload: Partial<IncidentReportPayload>): FormData {
  const form = new FormData();
  if (payload.title !== undefined) form.append("title", payload.title);
  if (payload.category !== undefined) form.append("category", payload.category);
  if (payload.severity !== undefined) form.append("severity", payload.severity);
  if (payload.description !== undefined) form.append("description", payload.description);
  if (payload.location !== undefined) form.append("location", payload.location);
  if (payload.status !== undefined) form.append("status", payload.status);
  if (payload.resolution_notes !== undefined) form.append("resolution_notes", payload.resolution_notes);
  if (payload.image) form.append("image", payload.image);
  return form;
}

/** GET /api/incidents/incidents/ — the Incident Log. Viewable by admin, volunteer, and devotee. */
export async function getIncidents(filters: IncidentFilters = {}) {
  const { data } = await api.get("/incidents/incidents/", { params: filters });
  return unwrap<IncidentReport>(data);
}

export async function getIncident(id: number) {
  const { data } = await api.get(`/incidents/incidents/${id}/`);
  return data as IncidentReport;
}

/** POST — volunteers (and admins) can file a new incident report. */
export async function createIncident(payload: IncidentReportPayload) {
  const { data } = await api.post("/incidents/incidents/", toFormData(payload), {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data as IncidentReport;
}

/** PATCH — volunteers can edit their own reports; admins can edit any report. */
export async function updateIncident(id: number, payload: Partial<IncidentReportPayload>) {
  const form = toFormData(payload as IncidentReportPayload);
  const { data } = await api.patch(`/incidents/incidents/${id}/`, form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data as IncidentReport;
}

/** DELETE — volunteers can delete their own reports; admins can delete any report. */
export async function deleteIncident(id: number) {
  await api.delete(`/incidents/incidents/${id}/`);
}