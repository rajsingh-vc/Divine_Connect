import { createFileRoute } from "@tanstack/react-router";
import { Bot, Plug, Sparkles, Cpu } from "lucide-react";
import { PageHeader, ChartCard } from "@/components/admin/chart-card";
import { StatCard } from "@/components/admin/stat-card";

const integrations = [
  { name: "Razorpay Payments", category: "Payments", status: "Connected" },
  { name: "Twilio WhatsApp", category: "Messaging", status: "Connected" },
  { name: "Google Analytics", category: "Analytics", status: "Connected" },
  { name: "Zoho Books", category: "Accounting", status: "Not connected" },
  { name: "OpenAI GPT-5", category: "AI Model", status: "Connected" },
  { name: "Live Darshan CDN", category: "Streaming", status: "Connected" },
];

export const Route = createFileRoute("/admin/ai")({
  head: () => ({ meta: [{ title: "AI & Integrations — Sansthan Console" }] }),
  component: () => (
    <>
      <PageHeader eyebrow="Automation" title="AI & Integrations" subtitle="Connect models, third-party services and automations that power the platform." />
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Active AI Agents" value="6" icon={Bot} accent="amber" trend="flat" />
        <StatCard label="Integrations" value="18" change="+3" icon={Plug} accent="sky" />
        <StatCard label="Automations Run" value="14,820" icon={Sparkles} accent="emerald" trend="flat" />
        <StatCard label="Compute Used" value="82%" change="of quota" icon={Cpu} accent="amber" trend="flat" />
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {integrations.map((i) => (
          <div key={i.name} className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{i.category}</p>
            <h3 className="mt-2 font-serif text-lg font-semibold">{i.name}</h3>
            <div className="mt-4 flex items-center justify-between">
              <span className={`text-xs font-semibold ${i.status === "Connected" ? "text-emerald-600" : "text-muted-foreground"}`}>{i.status === "Connected" ? "● Connected" : "○ Not connected"}</span>
              <button className="rounded-full border border-border px-3 py-1 text-xs font-medium hover:bg-muted">{i.status === "Connected" ? "Manage" : "Connect"}</button>
            </div>
          </div>
        ))}
      </div>
    </>
  ),
});