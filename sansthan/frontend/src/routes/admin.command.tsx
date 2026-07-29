import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { PageHeader, ChartCard } from "@/components/admin/chart-card";
import { LiveBadge, ExportButton } from "@/components/admin/shell";
import { SeverityBadge } from "@/components/admin/badges";
import { StatCard } from "@/components/admin/stat-card";
import { Siren, ShieldAlert, Users, Radio } from "lucide-react";
import { getAlerts } from "@/api/dashboard";

export const Route = createFileRoute("/admin/command")({
  head: () => ({ meta: [{ title: "Command Centre — Sansthan Console" }] }),
  component: () => {
    const alerts = useQuery({ queryKey: ["alerts"], queryFn: getAlerts });
    return (
      <>
        <PageHeader eyebrow="Operations" title="Command Centre" subtitle="War-room view of every active incident, zone status and field response." actions={<><LiveBadge /><ExportButton /></>} />
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCard label="Active Alerts" value="7" change="2 new" icon={Siren} accent="rose" />
          <StatCard label="Zones Green" value="12 / 14" change="86%" icon={ShieldAlert} accent="emerald" />
          <StatCard label="Field Teams" value="24" change="on-ground" icon={Users} accent="amber" trend="flat" />
          <StatCard label="Radio Channels" value="6" change="clear" icon={Radio} accent="sky" trend="flat" />
        </div>
        <div className="mt-6">
          <ChartCard title="Incident log">
            <div className="space-y-2">
              {(alerts.data || []).map((a) => (
                <div key={a.id} className="flex items-start gap-3 rounded-xl border border-border p-3">
                  <SeverityBadge severity={a.severity} />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-foreground">
                      <span className="text-xs uppercase tracking-wider text-muted-foreground">{a.category}</span>
                      <span className="mx-2 text-muted-foreground">·</span>
                      {a.desc}
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{a.id} · {a.time}</p>
                  </div>
                  <button className="rounded-full border border-border px-3 py-1 text-xs font-medium hover:bg-muted">Assign</button>
                </div>
              ))}
            </div>
          </ChartCard>
        </div>
      </>
    );
  },
});