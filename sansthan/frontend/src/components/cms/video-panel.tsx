import { useEffect, useMemo, useState } from "react";
import { X, Youtube, Upload, Trash2, Play, ShieldCheck } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import type { VideoItem } from "@/api/video";

function extractYouTubeId(url: string): string | null {
  const patterns = [
    /youtube\.com\/watch\?v=([\w-]{11})/,
    /youtu\.be\/([\w-]{11})/,
    /youtube\.com\/embed\/([\w-]{11})/,
    /youtube\.com\/shorts\/([\w-]{11})/,
  ];
  for (const p of patterns) {
    const m = url.match(p);
    if (m) return m[1];
  }
  return null;
}

interface VideoPanelProps {
  open: boolean;
  onClose: () => void;
  items: VideoItem[];
  isLoading: boolean;
  error: Error | null;
  addItem: (payload: {
    source_type: "youtube" | "upload";
    title: string;
    description?: string;
    youtube_url?: string;
    file?: File;
  }) => Promise<VideoItem>;
  removeItems: (ids: number[]) => Promise<void>;
}

export function VideoPanel({ open, onClose, items, isLoading, error, addItem, removeItems }: VideoPanelProps) {
  const { user } = useAuth();
  const isAdmin = user?.user_type === "admin";

  const [mode, setMode] = useState<"youtube" | "upload">("youtube");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [selected, setSelected] = useState<number[]>([]);
  const [playingId, setPlayingId] = useState<number | null>(null);

  const youtubeId = useMemo(() => (youtubeUrl ? extractYouTubeId(youtubeUrl) : null), [youtubeUrl]);

  // Auto-fill title from YouTube's public oEmbed endpoint (no API key needed).
  useEffect(() => {
    if (!youtubeId || title.trim()) return;
    const controller = new AbortController();
    fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${youtubeId}&format=json`, {
      signal: controller.signal,
    })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => data?.title && setTitle(data.title))
      .catch(() => {});
    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [youtubeId]);

  if (!open) return null;

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setYoutubeUrl("");
    setFile(null);
  };

  const handleSubmit = async () => {
    if (!isAdmin) return;
    if (!title.trim()) return;
    if (mode === "youtube" && !youtubeId) return;
    if (mode === "upload" && !file) return;

    setSubmitting(true);
    try {
      await addItem({
        source_type: mode,
        title: title.trim(),
        description: description.trim(),
        youtube_url: mode === "youtube" ? youtubeUrl.trim() : undefined,
        file: mode === "upload" ? file ?? undefined : undefined,
      });
      resetForm();
    } finally {
      setSubmitting(false);
    }
  };

  const toggleSelected = (id: number) =>
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  const handleDeleteSelected = async () => {
    if (!isAdmin) return;
    if (selected.length === 0) return;
    await removeItems(selected);
    setSelected([]);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/30">
      <div className="h-full w-full max-w-2xl overflow-y-auto bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <h2 className="font-serif text-xl font-semibold text-foreground">Videos</h2>
          <button onClick={onClose} className="rounded-full p-1.5 hover:bg-muted/60">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* ---------------- Add form — admin only ---------------- */}
        {isAdmin ? (
          <div className="border-b border-border px-6 py-5">
            <div className="inline-flex rounded-full border border-border p-1">
              <button
                onClick={() => setMode("youtube")}
                className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium ${
                  mode === "youtube" ? "bg-foreground text-background" : "text-muted-foreground"
                }`}
              >
                <Youtube className="h-4 w-4" /> YouTube link
              </button>
              <button
                onClick={() => setMode("upload")}
                className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium ${
                  mode === "upload" ? "bg-foreground text-background" : "text-muted-foreground"
                }`}
              >
                <Upload className="h-4 w-4" /> Upload file
              </button>
            </div>

            <div className="mt-4 space-y-3">
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Video title"
                className="w-full rounded-lg border border-border px-3 py-2 text-sm"
              />
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Description (optional)"
                rows={2}
                className="w-full rounded-lg border border-border px-3 py-2 text-sm"
              />

              {mode === "youtube" ? (
                <>
                  <input
                    value={youtubeUrl}
                    onChange={(e) => setYoutubeUrl(e.target.value)}
                    placeholder="https://www.youtube.com/watch?v=..."
                    className="w-full rounded-lg border border-border px-3 py-2 text-sm"
                  />
                  {youtubeUrl && !youtubeId && (
                    <p className="text-xs text-red-500">Couldn't recognize that as a YouTube link.</p>
                  )}
                  {youtubeId && (
                    <div className="aspect-video w-full overflow-hidden rounded-lg border border-border">
                      <iframe
                        className="h-full w-full"
                        src={`https://www.youtube.com/embed/${youtubeId}`}
                        title="YouTube preview"
                        allowFullScreen
                      />
                    </div>
                  )}
                </>
              ) : (
                <input
                  type="file"
                  accept="video/*"
                  onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                  className="w-full text-sm"
                />
              )}

              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="w-full rounded-full bg-foreground py-2 text-sm font-medium text-background hover:opacity-90 disabled:opacity-50"
              >
                {submitting ? "Adding…" : "Add Video"}
              </button>
            </div>
          </div>
        ) : (
          <div className="border-b border-border px-6 py-5">
            <div className="flex w-fit items-center gap-1.5 rounded-full bg-muted/60 px-3 py-1.5 text-xs text-muted-foreground">
              <ShieldCheck className="h-3.5 w-3.5" />
              View only
            </div>
          </div>
        )}

        <div className="px-6 py-5">
          {isAdmin && selected.length > 0 && (
            <button
              onClick={handleDeleteSelected}
              className="mb-4 flex items-center gap-1.5 rounded-full border border-red-200 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" /> Delete {selected.length} selected
            </button>
          )}

          {isLoading && <p className="text-sm text-muted-foreground">Loading videos…</p>}
          {error && <p className="text-sm text-red-500">Failed to load videos.</p>}

          <div className="grid grid-cols-2 gap-4">
            {items.map((v) => (
              <div key={v.id} className="overflow-hidden rounded-xl border border-border">
                <div className="relative aspect-video bg-black">
                  {playingId === v.id ? (
                    v.source_type === "youtube" && v.embedUrl ? (
                      <iframe className="h-full w-full" src={`${v.embedUrl}?autoplay=1`} title={v.title} allowFullScreen />
                    ) : (
                      <video className="h-full w-full" src={v.fileUrl ?? undefined} controls autoPlay />
                    )
                  ) : (
                    <button onClick={() => setPlayingId(v.id)} className="group relative h-full w-full">
                      {v.thumbnailUrl ? (
                        <img src={v.thumbnailUrl} alt={v.title} className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-muted text-xs text-muted-foreground">
                          No preview
                        </div>
                      )}
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition group-hover:opacity-100">
                        <Play className="h-8 w-8 text-white" />
                      </div>
                    </button>
                  )}
                </div>
                <div className="flex items-start justify-between gap-2 p-3">
                  <div>
                    <p className="text-sm font-medium text-foreground">{v.title}</p>
                    <p className="text-xs capitalize text-muted-foreground">{v.source_type}</p>
                  </div>
                  {isAdmin && (
                    <input
                      type="checkbox"
                      checked={selected.includes(v.id)}
                      onChange={() => toggleSelected(v.id)}
                      className="mt-1"
                    />
                  )}
                </div>
              </div>
            ))}
          </div>

          {!isLoading && items.length === 0 && <p className="text-sm text-muted-foreground">No videos yet.</p>}
        </div>
      </div>
    </div>
  );
}