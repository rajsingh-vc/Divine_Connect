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

export async function getAiInsights() {
  const { data } = await api.get("/dashboard/insights/");
  return unwrap<{ title: string; detail: string }>(data);
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
