import { api, unwrap } from "@/lib/api";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
export type VolunteerStatus =
  | "pending_volunteer_approval"
  | "volunteer_approved"
  | "volunteer_rejected"
  | "admin_approved"
  | "admin_rejected"
  | "auto_rejected";

export interface VolunteerApprovalInfo {
  id: number;
  reference_volunteer: number | null;
  reference_volunteer_name: string;
  reference_comment: string;
  reference_status: "pending" | "approved" | "rejected" | "auto_rejected";
  reference_action_at: string | null;
  admin_status: "pending" | "approved" | "rejected";
  admin_action_at: string | null;
  auto_rejected: boolean;
  deadline: string;
  time_remaining_seconds: number;
  created_at: string;
}

export interface VolunteerRow {
  id: number;
  volunteer_code: string;
  public_id: string | null;
  name: string;
  email: string;
  phone: string;
  profile_photo: string | null;
  is_volunteer: boolean;
  status: VolunteerStatus;
  reference_volunteer: number | null;
  reference_volunteer_name: string;
  approval: VolunteerApprovalInfo | null;
  created_at: string;
}

export interface VerificationInfo {
  aadhaar_number: string;
  aadhaar_front: string | null;
  aadhaar_back: string | null;
  pan_number: string;
  pan_front: string | null;
  pan_back: string | null;
  license_number: string;
  license_front: string | null;
  license_back: string | null;
  live_photo: string | null;
}

export interface VolunteerDetail extends VolunteerRow {
  verification: VerificationInfo;
}

export interface AuditLogEntry {
  id: number;
  action: string;
  actor: number | null;
  actor_name: string;
  detail: string;
  created_at: string;
}

// Notification bell items — includes both the volunteer-approval-flow types
// and the CMS "Notification Templates" announcement types.
export interface NotificationItem {
  id: number;
  title: string;
  message: string;
  type:
    | "volunteer_approval_required"
    | "new_volunteer_application"
    | "status_update"
    | "announcement_urgent"
    | "announcement_important";
  related_volunteer: number | null;
  is_read: boolean;
  created_at: string;
}

// Fields shared by both "apply" (devotee -> volunteer) and "register"
// (approved volunteer -> new volunteer) forms.
export interface VolunteerVerificationPayload {
  name: string;
  email: string;
  phone: string;
  profile_photo?: File | null;
  aadhaar_number?: string;
  aadhaar_front?: File | null;
  aadhaar_back?: File | null;
  pan_number?: string;
  pan_front?: File | null;
  pan_back?: File | null;
  license_number?: string;
  license_front?: File | null;
  license_back?: File | null;
  live_photo?: File | null;
  // Only required for /register (reference is auto-filled server-side from
  // the logged-in volunteer, this is just their comment).
  reference_comment?: string;
  // Optional, /apply only: a devotee may pick an already-approved volunteer
  // as their reference. Ignored by /register (reference is auto-filled
  // server-side there).
  reference_volunteer?: number | null;
}

export type DocType = "aadhaar" | "pan" | "license";

function buildFormData(payload: VolunteerVerificationPayload) {
  const form = new FormData();
  Object.entries(payload).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;
    form.append(key, value as string | Blob);
  });
  return form;
}

// The backend /apply/ endpoint (VolunteerApplySerializer) only accepts:
// name, email, phone, document_front, document_back, document_number,
// selfie, reference_volunteer — NOT the aadhaar_*/pan_*/license_*/live_photo
// keys the form collects internally. This maps whichever doc type the user
// picked onto the generic document_* fields the backend expects.
function buildApplyFormData(payload: VolunteerVerificationPayload, docType: DocType) {
  const form = new FormData();
  form.append("name", payload.name);
  form.append("email", payload.email);
  form.append("phone", payload.phone);

  const front = payload[`${docType}_front` as const] as File | null | undefined;
  const back = payload[`${docType}_back` as const] as File | null | undefined;
  const number = payload[`${docType}_number` as const] as string | undefined;

  if (front) form.append("document_front", front);
  if (back) form.append("document_back", back);
  if (number) form.append("document_number", number);
  if (payload.live_photo) form.append("selfie", payload.live_photo);
  if (payload.reference_volunteer) form.append("reference_volunteer", String(payload.reference_volunteer));

  return form;
}

function mapVolunteerRow(v: any): VolunteerRow {
  return {
    id: v.id,
    volunteer_code: v.volunteer_code,
    public_id: v.public_id,
    name: v.name,
    email: v.email,
    phone: v.phone,
    profile_photo: v.profile_photo,
    is_volunteer: v.is_volunteer,
    status: v.status,
    reference_volunteer: v.reference_volunteer,
    reference_volunteer_name: v.reference_volunteer_name,
    approval: v.approval,
    created_at: v.created_at,
  };
}

