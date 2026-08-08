import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  BarChart3,
  ChevronRight,
  FileDown,
  HandCoins,
  PieChart as PieIcon,
  Sparkles,
  TrendingDown,
  TrendingUp,
  Users,
  CalendarClock,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { PageHeader, ChartCard } from "@/components/admin/chart-card";
import { StatCard } from "@/components/admin/stat-card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

const revenueData = [
  { name: "Sevas", value: 4200 },
  { name: "Donations", value: 3100 },
  { name: "Prasad", value: 1800 },
  { name: "Events", value: 2400 },
  { name: "Merch", value: 900 },
  { name: "Other", value: 500 },
];

// Maps a bar/category name on any chart to the report whose 4 drill-downs
// should open when that bar is clicked.
const categoryToReportId: Record<string, string> = {
  Sevas: "seva",
  Donations: "revenue",
  Prasad: "revenue",
  Events: "events",
  Merch: "revenue",
  Other: "revenue",
};

// ---------------------------------------------------------------------------
// Report definitions — each report has 3-4 "drill-downs": a focused metric
// with its own mini chart and a plain-English explanation of what it means
// and why it matters, so clicking a report card actually surfaces insight
// instead of just a static number.
// ---------------------------------------------------------------------------

type Drill = {
  title: string;
  value: string;
  change?: string;
  trend?: "up" | "down" | "flat";
  explanation: string;
  chart:
    | { type: "bar"; data: { name: string; value: number }[] }
    | { type: "line"; data: { name: string; value: number }[] }
    | { type: "pie"; data: { name: string; value: number }[] };
};

type ReportDef = {
  id: string;
  title: string;
  summary: string;
  icon: typeof BarChart3;
  accent: "amber" | "sky" | "emerald" | "rose";
  drills: Drill[];
};

const PIE_COLORS = ["hsl(35 90% 55%)", "hsl(200 80% 55%)", "hsl(150 55% 45%)", "hsl(0 70% 60%)"];

