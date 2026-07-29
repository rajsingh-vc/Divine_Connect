import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { CalendarDays, Users, Sparkles, Plus } from "lucide-react";
import { PageHeader, ChartCard } from "@/components/admin/chart-card";
import { StatCard } from "@/components/admin/stat-card";
import { DataTable } from "@/components/admin/data-table";
import { StatusBadge } from "@/components/admin/badges";
import { getEvents } from "@/api";

export const Route = createFileRoute("/admin/events")({
  head: () => ({ meta: [{ title: "Events — Sansthan Console" }] }),
  component: () => {
    const q = useQuery({ queryKey: ["events"], queryFn: getEvents });
    return (
      <>
        <PageHeader eyebrow="Festivals" title="Event Management" subtitle="Plan, staff and run every festival and special utsav from one place." actions={<button className="inline-flex items-center gap-2 rounded-full bg-foreground px-4 py-2 text-xs font-semibold text-background"><Plus className="h-3.5 w-3.5" /> New event</button>} />
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCard label="Upcoming" value="14" icon={CalendarDays} accent="amber" trend="flat" />
          <StatCard label="This Year" value="42" icon={Sparkles} accent="sky" trend="flat" />
          <StatCard label="Expected Footfall" value="14L" change="peak" icon={Users} accent="emerald" trend="flat" />
          <StatCard label="Draft" value="6" icon={CalendarDays} accent="rose" trend="flat" />
        </div>
        <div className="mt-6">
          <ChartCard title="Event calendar">
            <DataTable rows={q.data || []} columns={[
              { key: "id", header: "ID", render: (r) => <span className="font-mono text-xs text-muted-foreground">{r.id}</span> },
              { key: "name", header: "Event" },
              { key: "date", header: "Date" },
              { key: "visitors", header: "Expected" },
              { key: "status", header: "Status", render: (r) => <StatusBadge status={r.status} /> },
            ]} />
          </ChartCard>
        </div>
      </>
    );
  },
});