// ---------------------------------------------------------------------------
// Devotee applies to become a volunteer (Step 1 of the workflow — no
// reference required; admin approval flips is_volunteer=true).
//
// Response is intentionally small (not the full VolunteerDetail) — this
// keeps the submit request/response lightweight so it doesn't time out on
// slow mobile connections while uploading document photos + selfie.
// ---------------------------------------------------------------------------
export interface VolunteerApplyResponse {
  id: number;
  volunteer_code: string;
  status: VolunteerStatus;
  message: string;
}

export async function deleteVolunteer(volunteerId: number) {
  await api.delete(`/volunteers/volunteers/${volunteerId}/`);
}

export async function applyAsVolunteer(payload: VolunteerVerificationPayload, docType: DocType) {
  // Do NOT set Content-Type manually here — axios/the browser needs to add
  // the multipart boundary itself when sending FormData. Setting it
  // explicitly (without a boundary) can make the request fail outright.
  const { data } = await api.post("/volunteers/volunteers/apply/", buildApplyFormData(payload, docType));
  return data as VolunteerApplyResponse;
}

// ---------------------------------------------------------------------------
// Approved volunteer registers a new volunteer (reference is mandatory,
// auto-filled server-side from the logged-in volunteer's profile).
// Backend for /register/ is unchanged — still returns full VolunteerDetail.
// ---------------------------------------------------------------------------
export async function registerVolunteer(payload: VolunteerVerificationPayload) {
  if (!payload.reference_comment) {
    throw new Error("Reference comment is required.");
  }
  const { data } = await api.post("/volunteers/volunteers/register/", buildFormData(payload));
  return data as VolunteerDetail;
}

// ---------------------------------------------------------------------------
// Search approved volunteers to populate the optional "Reference Volunteer"
// dropdown/search on the devotee Volunteer Verification (apply) form.
// ---------------------------------------------------------------------------
export interface ApprovedVolunteerOption {
  id: number;
  name: string;
  email: string;
  volunteer_code: string;
}

export async function getApprovedVolunteers(search = "") {
  const { data } = await api.get("/volunteers/volunteers/", {
    params: { status: "admin_approved", search: search || undefined },
  });
  return unwrap<any>(data).map((v: any) => ({
    id: v.id,
    name: v.name,
    email: v.email,
    volunteer_code: v.volunteer_code,
  })) as ApprovedVolunteerOption[];
}

// ---------------------------------------------------------------------------
// Reference volunteer approves/rejects the volunteer they referred
// ---------------------------------------------------------------------------
export async function referenceAction(volunteerId: number, action: "approve" | "reject") {
  const { data } = await api.post(`/volunteers/volunteers/${volunteerId}/reference-action/`, { action });
  return data as VolunteerDetail;
}

// ---------------------------------------------------------------------------
// Admin approves/rejects (optionally overriding a reference rejection).
//
// Response contract (matches backend admin_action exactly):
// - approve -> { id: "vol_3", message: "approve" }
// - reject  -> { message: "rejected", reason: "<reason>" }
// ---------------------------------------------------------------------------
export interface AdminActionResponse {
  id?: string;       // public_id, e.g. "vol_3" — present on approve only
  message: string;    // "approve" or "rejected"
  reason?: string;     // present on reject only, e.g. "Blurry photo"
}

export async function adminAction(volunteerId: number, action: "approve" | "reject", override = false, reason = "") {
  const { data } = await api.post(`/volunteers/volunteers/${volunteerId}/admin-action/`, { action, override, reason });
  return data as AdminActionResponse;
}

// ---------------------------------------------------------------------------
// Admin dashboard — Volunteer Approval Management page
// ---------------------------------------------------------------------------
export async function getVolunteerApprovalsPage(params: { page?: number; search?: string; status?: string } = {}) {
  const { data } = await api.get("/volunteers/volunteers/", { params });
  return { rows: unwrap<any>(data).map(mapVolunteerRow), count: data.count ?? unwrap(data).length };
}

export async function getVolunteerDetail(id: number) {
  const { data } = await api.get(`/volunteers/volunteers/${id}/`);
  return data as VolunteerDetail;
}

export async function getVolunteerAuditLog(id: number) {
  const { data } = await api.get(`/volunteers/volunteers/${id}/audit-log/`);
  return data as AuditLogEntry[];
}

// ---------------------------------------------------------------------------
// Notifications (bell icon, unread count, mark-read)
// ---------------------------------------------------------------------------
export async function getNotifications() {
  const { data } = await api.get("/volunteers/notifications/");
  return unwrap<NotificationItem>(data);
}

export async function getUnreadNotificationCount() {
  const { data } = await api.get("/volunteers/notifications/unread-count/");
  return data.count as number;
}

export async function markNotificationRead(id: number) {
  const { data } = await api.post(`/volunteers/notifications/${id}/read/`);
  return data as NotificationItem;
}