const reports: ReportDef[] = [
  {
    id: "revenue",
    title: "Revenue & Donations",
    summary: "Where money comes from, how fast it's growing, and who's giving it.",
    icon: HandCoins,
    accent: "amber",
    drills: [
      {
        title: "Category-wise revenue split",
        value: "₹13,900 MTD",
        change: "+18% vs last month",
        trend: "up",
        explanation:
          "Sevas and donations together drive ~65% of total inflow this month. Prasad and merch remain small but stable side revenue — worth a bundled-offer push during festival weeks.",
        chart: { type: "bar", data: revenueData },
      },
      {
        title: "Month-over-month growth trend",
        value: "+18.4%",
        change: "6-month high",
        trend: "up",
        explanation:
          "Revenue has climbed for three straight months, largely on the back of the new online seva booking flow. If the trend holds, the quarter closes well above the annual target.",
        chart: {
          type: "line",
          data: [
            { name: "Mar", value: 8200 },
            { name: "Apr", value: 9100 },
            { name: "May", value: 9800 },
            { name: "Jun", value: 11200 },
            { name: "Jul", value: 12500 },
            { name: "Aug", value: 13900 },
          ],
        },
      },
      {
        title: "Payment mode split",
        value: "UPI 61%",
        change: "+9pp vs last quarter",
        trend: "up",
        explanation:
          "UPI has overtaken cards and cash combined, largely from mobile devotees paying at the counter QR. Cash is shrinking fastest — a signal the counter-side terminals could be reduced next cycle.",
        chart: {
          type: "pie",
          data: [
            { name: "UPI", value: 61 },
            { name: "Card", value: 22 },
            { name: "Cash", value: 12 },
            { name: "Other", value: 5 },
          ],
        },
      },
      {
        title: "Top donor segments",
        value: "₹500–2000 tier",
        change: "42% of donors",
        trend: "flat",
        explanation:
          "The mid-tier donor band contributes the largest share by donor count, but the ₹5000+ tier — though only 6% of donors — contributes nearly a quarter of total value. Retention efforts should focus here first.",
        chart: {
          type: "bar",
          data: [
            { name: "<₹500", value: 28 },
            { name: "₹500-2k", value: 42 },
            { name: "₹2k-5k", value: 24 },
            { name: "₹5k+", value: 6 },
          ],
        },
      },
    ],
  },
  {
    id: "seva",
    title: "Seva & Bookings",
    summary: "Which sevas are booked most, when, and how often people return.",
    icon: Sparkles,
    accent: "sky",
    drills: [
      {
        title: "Most-booked sevas",
        value: "Abhishekam",
        change: "38% of all bookings",
        trend: "up",
        explanation:
          "Abhishekam remains the clear favourite, followed by Archana. These two sevas alone account for over half of booking volume — prioritise them for slot expansion during peak hours.",
        chart: {
          type: "bar",
          data: [
            { name: "Abhishekam", value: 38 },
            { name: "Archana", value: 24 },
            { name: "Kalyanam", value: 16 },
            { name: "Homam", value: 12 },
            { name: "Other", value: 10 },
          ],
        },
      },
      {
        title: "Peak booking windows",
        value: "6–8 AM",
        change: "34% of daily volume",
        trend: "up",
        explanation:
          "Early-morning slots fill up fastest, often within minutes of opening. Evening 6-8 PM is the secondary peak. Staffing and counter support should be weighted toward these two windows.",
        chart: {
          type: "line",
          data: [
            { name: "6am", value: 34 },
            { name: "9am", value: 18 },
            { name: "12pm", value: 10 },
            { name: "3pm", value: 8 },
            { name: "6pm", value: 22 },
            { name: "9pm", value: 8 },
          ],
        },
      },
      {
        title: "Seva revenue contribution",
        value: "₹4,200 MTD",
        change: "+11% vs last month",
        trend: "up",
        explanation:
          "Sevas are the single largest revenue category this month, ahead of direct donations. Abhishekam and Kalyanam bookings are the biggest movers behind the increase.",
        chart: { type: "bar", data: revenueData.slice(0, 4) },
      },
      {
        title: "Repeat booking rate",
        value: "46%",
        change: "+5pp vs last quarter",
        trend: "up",
        explanation:
          "Nearly half of devotees who book a seva come back within 90 days. That repeat rate is a strong signal the booking experience is working — worth highlighting in donor communication.",
        chart: {
          type: "pie",
          data: [
            { name: "Repeat", value: 46 },
            { name: "First-time", value: 54 },
          ],
        },
      },
    ],
  },
  {
    id: "donors",
    title: "Devotee & Donor Retention",
    summary: "New vs. returning donors, retention rate, and who's at risk of lapsing.",
    icon: Users,
    accent: "emerald",
    drills: [
      {
        title: "New vs returning donors",
        value: "58% returning",
        change: "+4pp vs last month",
        trend: "up",
        explanation:
          "Returning donors now make up a majority of monthly contributors. New donor acquisition has slowed slightly, so a welcome-follow-up campaign could help convert first-time givers into repeat ones.",
        chart: {
          type: "pie",
          data: [
            { name: "Returning", value: 58 },
            { name: "New", value: 42 },
          ],
        },
      },
      {
        title: "Overall retention rate",
        value: "64%",
        change: "-2pp vs last quarter",
        trend: "down",
        explanation:
          "Retention has dipped slightly this quarter after a strong run — most of the drop is concentrated in donors who gave only once last year. A re-engagement email to that group is likely the highest-leverage fix.",
        chart: {
          type: "line",
          data: [
            { name: "Q1", value: 61 },
            { name: "Q2", value: 65 },
            { name: "Q3", value: 68 },
            { name: "Q4", value: 66 },
            { name: "Q5", value: 64 },
          ],
        },
      },
      {
        title: "Average donation size trend",
        value: "₹1,240",
        change: "+7% vs last quarter",
        trend: "up",
        explanation:
          "Average gift size is trending upward even as new-donor growth cools, meaning existing donors are giving more per visit — a healthier pattern than chasing volume alone.",
        chart: {
          type: "line",
          data: [
            { name: "Apr", value: 1050, },
            { name: "May", value: 1120 },
            { name: "Jun", value: 1180 },
            { name: "Jul", value: 1210 },
            { name: "Aug", value: 1240 },
          ],
        },
      },
      {
        title: "Lapsed donor segment",
        value: "312 donors",
        change: "No gift in 6+ months",
        trend: "down",
        explanation:
          "These 312 donors gave at least once in the past but have gone quiet for over half a year. Historically about 1 in 5 respond to a personal outreach call or festival invite — a quick win if resourced.",
        chart: {
          type: "bar",
          data: [
            { name: "0-3 mo", value: 890 },
            { name: "3-6 mo", value: 410 },
            { name: "6-12 mo", value: 312 },
            { name: "12mo+", value: 178 },
          ],
        },
      },
    ],
  },
  {
    id: "events",
    title: "Events & Footfall",
    summary: "Attendance by event, volunteer load, and how footfall is trending.",
    icon: CalendarClock,
    accent: "rose",
    drills: [
      {
        title: "Footfall by event",
        value: "Annual Utsavam",
        change: "12,400 visitors",
        trend: "up",
        explanation:
          "The Annual Utsavam dwarfs every other event on the calendar in footfall. Smaller monthly events draw a steady but modest crowd — good candidates for combining with a seva promotion to boost turnout.",
        chart: {
          type: "bar",
          data: [
            { name: "Utsavam", value: 12400 },
            { name: "Navratri", value: 6200 },
            { name: "Monthly Puja", value: 2100 },
            { name: "Others", value: 1400 },
          ],
        },
      },
      {
        title: "Attendance trend",
        value: "+14% YoY",
        change: "vs same period last year",
        trend: "up",
        explanation:
          "Footfall this year is meaningfully ahead of last year's same period, likely driven by improved event listing visibility on the site and word-of-mouth from the Utsavam livestream.",
        chart: {
          type: "line",
          data: [
            { name: "2023", value: 68 },
            { name: "2024", value: 74 },
            { name: "2025", value: 79 },
            { name: "2026", value: 90 },
          ],
        },
      },
      {
        title: "Volunteer utilisation",
        value: "82%",
        change: "+6pp vs last event",
        trend: "up",
        explanation:
          "Volunteer shifts are being filled more completely than the previous event, but a handful of duty slots — mostly early-morning setup — are still under-covered and worth flagging in the next volunteer call-out.",
        chart: {
          type: "pie",
          data: [
            { name: "Filled", value: 82 },
            { name: "Open", value: 18 },
          ],
        },
      },
      {
        title: "Event revenue vs cost",
        value: "2.4x ROI",
        change: "+0.3x vs last event",
        trend: "up",
        explanation:
          "Every rupee spent on the last event returned roughly 2.4x in donations, seva bookings and stall revenue on-site — comfortably ahead of the 2.0x internal target and the best ratio in three events.",
        chart: {
          type: "bar",
          data: [
            { name: "Cost", value: 100 },
            { name: "Revenue", value: 240 },
          ],
        },
      },
    ],
  },
];

