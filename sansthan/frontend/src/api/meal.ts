import { api, unwrap } from "@/lib/api";

export type MealName = "breakfast" | "lunch" | "dinner" | "snacks";

// Single source of truth for the dropdown, matches backend MealSession.MealName choices
export const MEAL_NAME_OPTIONS: { value: MealName; label: string }[] = [
  { value: "breakfast", label: "Breakfast" },
  { value: "lunch", label: "Lunch" },
  { value: "dinner", label: "Dinner" },
  { value: "snacks", label: "Snacks" },
];

export interface MealSession {
  id: number;
  session_code: string;
  meal_name: MealName;
  meal_name_display: string;
  location: string;
  start_time: string;
  end_time: string;
  is_active: boolean;
  is_open: boolean;
  created_at: string;
}

export interface MealSessionPayload {
  meal_name: MealName;
  location: string;
  start_time: string;
  end_time: string;
  is_active?: boolean;
}

export interface MealCheckIn {
  id: number;
  checkin_code: string;
  session: number;
  session_code: string;
  location: string;
  volunteer: number;
  volunteer_name: string;
  volunteer_code: string;
  meal_name: MealName;
  meal_name_display: string;
  assigned_role: string;
  shift_timing: string;
  status: "checked_in" | "checked_out";
  check_in_time: string | null;
  check_out_time: string | null;
  scan_count: number;
  created_at: string;
}

export interface VolunteerMealStat {
  volunteer_id: number;
  volunteer_name: string;
  total_scans: number;
  by_location: Record<string, number>;
}

// Response shape for the volunteer's own personal QR
export interface MealMyQr {
  token: string;
  ttl_seconds: number;
  volunteer_code: string;
}

// Response shape for the admin's gate/display QR (session-level, not tied to
// any one volunteer — whoever scans it self-checks-in as themselves).
export interface MealGateQr {
  token: string;
  ttl_seconds: number;
}

export async function getMealSessions() {
  const { data } = await api.get("/volunteers/meals/sessions/");
  return unwrap<MealSession>(data);
}

export async function getActiveMealSessions() {
  const { data } = await api.get("/volunteers/meals/sessions/active/");
  return data as MealSession[];
}

export async function createMealSession(payload: MealSessionPayload) {
  const { data } = await api.post("/volunteers/meals/sessions/", payload);
  return data as MealSession;
}

export async function updateMealSession(id: number, payload: Partial<MealSessionPayload>) {
  const { data } = await api.patch(`/volunteers/meals/sessions/${id}/`, payload);
  return data as MealSession;
}

export async function deleteMealSession(id: number) {
  await api.delete(`/volunteers/meals/sessions/${id}/`);
}

export async function getMealCheckins(sessionId: number) {
  const { data } = await api.get(`/volunteers/meals/sessions/${sessionId}/checkins/`);
  return data as MealCheckIn[];
}

/** Volunteer-facing — poll every ~10-12s to refresh their own displayed QR. */
export async function getMealSessionMyQr(sessionId: number) {
  const { data } = await api.get(`/volunteers/meals/sessions/${sessionId}/my-qr/`);
  return data as MealMyQr;
}

/** Kiosk-facing (admin auth) — decodes a volunteer's personal QR and records
 * the check-in / check-out. Returns the resulting record, status included. */
export async function scanMeal(token: string) {
  const { data } = await api.post("/volunteers/meals/scan/", { token });
  return data as MealCheckIn;
}

/** Admin-facing — polls this every ~10-13s to refresh the gate/display QR
 * (e.g. on a tablet or poster at the food counter) that volunteers scan
 * with their own phone to self check-in / check-out. */
export async function getMealSessionGateQr(sessionId: number) {
  const { data } = await api.get(`/volunteers/meals/sessions/${sessionId}/token/`);
  return data as MealGateQr;
}

/** Volunteer-facing — scans the gate QR the admin is displaying and checks
 * the *logged-in* volunteer in/out. Returns the resulting record, which
 * includes the meal name / location / status the admin set up. */
export async function selfScanMeal(token: string) {
  const { data } = await api.post("/volunteers/meals/self-scan/", { token });
  return data as MealCheckIn;
}

export async function getMealStats() {
  const { data } = await api.get("/volunteers/meals/stats/");
  return data as VolunteerMealStat[];
}