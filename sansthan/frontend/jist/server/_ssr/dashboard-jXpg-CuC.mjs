import { s as unwrap, t as api } from "./api-gwD-5_E_.mjs";
import { i as timeAgo, t as formatINR } from "./format-oajkEy3m.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/dashboard-jXpg-CuC.js
var PALETTE = [
	"hsl(35 90% 55%)",
	"hsl(15 80% 55%)",
	"hsl(150 45% 45%)",
	"hsl(210 70% 50%)",
	"hsl(0 65% 55%)"
];
async function getDashboardStats() {
	const { data } = await api.get("/dashboard/stats/");
	return {
		liveVisitors: { value: data.liveVisitors.value.toLocaleString("en-IN") },
		todaysBookings: { value: data.todaysBookings.value.toLocaleString("en-IN") },
		todaysDonations: { value: formatINR(data.todaysDonations.value) },
		volunteersOnDuty: { value: data.volunteersOnDuty.value },
		revenueMTD: { value: formatINR(data.revenueMTD.value) },
		totalDevotees: { value: data.totalDevotees.value.toLocaleString("en-IN") },
		totalEvents: { value: String(data.totalEvents.value) },
		inventoryAlerts: { value: String(data.inventoryAlerts.value) }
	};
}
async function getVisitorFlow() {
	const { data } = await api.get("/dashboard/visitor-flow/");
	return data;
}
async function getAiInsights() {
	const { data } = await api.get("/dashboard/insights/");
	return unwrap(data);
}
async function getRevenueMix() {
	const { data } = await api.get("/dashboard/revenue-mix/");
	return data.map((row, i) => ({
		...row,
		name: row.name ? row.name.charAt(0).toUpperCase() + row.name.slice(1) : "Other",
		color: PALETTE[i % PALETTE.length]
	}));
}
async function getAlerts() {
	const { data } = await api.get("/dashboard/alerts/", { params: { is_active: true } });
	return unwrap(data).map((a) => ({
		id: a.alert_code,
		severity: a.severity,
		category: a.category,
		desc: a.description,
		time: timeAgo(a.created_at)
	}));
}
async function getRecentBookings() {
	const { data } = await api.get("/bookings/", { params: { ordering: "-created_at" } });
	return unwrap(data).slice(0, 6).map((b) => ({
		id: b.booking_code,
		devotee: b.devotee_name,
		seva: b.seva_name,
		date: b.date,
		slot: b.slot,
		amount: formatINR(b.amount),
		status: b.status.charAt(0).toUpperCase() + b.status.slice(1)
	}));
}
//#endregion
export { getRevenueMix as a, getRecentBookings as i, getAlerts as n, getVisitorFlow as o, getDashboardStats as r, getAiInsights as t };
