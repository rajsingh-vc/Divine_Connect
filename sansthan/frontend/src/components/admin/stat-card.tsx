import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function StatCard({
  label,
  value,
  change,
  trend = "up",
  icon: Icon,
  accent = "amber",
}: {
  label: string;
  value: string;
  change?: string;
  trend?: "up" | "down" | "flat";
  icon?: LucideIcon;
  accent?: "amber" | "sky" | "emerald" | "rose";
}) {
  const accents: Record<string, string> = {
    amber: "bg-amber-100 text-amber-700",
    sky: "bg-sky-100 text-sky-700",
    emerald: "bg-emerald-100 text-emerald-700",
    rose: "bg-rose-100 text-rose-700",
  };
  const trendColor =
    trend === "up" ? "text-emerald-600" : trend === "down" ? "text-amber-600" : "text-rose-600";
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground truncate">
          {label}
        </p>
        {Icon && (
          <div className={cn("grid h-9 w-9 shrink-0 place-items-center rounded-full", accents[accent])}>
            <Icon className="h-4 w-4" />
          </div>
        )}
      </div>
      <p className="mt-3 font-serif text-3xl font-semibold text-foreground">{value}</p>
      {change && <p className={cn("mt-1 text-xs font-medium", trendColor)}>{change}</p>}
    </div>
  );
}