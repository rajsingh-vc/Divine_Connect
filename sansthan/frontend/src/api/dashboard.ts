import { api, unwrap } from "@/lib/api";
import { formatINR, timeAgo } from "@/lib/format";

const PALETTE = ["hsl(35 90% 55%)", "hsl(15 80% 55%)", "hsl(150 45% 45%)", "hsl(210 70% 50%)", "hsl(0 65% 55%)"];

export async function getDashboardStats() {
  const { data } = await api.get("/dashboard/stats/");
  return {
    liveVisitors: { value: data.liveVisitors.value.toLocaleString("en-IN") },
    todaysBookings: { value: data.todaysBookings.value.toLocaleString("en-IN") },
    todaysDonations: { value: formatINR(data.todaysDonations.value) },
    volunteersOnDuty: { value: data.volunteersOnDuty.value },
    revenueMTD: { value: formatINR(data.revenueMTD.value) },
    totalDevotees: { value: data.totalDevotees.value.toLocaleString("en-IN") },
    totalEvents: { value: String(data.totalEvents.value) },
    inventoryAlerts: { value: String(data.inventoryAlerts.value) },
  };
}

export async function getVisitorFlow() {
  const { data } = await api.get("/dashboard/visitor-flow/");
  return data as { hour: string; visitors: number; bookings: number }[];
}

// ---------------------------------------------------------------------------
// Live Festival Info (replaces the old "AI insights" widget)
// ---------------------------------------------------------------------------
export interface LiveFestivalInfo {
  id: number;
  title: string; // e.g. "Aarti", "VIP Darshan"
  startTime: string; // ISO datetime
  endTime: string; // ISO datetime
  description: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface FestivalInfoPayload {
  title: string;
  start_time: string; // ISO datetime
  end_time: string; // ISO datetime
  description?: string;
  is_active?: boolean;
}

function mapFestivalInfo(f: any): LiveFestivalInfo {
  return {
    id: f.id,
    title: f.title,
    startTime: f.start_time,
    endTime: f.end_time,
    description: f.description || "",
    isActive: Boolean(f.is_active),
    createdAt: f.created_at,
    updatedAt: f.updated_at,
  };
}

export async function getFestivalInfo() {
  const { data } = await api.get("/dashboard/festival-info/");
  return unwrap<any>(data).map(mapFestivalInfo);
}

export async function createFestivalInfo(payload: FestivalInfoPayload) {
  const { data } = await api.post("/dashboard/festival-info/", payload);
  return mapFestivalInfo(data);
}

export async function updateFestivalInfo(id: number, payload: Partial<FestivalInfoPayload>) {
  const { data } = await api.patch(`/dashboard/festival-info/${id}/`, payload);
  return mapFestivalInfo(data);
}

export async function deleteFestivalInfo(id: number) {
  await api.delete(`/dashboard/festival-info/${id}/`);
}

export async function getRevenueMix() {
  const { data } = await api.get("/dashboard/revenue-mix/");
  return (data as { name: string; value: number }[]).map((row, i) => ({
    ...row,
    name: row.name ? row.name.charAt(0).toUpperCase() + row.name.slice(1) : "Other",
    color: PALETTE[i % PALETTE.length],
  }));
}

export async function getAlerts() {
  const { data } = await api.get("/dashboard/alerts/", { params: { is_active: true } });
  return unwrap<any>(data).map((a) => ({
    id: a.alert_code,
    severity: a.severity,
    category: a.category,
    desc: a.description,
    time: timeAgo(a.created_at),
  }));
}

export async function getRecentBookings() {
  const { data } = await api.get("/bookings/", { params: { ordering: "-created_at" } });
  return unwrap<any>(data)
    .slice(0, 6)
    .map((b) => ({
      id: b.booking_code,
      devotee: b.devotee_name,
      seva: b.seva_name,
      date: b.date,
      slot: b.slot,
      amount: formatINR(b.amount),
      status: b.status.charAt(0).toUpperCase() + b.status.slice(1),
    }));
}

// ---------------------------------------------------------------------------
// Live Ganpati Darshan
// ---------------------------------------------------------------------------
// ---------------------------------------------------------------------------
// Live Ganpati Darshan — config-driven (settings.GANPATI_LIVE_URL on the
// backend). No admin form, no database row. Just polls the one status
// endpoint and shows/hides the banner accordingly.
// ---------------------------------------------------------------------------
export interface LiveDarshanStatus {
  isLive: boolean;
  id?: number;
  title?: string;
  description?: string;
  liveUrl?: string;
  bannerImage?: string | null;
}


export interface LiveDarshanAdmin {
  id: number;
  title: string;
  description: string;
  liveUrl: string;
  bannerImage: string | null;
  isLive: boolean;
  isLiveNow: boolean;
  createdByName: string;
  createdAt: string;
  updatedAt: string;
}

export interface LiveDarshanPayload {
  title?: string;      // optional — backend defaults to "Live Ganpati Darshan"
  live_url: string;    // required
  is_live: boolean;
}

function mapLiveDarshanStatus(d: any): LiveDarshanStatus {
  if (!d?.is_live) return { isLive: false };
  return {
    isLive: true,
    id: d.id,
    title: d.title,
    description: d.description,
    liveUrl: d.live_url,
    bannerImage: d.banner_image || null,
  };
}

// Polled by every dashboard for the banner. Matches GET /api/dashboard/live-darshan/
export async function getLiveDarshanStatus(): Promise<LiveDarshanStatus> {
  const { data } = await api.get("/dashboard/live-darshan/");
  return mapLiveDarshanStatus(data);
}

function mapLiveDarshanAdmin(d: any): LiveDarshanAdmin {
  return {
    id: d.id,
    title: d.title,
    description: d.description || "",
    liveUrl: d.live_url,
    bannerImage: d.banner_image || null,
    isLive: Boolean(d.is_live),
    isLiveNow: Boolean(d.is_live_now),
    createdByName: d.created_by_name || "",
    createdAt: d.created_at,
    updatedAt: d.updated_at,
  };
}

export async function getLiveDarshanAdminList() {
  const { data } = await api.get("/dashboard/live-darshan-admin/");
  return unwrap<any>(data).map(mapLiveDarshanAdmin);
}

export async function createLiveDarshan(payload: LiveDarshanPayload) {
  const { data } = await api.post("/dashboard/live-darshan-admin/", payload);
  return mapLiveDarshanAdmin(data);
}

export async function updateLiveDarshan(id: number, payload: Partial<LiveDarshanPayload>) {
  const { data } = await api.patch(`/dashboard/live-darshan-admin/${id}/`, payload);
  return mapLiveDarshanAdmin(data);
}

export async function deleteLiveDarshan(id: number) {
  await api.delete(`/dashboard/live-darshan-admin/${id}/`);
}