//#region node_modules/.nitro/vite/services/ssr/assets/format-oajkEy3m.js
/** Shared formatting helpers so every admin page renders backend numbers/dates consistently. */
function formatINR(amount) {
	const n = typeof amount === "string" ? parseFloat(amount) : amount;
	if (Number.isNaN(n)) return "₹0";
	return `₹${n.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;
}
function titleCase(value) {
	if (!value) return value;
	return value.split(/[_\s]+/).map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(" ");
}
/** Maps a volunteer/status-like value to the exact label the StatusBadge component recognizes. */
function statusLabel(value) {
	return {
		confirmed: "Confirmed",
		completed: "Completed",
		pending: "Pending",
		cancelled: "Cancelled",
		active: "On duty",
		inactive: "Off duty",
		inside: "Inside",
		exited: "Exited",
		ok: "OK",
		low: "Low",
		critical: "Critical",
		upcoming: "Upcoming",
		planning: "Planning",
		vip: "VIP",
		member: "Member",
		approved: "Pending",
		rejected: "Cancelled"
	}[value?.toLowerCase()] ?? titleCase(value);
}
function formatTime(iso) {
	if (!iso) return "—";
	return new Date(iso).toLocaleTimeString("en-IN", {
		hour: "2-digit",
		minute: "2-digit"
	});
}
function timeAgo(iso) {
	if (!iso) return "—";
	const diffMs = Date.now() - new Date(iso).getTime();
	const mins = Math.round(diffMs / 6e4);
	if (mins < 1) return "just now";
	if (mins < 60) return `${mins}m ago`;
	const hrs = Math.round(mins / 60);
	if (hrs < 24) return `${hrs}h ago`;
	return `${Math.round(hrs / 24)}d ago`;
}
//#endregion
export { titleCase as a, timeAgo as i, formatTime as n, statusLabel as r, formatINR as t };
