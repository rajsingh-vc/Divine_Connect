import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Heart, TrendingUp, Users, Repeat } from "lucide-react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell, Legend } from "recharts";
import { PageHeader, ChartCard } from "@/components/admin/chart-card";
import { StatCard } from "@/components/admin/stat-card";
import { getDonationTrend, getRevenueMix } from "@/api";

export const Route = createFileRoute("/admin/donations")({
  head: () => ({ meta: [{ title: "Donation Management — Sansthan Console" }] }),
  component: () => {
    const trend = useQuery({ queryKey: ["donationTrend"], queryFn: getDonationTrend });
    const mix = useQuery({ queryKey: ["mix"], queryFn: getRevenueMix });
    return (
      <>
        <PageHeader eyebrow="Fundraising" title="Donation Management" subtitle="Categories, campaigns, receipts and analytics across all donation channels." />
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCard label="Received Today" value="₹42.8L" icon={Heart} accent="amber" trend="flat" />
          <StatCard label="MTD" value="₹8.4Cr" change="+22%" icon={TrendingUp} accent="emerald" />
          <StatCard label="Donors This Month" value="18,420" icon={Users} accent="sky" trend="flat" />
          <StatCard label="Recurring" value="4,210" icon={Repeat} accent="amber" trend="flat" />
        </div>
        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <ChartCard title="Donation trend">
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trend.data || []}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(30 10% 90%)" />
                    <XAxis dataKey="month" fontSize={11} stroke="hsl(30 10% 55%)" />
                    <YAxis fontSize={11} stroke="hsl(30 10% 55%)" />
                    <Tooltip />
                    <Line type="monotone" dataKey="amount" stroke="hsl(35 90% 55%)" strokeWidth={2.5} dot={{ r: 3 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>
          </div>
          <ChartCard title="Category mix">
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={mix.data || []} dataKey="value" nameKey="name" innerRadius={45} outerRadius={90}>
                    {(mix.data || []).map((e, i) => <Cell key={i} fill={e.color} />)}
                  </Pie>
                  <Legend verticalAlign="bottom" iconType="circle" wrapperStyle={{ fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      </>
    );
  },
});