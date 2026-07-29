import { createFileRoute } from "@tanstack/react-router";
import { Settings, Users, Shield, Server } from "lucide-react";
import { PageHeader, ChartCard } from "@/components/admin/chart-card";
import { StatCard } from "@/components/admin/stat-card";

export const Route = createFileRoute("/admin/platform")({
  head: () => ({ meta: [{ title: "Platform Admin — Sansthan Console" }] }),
  component: () => (
    <>
      <PageHeader eyebrow="Governance" title="Platform Administration" subtitle="Tenants, users, roles, security policies and system health for the entire Sansthan platform." />
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Tenants" value="42" icon={Server} accent="amber" trend="flat" />
        <StatCard label="Admin Users" value="128" icon={Users} accent="sky" trend="flat" />
        <StatCard label="Roles" value="14" icon={Shield} accent="emerald" trend="flat" />
        <StatCard label="System Health" value="99.98%" change="30d uptime" icon={Settings} accent="emerald" />
      </div>
      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <ChartCard title="Recent audit events">
          <ul className="space-y-3 text-sm">
            <li className="flex justify-between border-b border-border pb-2"><span>Role "Priest Manager" updated</span><span className="text-xs text-muted-foreground">2h ago</span></li>
            <li className="flex justify-between border-b border-border pb-2"><span>New tenant "Shirdi Sansthan" onboarded</span><span className="text-xs text-muted-foreground">6h ago</span></li>
            <li className="flex justify-between border-b border-border pb-2"><span>2FA enforced org-wide</span><span className="text-xs text-muted-foreground">1d ago</span></li>
            <li className="flex justify-between"><span>API key rotated · payments</span><span className="text-xs text-muted-foreground">3d ago</span></li>
          </ul>
        </ChartCard>
        <ChartCard title="Security posture">
          <ul className="space-y-3 text-sm">
            <li className="flex justify-between"><span>SSO enabled</span><span className="text-emerald-600 font-semibold">Yes</span></li>
            <li className="flex justify-between"><span>Audit log retention</span><span className="font-semibold">2 years</span></li>
            <li className="flex justify-between"><span>Encryption at rest</span><span className="text-emerald-600 font-semibold">AES-256</span></li>
            <li className="flex justify-between"><span>Backup frequency</span><span className="font-semibold">Every 6h</span></li>
          </ul>
        </ChartCard>
      </div>
    </>
  ),
});