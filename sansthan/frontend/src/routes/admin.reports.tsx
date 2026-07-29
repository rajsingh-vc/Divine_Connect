import { createFileRoute } from "@tanstack/react-router";
import { BarChart3, FileDown, PieChart as PieIcon, TrendingUp } from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { PageHeader, ChartCard } from "@/components/admin/chart-card";
import { StatCard } from "@/components/admin/stat-card";

const data = [
  { name: "Sevas", value: 4200 }, { name: "Donations", value: 3100 },
  { name: "Prasad", value: 1800 }, { name: "Events", value: 2400 },
  { name: "Merch", value: 900 }, { name: "Other", value: 500 },
];

export const Route = createFileRoute("/admin/reports")({
  head: () => ({ meta: [{ title: "Reports — Sansthan Console" }] }),
  component: () => (
    <>
      <PageHeader eyebrow="Analytics" title="Reports & Insights" subtitle="Download board-ready reports on revenue, footfall, sevas and donor retention." />
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Saved Reports" value="38" icon={BarChart3} accent="amber" trend="flat" />
        <StatCard label="Scheduled" value="12" icon={PieIcon} accent="sky" trend="flat" />
        <StatCard label="Downloads MTD" value="482" change="+24%" icon={FileDown} accent="emerald" />
        <StatCard label="Data Freshness" value="Live" icon={TrendingUp} accent="amber" trend="flat" />
      </div>
      <div className="mt-6">
        <ChartCard title="Revenue by category · MTD">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(30 10% 90%)" />
                <XAxis dataKey="name" fontSize={11} stroke="hsl(30 10% 55%)" />
                <YAxis fontSize={11} stroke="hsl(30 10% 55%)" />
                <Tooltip />
                <Bar dataKey="value" fill="hsl(35 90% 55%)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>
    </>
  ),
});