import { api, unwrap } from "@/lib/api";

export type DutyPriority = "low" | "normal" | "high";
export type DutyStatus =
  | "assigned"
  | "accepted"
  | "in_progress"
  | "completed"
  | "help_requested"
  | "swap_requested";

export interface Duty {
  id: number;
  duty_code: string;
  volunteer: number;
  volunteer_name: string;
  volunteer_code: string;
  title: string;
  instructions: string;
  location: string;
  duty_date: string;
  time: string | null;
  priority: DutyPriority;
  status: DutyStatus;
  help_note: string;
  // Swap fields — present once a swap has been requested on this duty.
  swap_requested_with: number | null;
  swap_requested_with_name: string;
  swap_requested_at: string | null;
  created_by: number | null;
  created_by_name: string;
  accepted_at: string | null;
  started_at: string | null;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

/** A volunteer eligible to be swapped in — powers the "select name" dropdown. */
export interface SwapCandidate {
  id: number;
  name: string;
  volunteer_code: string;
  public_id: string | null;
}

export interface DutyPayload {
  volunteer: number;
  title: string;
  instructions?: string;
  location?: string;
  duty_date: string;
  time?: string | null;
  priority?: DutyPriority;
}

export interface DutyAssignPayload {
  volunteer_ids: number[];
  title: string;
  instructions?: string;
  location?: string;
  duty_date: string;
  time?: string | null;
  priority?: DutyPriority;
}

export async function getDuties(params: Record<string, string | number> = {}) {
  const { data } = await api.get("/volunteers/duties/", { params });
  return unwrap<Duty>(data);
}

export async function createDuty(payload: DutyPayload) {
  const { data } = await api.post("/volunteers/duties/", payload);
  return data as Duty;
}

/** Admin: assign one duty to several volunteers at once. */
export async function assignDuty(payload: DutyAssignPayload) {
  const { data } = await api.post("/volunteers/duties/assign/", payload);
  return data as Duty[];
}

export async function updateDuty(id: number, payload: Partial<DutyPayload>) {
  const { data } = await api.patch(`/volunteers/duties/${id}/`, payload);
  return data as Duty;
}

export async function deleteDuty(id: number) {
  await api.delete(`/volunteers/duties/${id}/`);
}

/** Volunteer accepts a newly assigned duty (assigned -> accepted). */
export async function acceptDuty(id: number) {
  const { data } = await api.post(`/volunteers/duties/${id}/accept/`);
  return data as Duty;
}

export async function startDuty(id: number) {
  const { data } = await api.post(`/volunteers/duties/${id}/start/`);
  return data as Duty;
}

export async function completeDuty(id: number) {
  const { data } = await api.post(`/volunteers/duties/${id}/complete/`);
  return data as Duty;
}

/**
 * Plain help request (no volunteer picked) — status becomes "help_requested".
 * Pass `swapWith` to make this a swap request instead (status becomes
 * "swap_requested" and the target volunteer must accept/decline it).
 */
export async function requestDutyHelp(id: number, note = "", swapWith?: number | null) {
  const { data } = await api.post(`/volunteers/duties/${id}/request-help/`, {
    note,
    ...(swapWith ? { swap_with: swapWith } : {}),
  });
  return data as Duty;
}

/** List of volunteers this duty could be swapped with (excludes the current assignee). */
export async function getSwapCandidates(id: number) {
  const { data } = await api.get(`/volunteers/duties/${id}/swap-candidates/`);
  return data as SwapCandidate[];
}

/** Target volunteer accepts or declines a pending swap request on a duty. */
export async function respondToSwap(id: number, action: "accept" | "decline") {
  const { data } = await api.post(`/volunteers/duties/${id}/swap-respond/`, { action });
  return data as Duty;
}