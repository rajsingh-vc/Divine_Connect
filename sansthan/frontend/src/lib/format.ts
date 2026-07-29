/** Shared formatting helpers so every admin page renders backend numbers/dates consistently. */

export function formatINR(amount: number | string): string {
  const n = typeof amount === "string" ? parseFloat(amount) : amount;
  if (Number.isNaN(n)) return "₹0";
  return `₹${n.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;
}

export function titleCase(value: string): string {
  if (!value) return value;
  return value
    .split(/[_\s]+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");
}

/** Maps a volunteer/status-like value to the exact label the StatusBadge component recognizes. */
export function statusLabel(value: string): string {
  const map: Record<string, string> = {
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
    rejected: "Cancelled",
  };
  return map[value?.toLowerCase()] ?? titleCase(value);
}

export function formatTime(iso?: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
}

export function timeAgo(iso?: string | null): string {
  if (!iso) return "—";
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.round(diffMs / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.round(hrs / 24)}d ago`;
}
