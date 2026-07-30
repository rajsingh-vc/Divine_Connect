import { useMemo, useState } from "react";
import {
  X, Upload, Image as ImageIcon, Video as VideoIcon, Calendar,
  ArrowLeft, ShieldCheck, Plus, Trash2, Play, CheckSquare, Square, Loader2,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context"; // adjust path if needed
import { uploadGalleryItem, deleteGalleryItems, type GalleryItem, type MediaType } from "@/lib/gallery-data";

interface GalleryPanelProps {
  open: boolean;
  onClose: () => void;
  items: GalleryItem[];
  isLoading: boolean;
  error: string | null;
  addItem: (item: GalleryItem) => void;
  removeItems: (ids: string[]) => void;
}

export function GalleryPanel({
  open,
  onClose,
  items,
  isLoading,
  error,
  addItem,
  removeItems,
}: GalleryPanelProps) {
  const { user } = useAuth();
  const isAdmin = user?.user_type === "admin";

  const [selectedYear, setSelectedYear] = useState<number | "all">("all");
  const [activeItem, setActiveItem] = useState<GalleryItem | null>(null);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Delete mode — admin selects items in the grid to remove, without opening each one
  const [deleteMode, setDeleteMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);

  const [uploadDraft, setUploadDraft] = useState<{
    type: MediaType;
    title: string;
    description: string;
    year: number;
    file: File | null;
    previewUrl: string;
  }>({
    type: "image",
    title: "",
    description: "",
    year: new Date().getFullYear(),
    file: null,
    previewUrl: "",
  });

  const years = useMemo(
    () => Array.from(new Set(items.map((i) => i.year))).sort((a, b) => b - a),
    [items]
  );

  const filteredItems = useMemo(
    () => (selectedYear === "all" ? items : items.filter((i) => i.year === selectedYear)),
    [items, selectedYear]
  );

  if (!open) return null;

  const handleFilePick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const previewUrl = URL.createObjectURL(file);
    const type: MediaType = file.type.startsWith("video") ? "video" : "image";
    setUploadDraft((d) => ({ ...d, file, previewUrl, type }));
  };

  const handleUploadSave = async () => {
    if (!uploadDraft.file || !uploadDraft.title.trim()) return;
    setIsSaving(true);
    try {
      const newItem = await uploadGalleryItem({
        file: uploadDraft.file,
        title: uploadDraft.title.trim(),
        description: uploadDraft.description.trim(),
        year: uploadDraft.year,
      });
      addItem(newItem);
      setUploadOpen(false);
      setUploadDraft({
        type: "image",
        title: "",
        description: "",
        year: new Date().getFullYear(),
        file: null,
        previewUrl: "",
      });
    } catch {
      alert("Upload failed. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    if (!confirm(`Remove ${selectedIds.length} item(s) from the gallery? This can't be undone.`)) return;
    setIsDeleting(true);
    try {
      await deleteGalleryItems(selectedIds);
      removeItems(selectedIds);
      setSelectedIds([]);
      setDeleteMode(false);
    } catch {
      alert("Delete failed. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSingleDelete = async (id: string) => {
    if (!confirm("Remove this item from the gallery? This can't be undone.")) return;
    setIsDeleting(true);
    try {
      await deleteGalleryItems([id]);
      removeItems([id]);
      if (activeItem?.id === id) setActiveItem(null);
    } catch {
      alert("Delete failed. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-40 grid place-items-center bg-black/40 p-4">
      <div className="max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-2xl bg-[#faf6ee] p-6 shadow-xl sm:p-8">
        {/* ---------------- Grid view ---------------- */}
        {!activeItem && (
          <>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-600">Content · Gallery</p>
                <h1 className="mt-1 font-serif text-3xl font-semibold text-foreground">Gallery</h1>
                <p className="mt-1 max-w-xl text-sm text-muted-foreground">
                  Photos from past celebrations, organized by year.
                </p>
              </div>
              <div className="flex items-center gap-2">
                {isAdmin && !deleteMode && (
                  <>
                    <button
                      onClick={() => setUploadOpen(true)}
                      className="inline-flex items-center gap-1.5 rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background hover:opacity-90"
                    >
                      <Upload className="h-3.5 w-3.5" />
                      Upload
                    </button>
                    <button
                      onClick={() => setDeleteMode(true)}
                      className="inline-flex items-center gap-1.5 rounded-full border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-100"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Delete
                    </button>
                  </>
                )}
                {isAdmin && deleteMode && (
                  <>
                    <span className="text-xs text-muted-foreground">{selectedIds.length} selected</span>
                    <button
                      onClick={handleBulkDelete}
                      disabled={selectedIds.length === 0 || isDeleting}
                      className="inline-flex items-center gap-1.5 rounded-full bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      {isDeleting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
                      Remove selected
                    </button>
                    <button
                      onClick={() => {
                        setDeleteMode(false);
                        setSelectedIds([]);
                      }}
                      className="rounded-full border border-border px-4 py-2 text-sm font-medium hover:bg-muted/60"
                    >
                      Cancel
                    </button>
                  </>
                )}
                <button onClick={onClose} className="rounded-full p-2 hover:bg-muted/60" aria-label="Close">
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="mt-6 border-b border-border" />

            {/* Year filter */}
            <div className="mt-6 flex flex-wrap items-center gap-2">
              <div className="mr-1 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <Calendar className="h-3.5 w-3.5" />
                Year
              </div>
              <button
                onClick={() => setSelectedYear("all")}
                className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${
                  selectedYear === "all" ? "bg-foreground text-background" : "border border-border hover:bg-muted/60"
                }`}
              >
                All
              </button>
              {years.map((y) => (
                <button
                  key={y}
                  onClick={() => setSelectedYear(y)}
                  className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${
                    selectedYear === y ? "bg-foreground text-background" : "border border-border hover:bg-muted/60"
                  }`}
                >
                  {y}
                </button>
              ))}
            </div>

            {!isAdmin && (
              <div className="mt-4 flex w-fit items-center gap-1.5 rounded-full bg-muted/60 px-3 py-1.5 text-xs text-muted-foreground">
                <ShieldCheck className="h-3.5 w-3.5" />
                View only
              </div>
            )}

            {/* Loading / error */}
            {isLoading && (
              <div className="mt-10 flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading gallery…
              </div>
            )}
            {error && !isLoading && (
              <div className="mt-10 rounded-2xl border border-red-200 bg-red-50 p-6 text-center text-sm text-red-600">
                {error}
              </div>
            )}

            {/* Media grid */}
            {!isLoading && !error && (
              <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                {filteredItems.map((item) => {
                  const selected = selectedIds.includes(item.id);
                  return (
                    <button
                      key={item.id}
                      onClick={() => (deleteMode ? toggleSelect(item.id) : setActiveItem(item))}
                      className={`group relative aspect-square overflow-hidden rounded-2xl border bg-white shadow-sm ${
                        selected ? "border-red-400 ring-2 ring-red-200" : "border-border"
                      }`}
                    >
                      <img
                        src={item.type === "video" ? item.thumbnail ?? item.url : item.url}
                        alt={item.title}
                        className="h-full w-full object-cover transition group-hover:scale-105"
                      />
                      {item.type === "video" && !deleteMode && (
                        <div className="absolute inset-0 grid place-items-center bg-black/20">
                          <div className="grid h-9 w-9 place-items-center rounded-full bg-white/90">
                            <Play className="h-4 w-4 text-foreground" />
                          </div>
                        </div>
                      )}
                      {deleteMode && (
                        <div className="absolute right-2 top-2 rounded-full bg-white/90 p-1">
                          {selected ? (
                            <CheckSquare className="h-4 w-4 text-red-600" />
                          ) : (
                            <Square className="h-4 w-4 text-foreground" />
                          )}
                        </div>
                      )}
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-2.5 text-left">
                        <p className="line-clamp-1 text-xs font-medium text-white">{item.title}</p>
                        <p className="text-[10px] text-white/70">{item.year}</p>
                      </div>
                    </button>
                  );
                })}

                {filteredItems.length === 0 && (
                  <div className="col-span-full rounded-2xl border border-dashed border-border bg-white p-10 text-center text-sm text-muted-foreground">
                    No media for this year yet.
                  </div>
                )}
              </div>
            )}
          </>
        )}

        {/* ---------------- Explore (detail) view ---------------- */}
        {activeItem && (
          <>
            <div className="flex items-center justify-between">
              <button
                onClick={() => setActiveItem(null)}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to gallery
              </button>
              <button onClick={onClose} className="rounded-full p-2 hover:bg-muted/60" aria-label="Close">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[1.4fr_1fr]">
              <div className="overflow-hidden rounded-2xl border border-border bg-black shadow-sm">
                {activeItem.type === "image" ? (
                  <img src={activeItem.url} alt={activeItem.title} className="max-h-[65vh] w-full object-contain" />
                ) : (
                  <video src={activeItem.url} controls className="max-h-[65vh] w-full" />
                )}
              </div>

              <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-600">
                  {activeItem.type === "image" ? <ImageIcon className="h-3.5 w-3.5" /> : <VideoIcon className="h-3.5 w-3.5" />}
                  {activeItem.type} · {activeItem.year}
                </div>
                <h2 className="mt-2 font-serif text-xl font-semibold text-foreground">{activeItem.title}</h2>
                <p className="mt-3 text-sm leading-relaxed text-foreground/80">{activeItem.description}</p>

                {(activeItem.uploadedBy || activeItem.uploadedAt) && (
                  <p className="mt-4 border-t border-border pt-4 text-xs text-muted-foreground">
                    Uploaded by {activeItem.uploadedBy} on {activeItem.uploadedAt}
                  </p>
                )}

                {isAdmin ? (
                  <button
                    onClick={() => handleSingleDelete(activeItem.id)}
                    disabled={isDeleting}
                    className="mt-6 inline-flex items-center gap-1.5 rounded-full border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-100 disabled:opacity-50"
                  >
                    {isDeleting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
                    Remove from gallery
                  </button>
                ) : (
                  <div className="mt-6 flex w-fit items-center gap-1.5 rounded-full bg-muted/60 px-3 py-1.5 text-xs text-muted-foreground">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    View only
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>

      {/* ---------------- Upload modal — admin only ---------------- */}
      {isAdmin && uploadOpen && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-xl font-semibold text-foreground">Upload to Gallery</h2>
              <button onClick={() => setUploadOpen(false)} className="rounded-full p-1.5 hover:bg-muted/60">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-5">
              <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-border p-8 text-center hover:bg-muted/40">
                {uploadDraft.previewUrl ? (
                  uploadDraft.type === "image" ? (
                    <img src={uploadDraft.previewUrl} alt="" className="max-h-40 rounded-lg object-contain" />
                  ) : (
                    <video src={uploadDraft.previewUrl} className="max-h-40 rounded-lg" controls />
                  )
                ) : (
                  <>
                    <Plus className="h-6 w-6 text-amber-500" />
                    <p className="text-sm font-medium text-foreground">Choose a photo or video</p>
                    <p className="text-xs text-muted-foreground">JPG, PNG, or MP4</p>
                  </>
                )}
                <input type="file" accept="image/*,video/*" className="hidden" onChange={handleFilePick} />
              </label>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Title</label>
                <input
                  value={uploadDraft.title}
                  onChange={(e) => setUploadDraft((d) => ({ ...d, title: e.target.value }))}
                  className="mt-1.5 w-full rounded-xl border border-border px-3 py-2 text-sm focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-100"
                  placeholder="e.g. Ganeshotsav 2026 — Main Idol"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Description</label>
                <textarea
                  value={uploadDraft.description}
                  onChange={(e) => setUploadDraft((d) => ({ ...d, description: e.target.value }))}
                  rows={3}
                  className="mt-1.5 w-full rounded-xl border border-border px-3 py-2 text-sm focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-100"
                  placeholder="Describe what's happening in this photo or video"
                />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Year</label>
                <input
                  type="number"
                  value={uploadDraft.year}
                  onChange={(e) => setUploadDraft((d) => ({ ...d, year: Number(e.target.value) }))}
                  className="mt-1.5 w-full rounded-xl border border-border px-3 py-2 text-sm focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-100"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={() => setUploadOpen(false)}
                className="rounded-full border border-border px-4 py-2 text-sm font-medium hover:bg-muted/60"
              >
                Cancel
              </button>
              <button
                onClick={handleUploadSave}
                disabled={!uploadDraft.file || !uploadDraft.title.trim() || isSaving}
                className="inline-flex items-center gap-1.5 rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {isSaving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />}
                Save to gallery
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}