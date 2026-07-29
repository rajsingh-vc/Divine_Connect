import { cn } from "@/lib/utils";

export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    Confirmed: "bg-emerald-100 text-emerald-700 border-emerald-200",
    Completed: "bg-emerald-100 text-emerald-700 border-emerald-200",
    Pending: "bg-amber-100 text-amber-700 border-amber-200",
    Cancelled: "bg-rose-100 text-rose-700 border-rose-200",
    "On duty": "bg-emerald-100 text-emerald-700 border-emerald-200",
    "Off duty": "bg-muted text-muted-foreground border-border",
    Inside: "bg-emerald-100 text-emerald-700 border-emerald-200",
    Exited: "bg-muted text-muted-foreground border-border",
    OK: "bg-emerald-100 text-emerald-700 border-emerald-200",
    Low: "bg-amber-100 text-amber-700 border-amber-200",
    Critical: "bg-rose-100 text-rose-700 border-rose-200",
    Upcoming: "bg-sky-100 text-sky-700 border-sky-200",
    Planning: "bg-violet-100 text-violet-700 border-violet-200",
    VIP: "bg-primary/15 text-primary border-primary/30",
    Member: "bg-muted text-muted-foreground border-border",
    "In Progress": "bg-sky-100 text-sky-700 border-sky-200",
    Blocked: "bg-rose-100 text-rose-700 border-rose-200",
  };
  const cls = map[status] || "bg-muted text-muted-foreground border-border";
  return (
    <span className={cn("inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium", cls)}>
      {status}
    </span>
  );
}

export function SeverityBadge({ severity }: { severity: string }) {
  const map: Record<string, string> = {
    high: "bg-rose-100 text-rose-700 border-rose-200",
    medium: "bg-amber-100 text-amber-700 border-amber-200",
    low: "bg-muted text-muted-foreground border-border",
  };
  return (
    <span className={cn("inline-flex items-center rounded-md border px-2 py-0.5 text-[11px] font-semibold uppercase", map[severity])}>
      {severity}
    </span>
  );
}