import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid,
  PieChart, Pie, Cell, Legend,
} from "recharts";
import { Users, ShoppingBag, Heart, HandHeart, CalendarDays, Boxes, TrendingUp } from "lucide-react";
import { PageHeader, ChartCard } from "@/components/admin/chart-card";
import { StatCard } from "@/components/admin/stat-card";
import { StatusBadge, SeverityBadge } from "@/components/admin/badges";
import { DataTable } from "@/components/admin/data-table";
import { LiveBadge, ExportButton } from "@/components/admin/shell";
import {
  getDashboardStats, getVisitorFlow, getAiInsights,
  getRevenueMix, getAlerts, getRecentBookings,
} from "@/api/dashboard";

export const Route = createFileRoute("/admin/")({
  head: () => ({
    meta: [
      { title: "Command Dashboard — Sansthan Console" },
      { name: "description", content: "Realtime operations dashboard for temples and sansthans." },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const stats = useQuery({ queryKey: ["stats"], queryFn: getDashboardStats });
  const flow = useQuery({ queryKey: ["flow"], queryFn: getVisitorFlow });
  const insights = useQuery({ queryKey: ["insights"], queryFn: getAiInsights });
  const mix = useQuery({ queryKey: ["mix"], queryFn: getRevenueMix });
  const alerts = useQuery({ queryKey: ["alerts"], queryFn: getAlerts });
  const bookings = useQuery({ queryKey: ["recentBookings"], queryFn: getRecentBookings });
  const s = stats.data;

  return (
    <>
      <PageHeader
        eyebrow="Live Overview"
        title="Command Dashboard"
        subtitle="Realtime visibility into visitors, bookings, donations and operational alerts across all zones."
        actions={<><LiveBadge /><ExportButton /></>}
      />

      {stats.isLoading || !s ? (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-32 animate-pulse rounded-2xl bg-muted" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCard label="Live Visitors" value={s.liveVisitors.value} icon={Users} accent="amber" trend="flat" />
          <StatCard label="Today's Bookings" value={s.todaysBookings.value} icon={ShoppingBag} accent="sky" trend="flat" />
          <StatCard label="Today's Donations" value={s.todaysDonations.value} icon={Heart} accent="emerald" trend="flat" />
          <StatCard label="Volunteers On Duty" value={s.volunteersOnDuty.value} icon={HandHeart} accent="amber" trend="flat" />
          <StatCard label="Total Devotees" value={s.totalDevotees.value} icon={Users} accent="sky" trend="flat" />
          <StatCard label="Total Events" value={s.totalEvents.value} icon={CalendarDays} accent="amber" trend="flat" />
          <StatCard label="Inventory Alerts" value={s.inventoryAlerts.value} icon={Boxes} accent="rose" trend="flat" />
          <StatCard label="Revenue MTD" value={s.revenueMTD.value} icon={TrendingUp} accent="emerald" trend="flat" />
        </div>
      )}

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ChartCard title="Visitor & booking flow · today">
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={flow.data || []}>
                  <defs>
                    <linearGradient id="gVis" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(35 90% 55%)" stopOpacity={0.5} />
                      <stop offset="100%" stopColor="hsl(35 90% 55%)" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="gBook" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(210 70% 50%)" stopOpacity={0.4} />
                      <stop offset="100%" stopColor="hsl(210 70% 50%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(30 10% 90%)" />
                  <XAxis dataKey="hour" fontSize={11} stroke="hsl(30 10% 55%)" />
                  <YAxis fontSize={11} stroke="hsl(30 10% 55%)" />
                  <Tooltip />
                  <Area type="monotone" dataKey="visitors" stroke="hsl(35 90% 55%)" fill="url(#gVis)" strokeWidth={2} />
                  <Area type="monotone" dataKey="bookings" stroke="hsl(210 70% 50%)" fill="url(#gBook)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
        <ChartCard title="AI insights">
          <div className="space-y-3">
            {(insights.data || []).map((i, k) => (
              <div key={k} className="rounded-xl border border-border bg-background p-3">
                <p className="text-sm font-semibold text-foreground">{i.title}</p>
                <p className="mt-1 text-xs text-muted-foreground">{i.detail}</p>
              </div>
            ))}
          </div>
        </ChartCard>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <ChartCard title="Revenue mix · 12 months">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={mix.data || []} dataKey="value" nameKey="name" innerRadius={50} outerRadius={90} paddingAngle={2}>
                  {(mix.data || []).map((e, i) => <Cell key={i} fill={e.color} />)}
                </Pie>
                <Legend verticalAlign="bottom" iconType="circle" wrapperStyle={{ fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
        <div className="lg:col-span-2">
          <ChartCard title="Active alerts">
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
                </div>
              ))}
            </div>
          </ChartCard>
        </div>
      </div>

      <div className="mt-6">
        <ChartCard title="Recent bookings">
          <DataTable
            rows={bookings.data || []}
            columns={[
              { key: "id", header: "ID", render: (r) => <span className="font-mono text-xs text-muted-foreground">{r.id}</span> },
              { key: "devotee", header: "Devotee" },
              { key: "seva", header: "Seva" },
              { key: "date", header: "Date" },
              { key: "slot", header: "Slot" },
              { key: "amount", header: "Amount", render: (r) => <span className="font-semibold">{r.amount}</span> },
              { key: "status", header: "Status", render: (r) => <StatusBadge status={r.status} /> },
            ]}
          />
        </ChartCard>
      </div>
    </>
  );
}