import { api, unwrap } from "@/lib/api";

export type DutyPriority = "low" | "normal" | "high";
export type DutyStatus = "assigned" | "in_progress" | "completed" | "help_requested";

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
  created_by: number | null;
  created_by_name: string;
  started_at: string | null;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
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

export async function startDuty(id: number) {
  const { data } = await api.post(`/volunteers/duties/${id}/start/`);
  return data as Duty;
}

export async function completeDuty(id: number) {
  const { data } = await api.post(`/volunteers/duties/${id}/complete/`);
  return data as Duty;
}

export async function requestDutyHelp(id: number, note = "") {
  const { data } = await api.post(`/volunteers/duties/${id}/request-help/`, { note });
  return data as Duty;
}