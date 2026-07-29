import { createFileRoute } from "@tanstack/react-router";
import { MessageSquare, Mail, Send, Phone, Plus } from "lucide-react";
import { PageHeader, ChartCard } from "@/components/admin/chart-card";
import { StatCard } from "@/components/admin/stat-card";

const campaigns = [
  { name: "Ekadashi Reminder", channel: "WhatsApp", sent: 42010, opened: "78%", status: "Sent" },
  { name: "Diwali Seva Drive", channel: "Email", sent: 18200, opened: "42%", status: "Sent" },
  { name: "Volunteer Callout", channel: "SMS", sent: 6400, opened: "91%", status: "Scheduled" },
  { name: "Donor Thank You", channel: "Email", sent: 12040, opened: "64%", status: "Draft" },
];

export const Route = createFileRoute("/admin/communication")({
  head: () => ({ meta: [{ title: "Communication — Sansthan Console" }] }),
  component: () => (
    <>
      <PageHeader eyebrow="Outreach" title="Communication Studio" subtitle="Broadcast to devotees over WhatsApp, SMS, Email and Push — with templates and analytics." actions={<button className="inline-flex items-center gap-2 rounded-full bg-foreground px-4 py-2 text-xs font-semibold text-background"><Plus className="h-3.5 w-3.5" /> New campaign</button>} />
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Messages Sent MTD" value="4.2L" change="+31%" icon={Send} accent="amber" />
        <StatCard label="WhatsApp" value="72%" change="channel share" icon={MessageSquare} accent="emerald" trend="flat" />
        <StatCard label="Email Open Rate" value="48%" change="+6%" icon={Mail} accent="sky" />
        <StatCard label="Voice Calls" value="1,240" icon={Phone} accent="amber" trend="flat" />
      </div>
      <div className="mt-6">
        <ChartCard title="Recent campaigns">
          <div className="divide-y divide-border">
            {campaigns.map((c) => (
              <div key={c.name} className="flex items-center justify-between gap-4 py-3">
                <div>
                  <p className="font-semibold text-foreground">{c.name}</p>
                  <p className="text-xs text-muted-foreground">{c.channel} · {c.sent.toLocaleString()} sent · {c.opened} opened</p>
                </div>
                <span className="rounded-md border border-border bg-muted px-2 py-0.5 text-xs">{c.status}</span>
              </div>
            ))}
          </div>
        </ChartCard>
      </div>
    </>
  ),
});