const accentClasses: Record<string, string> = {
  amber: "bg-amber-100 text-amber-700",
  sky: "bg-sky-100 text-sky-700",
  emerald: "bg-emerald-100 text-emerald-700",
  rose: "bg-rose-100 text-rose-700",
};

function trendColor(trend?: "up" | "down" | "flat") {
  if (trend === "up") return "text-emerald-600";
  if (trend === "down") return "text-rose-600";
  return "text-muted-foreground";
}

function TrendIcon({ trend }: { trend?: "up" | "down" | "flat" }) {
  if (trend === "down") return <TrendingDown className="h-3.5 w-3.5" />;
  return <TrendingUp className="h-3.5 w-3.5" />;
}

function DrillChart({
  chart,
  onCategoryClick,
}: {
  chart: Drill["chart"];
  onCategoryClick?: (name: string) => void;
}) {
  if (chart.type === "bar") {
    return (
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chart.data}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(30 10% 90%)" />
          <XAxis dataKey="name" fontSize={10} stroke="hsl(30 10% 55%)" />
          <YAxis fontSize={10} stroke="hsl(30 10% 55%)" />
          <Tooltip />
          <Bar
            dataKey="value"
            fill="hsl(35 90% 55%)"
            radius={[6, 6, 0, 0]}
            className={onCategoryClick ? "cursor-pointer" : undefined}
            onClick={(data: { name?: string; payload?: { name?: string } }) => {
              const name = data?.payload?.name ?? data?.name;
              if (name) onCategoryClick?.(name);
            }}
          />
        </BarChart>
      </ResponsiveContainer>
    );
  }
  if (chart.type === "line") {
    return (
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chart.data}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(30 10% 90%)" />
          <XAxis dataKey="name" fontSize={10} stroke="hsl(30 10% 55%)" />
          <YAxis fontSize={10} stroke="hsl(30 10% 55%)" />
          <Tooltip />
          <Line type="monotone" dataKey="value" stroke="hsl(35 90% 50%)" strokeWidth={2} dot={{ r: 3 }} />
        </LineChart>
      </ResponsiveContainer>
    );
  }
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie data={chart.data} dataKey="value" nameKey="name" innerRadius={35} outerRadius={60} paddingAngle={3}>
          {chart.data.map((_, i) => (
            <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );
}

function ReportCard({ report, onOpen }: { report: ReportDef; onOpen: () => void }) {
  const Icon = report.icon;
  return (
    <button
      type="button"
      onClick={onOpen}
      className="group flex flex-col items-start gap-3 rounded-2xl border border-border bg-card p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="flex w-full items-start justify-between">
        <div className={cn("grid h-10 w-10 shrink-0 place-items-center rounded-full", accentClasses[report.accent])}>
          <Icon className="h-5 w-5" />
        </div>
        <ChevronRight className="h-4 w-4 text-muted-foreground transition group-hover:translate-x-0.5 group-hover:text-foreground" />
      </div>
      <div>
        <h3 className="font-serif text-lg font-semibold text-foreground">{report.title}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{report.summary}</p>
      </div>
      <span className="mt-1 text-xs font-semibold uppercase tracking-wide text-primary">
        {report.drills.length} drill-downs →
      </span>
    </button>
  );
}

function ReportDialog({
  report,
  open,
  onClose,
  onNavigate,
}: {
  report: ReportDef | null;
  open: boolean;
  onClose: () => void;
  onNavigate: (categoryName: string) => void;
}) {
  if (!report) return null;
  const Icon = report.icon;
  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-h-[85vh] max-w-3xl overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className={cn("grid h-10 w-10 shrink-0 place-items-center rounded-full", accentClasses[report.accent])}>
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle className="font-serif text-2xl">{report.title}</DialogTitle>
              <DialogDescription>{report.summary}</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="mt-4 space-y-5">
          {report.drills.map((drill, i) => (
            <div key={i} className="rounded-xl border border-border bg-muted/30 p-4">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Drill-down {i + 1}
                  </p>
                  <h4 className="font-serif text-base font-semibold text-foreground">{drill.title}</h4>
                </div>
                <div className="text-right">
                  <p className="font-serif text-xl font-semibold text-foreground">{drill.value}</p>
                  {drill.change && (
                    <p className={cn("flex items-center justify-end gap-1 text-xs font-medium", trendColor(drill.trend))}>
                      <TrendIcon trend={drill.trend} />
                      {drill.change}
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-[1fr_auto] sm:items-center">
                <p className="text-sm leading-relaxed text-muted-foreground">{drill.explanation}</p>
                <div className="h-32 w-full sm:w-56">
                  <DrillChart
                    chart={drill.chart}
                    onCategoryClick={
                      drill.chart.type === "bar" ? (name) => onNavigate(name) : undefined
                    }
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export const Route = createFileRoute("/admin/reports")({
  head: () => ({ meta: [{ title: "Reports — Sansthan Console" }] }),
  component: () => {
    const [activeId, setActiveId] = useState<string | null>(null);
    const activeReport = useMemo(() => reports.find((r) => r.id === activeId) ?? null, [activeId]);

    return (
      <>
        <PageHeader
          eyebrow="Analytics"
          title="Reports & Insights"
          subtitle="Click any report below to drill into the metrics behind it, with a plain-English explanation of what's driving each number."
        />

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCard label="Saved Reports" value="38" icon={BarChart3} accent="amber" trend="flat" />
          <StatCard label="Scheduled" value="12" icon={PieIcon} accent="sky" trend="flat" />
          <StatCard label="Downloads MTD" value="482" change="+24%" icon={FileDown} accent="emerald" />
          <StatCard label="Data Freshness" value="Live" icon={TrendingUp} accent="amber" trend="flat" />
        </div>

        <div className="mt-6">
          <ChartCard title="Revenue by category · MTD">
            <p className="-mt-2 mb-3 text-xs text-muted-foreground">
              Click any bar to open its 4 drill-downs.
            </p>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(30 10% 90%)" />
                  <XAxis dataKey="name" fontSize={11} stroke="hsl(30 10% 55%)" />
                  <YAxis fontSize={11} stroke="hsl(30 10% 55%)" />
                  <Tooltip />
                  <Bar
                    dataKey="value"
                    fill="hsl(35 90% 55%)"
                    radius={[6, 6, 0, 0]}
                    className="cursor-pointer"
                    onClick={(data: { name?: string; payload?: { name?: string } }) => {
                      const name = data?.payload?.name ?? data?.name;
                      const targetId = name ? categoryToReportId[name] : undefined;
                      if (targetId) setActiveId(targetId);
                    }}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>

        <div className="mt-8">
          <h2 className="mb-1 font-serif text-xl font-semibold text-foreground">Report library</h2>
          <p className="mb-4 text-sm text-muted-foreground">
            Each report opens with 3–4 drill-downs — a focused metric, its trend, and why it matters.
          </p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {reports.map((report) => (
              <ReportCard key={report.id} report={report} onOpen={() => setActiveId(report.id)} />
            ))}
          </div>
        </div>

        <ReportDialog
          report={activeReport}
          open={!!activeReport}
          onClose={() => setActiveId(null)}
          onNavigate={(name) => {
            const targetId = categoryToReportId[name];
            if (targetId) setActiveId(targetId);
          }}
        />
      </>
    );
  },
});