// api/manual-counter.ts — FULL FILE
// NOTE: assumes a shared axios instance exported as `api` from "@/lib/api",
// mirroring the pattern used by dashboard.ts / crowd-status.ts. Adjust this
// import if your project's client lives elsewhere or under a different name.
import { api } from "@/lib/api";

export type ManualCounterAction = "increment" | "decrement";

export interface ManualCounterSummary {
  currentManualCount: number;
  todayIncrement: number;
  todayDecrement: number;
}

export interface ManualCounterActionPayload {
  action: ManualCounterAction;
  count?: number;
  reason?: string;
}

export interface ManualCounterActionResponse {
  status: "success" | "failed";
  message: string;
  currentManualCount: number;
}

export interface ManualCounterLogEntry {
  id: number;
  volunteer: number | null;
  volunteerName: string | null;
  assignedArea: string;
  action: "INCREMENT" | "DECREMENT";
  count: number;
  reason: string;
  timestamp: string;
}

export interface ManualCounterAdminListParams {
  area?: string;
  volunteerId?: number;
  date?: string; // YYYY-MM-DD
}

function normalizeSummary(raw: any): ManualCounterSummary {
  return {
    currentManualCount: raw.current_manual_count,
    todayIncrement: raw.today_increment,
    todayDecrement: raw.today_decrement,
  };
}

function normalizeLogEntry(raw: any): ManualCounterLogEntry {
  return {
    id: raw.id,
    volunteer: raw.volunteer,
    volunteerName: raw.volunteer_name,
    assignedArea: raw.assigned_area,
    action: raw.action,
    count: raw.count,
    reason: raw.reason,
    timestamp: raw.timestamp,
  };
}

/** GET /api/manual-counter/ — volunteer's own area summary. */
export async function getManualCounterSummary(): Promise<ManualCounterSummary> {
  const { data } = await api.get("/manual-counter/");
  return normalizeSummary(data);
}

/** POST /api/manual-counter/ — record one +/- action for the volunteer's area. */
export async function postManualCounterAction(
  payload: ManualCounterActionPayload,
): Promise<ManualCounterActionResponse> {
  const { data } = await api.post("/manual-counter/", {
    action: payload.action,
    count: payload.count ?? 1,
    reason: payload.reason ?? "",
  });
  return {
    status: data.status,
    message: data.message,
    currentManualCount: data.current_manual_count,
  };
}

/** GET /api/manual-counter/admin/ — full audit trail. Admin only. */
export async function getManualCounterAdminList(
  params: ManualCounterAdminListParams = {},
): Promise<ManualCounterLogEntry[]> {
  const { data } = await api.get("/manual-counter/admin/", {
    params: {
      area: params.area,
      volunteer_id: params.volunteerId,
      date: params.date,
    },
  });
  return (data as any[]).map(normalizeLogEntry);
}