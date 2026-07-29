import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { UserCheck, Users, LogIn, LogOut } from "lucide-react";
import { PageHeader, ChartCard } from "@/components/admin/chart-card";
import { StatCard } from "@/components/admin/stat-card";
import { DataTable } from "@/components/admin/data-table";
import { StatusBadge } from "@/components/admin/badges";
import { getVisitors } from "@/api";

export const Route = createFileRoute("/admin/visitors")({
  head: () => ({ meta: [{ title: "Visitors — Sansthan Console" }] }),
  component: () => {
    const q = useQuery({ queryKey: ["visitors"], queryFn: getVisitors });
    return (
      <>
        <PageHeader eyebrow="Live" title="Visitor Flow" subtitle="Realtime check-ins, zone occupancy and exits across the campus." />
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCard label="Inside Now" value="18,432" change="+12%" icon={UserCheck} accent="emerald" />
          <StatCard label="Check-ins Today" value="42,180" icon={LogIn} accent="amber" trend="flat" />
          <StatCard label="Exits Today" value="24,050" icon={LogOut} accent="sky" trend="flat" />
          <StatCard label="Peak Concurrent" value="21.4K" change="6:30 PM" icon={Users} accent="amber" trend="flat" />
        </div>
        <div className="mt-6">
          <ChartCard title="Recent check-ins">
            <DataTable rows={q.data || []} columns={[
              { key: "id", header: "ID", render: (r) => <span className="font-mono text-xs text-muted-foreground">{r.id}</span> },
              { key: "name", header: "Name" },
              { key: "checkIn", header: "Check In" },
              { key: "zone", header: "Zone" },
              { key: "party", header: "Party" },
              { key: "status", header: "Status", render: (r) => <StatusBadge status={r.status} /> },
            ]} />
          </ChartCard>
        </div>
      </>
    );
  },
});