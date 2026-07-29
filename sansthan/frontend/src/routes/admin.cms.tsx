import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Image, FileText, Newspaper, Video, HelpCircle, Search, Bell,
} from "lucide-react";
import { AnnouncementComposer } from "@/components/cms/announcement-composer";

export const Route = createFileRoute("/admin/cms")({
  head: () => ({ meta: [{ title: "Content Management System — Sansthan Console" }] }),
  component: CmsDashboard,
});

type TabKey = "modules" | "news" | "seo";

interface Module {
  key: string;
  label: string;
  count: number;
  icon: React.ComponentType<{ className?: string }>;
  onManage: () => void;
}

function CmsDashboard() {
  const [tab, setTab] = useState<TabKey>("modules");
  const [composerOpen, setComposerOpen] = useState(false);

  const stats = [
    { label: "Hero Banner", value: 3, icon: Image },
    { label: "Temple Info", value: 12, icon: FileText },
    { label: "News & Blogs", value: 48, icon: Newspaper },
    { label: "Gallery", value: 1240, icon: Image },
  ];

  const modules: Module[] = [
    { key: "hero", label: "Hero Banner", count: 3, icon: Image, onManage: () => {} },
    { key: "temple-info", label: "Temple Info", count: 12, icon: FileText, onManage: () => {} },
    { key: "news", label: "News & Blogs", count: 48, icon: Newspaper, onManage: () => {} },
    { key: "gallery", label: "Gallery", count: 1240, icon: Image, onManage: () => {} },
    { key: "videos", label: "Videos", count: 82, icon: Video, onManage: () => {} },
    { key: "faqs", label: "FAQs", count: 24, icon: HelpCircle, onManage: () => {} },
    { key: "seo", label: "SEO", count: 16, icon: Search, onManage: () => {} },
    { key: "notifications", label: "Notification Templates", count: 22, icon: Bell, onManage: () => setComposerOpen(true) },
  ];

  return (
    <div className="min-h-screen bg-[#faf6ee] px-8 py-8">
      {/* Header */}
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-600">Content</p>
      <h1 className="mt-1 font-serif text-4xl font-semibold text-foreground">Content Management System</h1>
      <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
        Manage everything a devotee sees — home, media, news, gallery, SEO, notification templates.
      </p>
      <div className="mt-6 border-b border-border" />

      {/* Stat cards */}
      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl border border-border bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{s.label}</p>
              <div className="grid h-9 w-9 place-items-center rounded-full bg-amber-100">
                <s.icon className="h-4 w-4 text-amber-600" />
              </div>
            </div>
            <p className="mt-2 font-serif text-3xl font-semibold text-foreground">{s.value.toLocaleString()}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="mt-6 inline-flex rounded-full border border-border bg-white p-1">
        {(["modules", "news", "seo"] as TabKey[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium capitalize transition ${
              tab === t ? "bg-foreground text-background" : "text-muted-foreground hover:bg-muted/60"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Module grid */}
      {tab === "modules" && (
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {modules.map((m) => (
            <div key={m.key} className="rounded-2xl border border-border bg-white p-5 shadow-sm">
              <div className="grid h-11 w-11 place-items-center rounded-full bg-amber-100">
                <m.icon className="h-5 w-5 text-amber-600" />
              </div>
              <p className="mt-4 font-serif text-lg font-semibold text-foreground">{m.label}</p>
              <p className="text-xs text-muted-foreground">{m.count.toLocaleString()} items</p>
              <button
                onClick={m.onManage}
                className="mt-4 w-full rounded-full border border-border py-2 text-sm font-medium hover:bg-muted/60"
              >
                Manage
              </button>
            </div>
          ))}
        </div>
      )}

      {tab === "news" && (
        <div className="mt-6 rounded-2xl border border-border bg-white p-8 text-center text-sm text-muted-foreground">
          News & blogs management coming here.
        </div>
      )}

      {tab === "seo" && (
        <div className="mt-6 rounded-2xl border border-border bg-white p-8 text-center text-sm text-muted-foreground">
          SEO settings coming here.
        </div>
      )}

      <AnnouncementComposer open={composerOpen} onClose={() => setComposerOpen(false)} />
    </div>
  );
}