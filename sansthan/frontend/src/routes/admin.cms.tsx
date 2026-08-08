import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Image, FileText, Newspaper, Video, HelpCircle, Search, Bell,
} from "lucide-react";
import { AnnouncementComposer } from "@/components/cms/announcement-composer";
import { TempleInfoPanel } from "@/components/cms/temple-info";
import { GalleryPanel } from "@/components/cms/gallery-panel";
import { FAQPanel } from "@/components/cms/faq-panel";
import { NewsPanel } from "@/components/cms/news-panel";
import { VideoPanel } from "@/components/cms/video-panel";
import { useGalleryItems } from "@/hooks/use-gallery-items";
import { useFaqItems } from "@/hooks/use-faq-items";
import { useNewsPosts } from "@/hooks/use-news-posts";
import { useVideoItems } from "@/hooks/use-video-items";
import { getAnnouncements } from "@/api/announcements"; // ← import the same API

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
  const [templeInfoOpen, setTempleInfoOpen] = useState(false);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [faqOpen, setFaqOpen] = useState(false);
  const [newsOpen, setNewsOpen] = useState(false);
  const [videosOpen, setVideosOpen] = useState(false);

  const {
    items: galleryItems,
    isLoading: galleryLoading,
    error: galleryError,
    addItem: addGalleryItem,
    removeItems: removeGalleryItems,
  } = useGalleryItems();

  const {
    items: faqItems,
    isLoading: faqLoading,
    error: faqError,
    addItem: addFaqItem,
    updateItem: updateFaqItem,
    removeItems: removeFaqItems,
  } = useFaqItems();

  const {
    items: newsItems,
    isLoading: newsLoading,
    error: newsError,
    addItem: addNewsItem,
    updateItem: updateNewsItem,
    removeItems: removeNewsItems,
  } = useNewsPosts();

  const {
    items: videoItems,
    isLoading: videoLoading,
    error: videoError,
    addItem: addVideoItem,
    removeItems: removeVideoItems,
  } = useVideoItems();

  // 🔔 Dynamic notification count – shares cache with AnnouncementComposer
  const { data: announcements } = useQuery({
    queryKey: ["announcements"],
    queryFn: getAnnouncements,
    // optional: staleTime to avoid refetching too often
    staleTime: 60_000,
  });

  const stats = [
    { label: "Hero Banner", value: 3, icon: Image },
    { label: "Temple Info", value: 1, icon: FileText },
    { label: "News & Blogs", value: newsItems.length, icon: Newspaper },
    { label: "Gallery", value: galleryItems.length, icon: Image },
  ];

  const modules: Module[] = [
    { key: "hero", label: "Hero Banner", count: 3, icon: Image, onManage: () => {} },
    {
      key: "temple-info",
      label: "Temple Info",
      count: 1,
      icon: FileText,
      onManage: () => setTempleInfoOpen(true),
    },
    {
      key: "news",
      label: "News & Blogs",
      count: newsItems.length,
      icon: Newspaper,
      onManage: () => setNewsOpen(true),
    },
    {
      key: "gallery",
      label: "Gallery",
      count: galleryItems.length,
      icon: Image,
      onManage: () => setGalleryOpen(true),
    },
    {
      key: "videos",
      label: "Videos",
      count: videoItems.length,
      icon: Video,
      onManage: () => setVideosOpen(true),
    },
    {
      key: "faqs",
      label: "FAQs",
      count: faqItems.length,
      icon: HelpCircle,
      onManage: () => setFaqOpen(true),
    },
    { key: "seo", label: "SEO", count: 16, icon: Search, onManage: () => {} },
    // ✅ Now dynamic – uses the actual announcement count
    {
      key: "notifications",
      label: "Notification",
      count: announcements?.length ?? 0,
      icon: Bell,
      onManage: () => setComposerOpen(true),
    },
  ];

  return (
    <div className="min-h-screen bg-[#faf6ee] px-8 py-8">
      {/* Header */}
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-600">Content</p>
      <h1 className="mt-1 font-serif text-4xl font-semibold text-foreground">Content Management System</h1>
      <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
        Manage everything a devotee sees — home, media, news, gallery, SEO, notification.
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

      {/* News tab */}
      {tab === "news" && (
        <div className="mt-6 rounded-2xl border border-border bg-white p-8 text-center text-sm text-muted-foreground">
          <p>{newsItems.length} post{newsItems.length === 1 ? "" : "s"} in News & Blogs.</p>
          <button
            onClick={() => setNewsOpen(true)}
            className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background hover:opacity-90"
          >
            Manage News & Blogs
          </button>
        </div>
      )}

      {tab === "seo" && (
        <div className="mt-6 rounded-2xl border border-border bg-white p-8 text-center text-sm text-muted-foreground">
          SEO settings coming here.
        </div>
      )}

      <AnnouncementComposer open={composerOpen} onClose={() => setComposerOpen(false)} />
      <TempleInfoPanel open={templeInfoOpen} onClose={() => setTempleInfoOpen(false)} />
      <GalleryPanel
        open={galleryOpen}
        onClose={() => setGalleryOpen(false)}
        items={galleryItems}
        isLoading={galleryLoading}
        error={galleryError}
        addItem={addGalleryItem}
        removeItems={removeGalleryItems}
      />
      <FAQPanel
        open={faqOpen}
        onClose={() => setFaqOpen(false)}
        items={faqItems}
        isLoading={faqLoading}
        error={faqError}
        addItem={addFaqItem}
        updateItem={updateFaqItem}
        removeItems={removeFaqItems}
      />
      <NewsPanel
        open={newsOpen}
        onClose={() => setNewsOpen(false)}
        items={newsItems}
        isLoading={newsLoading}
        error={newsError}
        addItem={addNewsItem}
        updateItem={updateNewsItem}
        removeItems={removeNewsItems}
      />
      <VideoPanel
        open={videosOpen}
        onClose={() => setVideosOpen(false)}
        items={videoItems}
        isLoading={videoLoading}
        error={videoError}
        addItem={addVideoItem}
        removeItems={removeVideoItems}
      />
    </div>
  );
}