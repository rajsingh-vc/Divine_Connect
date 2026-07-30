import { useMemo, useState } from "react";
import {
  X, Plus, ArrowLeft, ShieldCheck, Trash2, Loader2, Newspaper,
  CheckSquare, Square, Pencil, Send, FileText,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context"; // adjust path if needed
import {
  createNewsPost,
  updateNewsPost,
  deleteNewsPosts,
  type NewsPost,
  type NewsStatus,
} from "@/lib/news-data";

interface NewsPanelProps {
  open: boolean;
  onClose: () => void;
  items: NewsPost[];
  isLoading: boolean;
  error: string | null;
  addItem: (item: NewsPost) => void;
  updateItem: (item: NewsPost) => void;
  removeItems: (ids: string[]) => void;
}

const emptyDraft = {
  title: "",
  excerpt: "",
  content: "",
  status: "draft" as NewsStatus,
  photo: null as File | null,
  previewUrl: "",
};

export function NewsPanel({
  open,
  onClose,
  items,
  isLoading,
  error,
  addItem,
  updateItem,
  removeItems,
}: NewsPanelProps) {
  const { user } = useAuth();
  const isAdmin = user?.user_type === "admin";

  const [statusFilter, setStatusFilter] = useState<"all" | NewsStatus>("all");
  const [activeItem, setActiveItem] = useState<NewsPost | null>(null);
  const [composerOpen, setComposerOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const [deleteMode, setDeleteMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);

  const [draft, setDraft] = useState(emptyDraft);

  const filteredItems = useMemo(
    () => (statusFilter === "all" ? items : items.filter((i) => i.status === statusFilter)),
    [items, statusFilter]
  );

  if (!open) return null;

  const openComposerForCreate = () => {
    setEditingId(null);
    setDraft(emptyDraft);
    setComposerOpen(true);
  };

  const openComposerForEdit = (item: NewsPost) => {
    setEditingId(item.id);
    setDraft({
      title: item.title,
      excerpt: item.excerpt,
      content: item.content,
      status: item.status,
      photo: null,
      previewUrl: item.photoUrl ?? "",
    });
    setComposerOpen(true);
  };

  const handleFilePick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setDraft((d) => ({ ...d, photo: file, previewUrl: URL.createObjectURL(file) }));
  };

  const handleSave = async (statusOverride?: NewsStatus) => {
    if (!draft.title.trim() || !draft.content.trim()) return;
    setIsSaving(true);
    const payload = {
      title: draft.title.trim(),
      excerpt: draft.excerpt.trim(),
      content: draft.content.trim(),
      status: statusOverride ?? draft.status,
      photo: draft.photo,
    };
    try {
      if (editingId) {
        const updated = await updateNewsPost(editingId, payload);
        updateItem(updated);
        if (activeItem?.id === editingId) setActiveItem(updated);
      } else {
        const created = await createNewsPost(payload);
        addItem(created);
      }
      setComposerOpen(false);
      setDraft(emptyDraft);
      setEditingId(null);
    } catch {
      alert("Save failed. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    if (!confirm(`Delete ${selectedIds.length} post(s)? This can't be undone.`)) return;
    setIsDeleting(true);
    try {
      await deleteNewsPosts(selectedIds);
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
    if (!confirm("Delete this post? This can't be undone.")) return;
    setIsDeleting(true);
    try {
      await deleteNewsPosts([id]);
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
        {/* ---------------- List view ---------------- */}
        {!activeItem && (
          <>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-600">Content · News & Blogs</p>
                <h1 className="mt-1 font-serif text-3xl font-semibold text-foreground">News & Blogs</h1>
                <p className="mt-1 max-w-xl text-sm text-muted-foreground">
                  Announcements, updates, and stories published to devotees.
                </p>
              </div>
              <div className="flex items-center gap-2">
                {isAdmin && !deleteMode && (
                  <>
                    <button
                      onClick={openComposerForCreate}
                      className="inline-flex items-center gap-1.5 rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background hover:opacity-90"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      New post
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
                      Delete selected
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

            {/* Status filter — admins only, since non-admins only ever see published posts anyway */}
            {isAdmin && (
              <div className="mt-6 flex flex-wrap items-center gap-2">
                <div className="mr-1 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  <FileText className="h-3.5 w-3.5" />
                  Status
                </div>
                {(["all", "published", "draft"] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => setStatusFilter(s)}
                    className={`rounded-full px-3 py-1.5 text-sm font-medium capitalize transition ${
                      statusFilter === s ? "bg-foreground text-background" : "border border-border hover:bg-muted/60"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            {!isAdmin && (
              <div className="mt-4 flex w-fit items-center gap-1.5 rounded-full bg-muted/60 px-3 py-1.5 text-xs text-muted-foreground">
                <ShieldCheck className="h-3.5 w-3.5" />
                View only
              </div>
            )}

            {isLoading && (
              <div className="mt-10 flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading posts…
              </div>
            )}
            {error && !isLoading && (
              <div className="mt-10 rounded-2xl border border-red-200 bg-red-50 p-6 text-center text-sm text-red-600">
                {error}
              </div>
            )}

            {!isLoading && !error && (
              <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filteredItems.map((item) => {
                  const selected = selectedIds.includes(item.id);
                  return (
                    <button
                      key={item.id}
                      onClick={() => (deleteMode ? toggleSelect(item.id) : setActiveItem(item))}
                      className={`group relative flex flex-col overflow-hidden rounded-2xl border bg-white text-left shadow-sm ${
                        selected ? "border-red-400 ring-2 ring-red-200" : "border-border"
                      }`}
                    >
                      <div className="aspect-[16/9] w-full overflow-hidden bg-muted/60">
                        {item.photoUrl ? (
                          <img
                            src={item.photoUrl}
                            alt={item.title}
                            className="h-full w-full object-cover transition group-hover:scale-105"
                          />
                        ) : (
                          <div className="grid h-full w-full place-items-center">
                            <Newspaper className="h-6 w-6 text-muted-foreground" />
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
                        {isAdmin && (
                          <span
                            className={`absolute left-2 top-2 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                              item.status === "published"
                                ? "bg-emerald-100 text-emerald-700"
                                : "bg-amber-100 text-amber-700"
                            }`}
                          >
                            {item.status}
                          </span>
                        )}
                      </div>
                      <div className="p-4">
                        <p className="line-clamp-1 font-serif text-base font-semibold text-foreground">{item.title}</p>
                        <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{item.excerpt}</p>
                      </div>
                    </button>
                  );
                })}

                {filteredItems.length === 0 && (
                  <div className="col-span-full rounded-2xl border border-dashed border-border bg-white p-10 text-center text-sm text-muted-foreground">
                    No posts here yet.
                  </div>
                )}
              </div>
            )}
          </>
        )}

        {/* ---------------- Detail view ---------------- */}
        {activeItem && (
          <>
            <div className="flex items-center justify-between">
              <button
                onClick={() => setActiveItem(null)}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to news
              </button>
              <button onClick={onClose} className="rounded-full p-2 hover:bg-muted/60" aria-label="Close">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[1.4fr_1fr]">
              <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
                {activeItem.photoUrl && (
                  <img src={activeItem.photoUrl} alt={activeItem.title} className="max-h-[45vh] w-full object-cover" />
                )}
                <div className="p-6">
                  <h2 className="font-serif text-2xl font-semibold text-foreground">{activeItem.title}</h2>
                  <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-foreground/80">
                    {activeItem.content}
                  </p>
                </div>
              </div>

              <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-600">
                  <Newspaper className="h-3.5 w-3.5" />
                  {activeItem.status}
                </div>
                {(activeItem.author || activeItem.createdAt) && (
                  <p className="mt-3 text-xs text-muted-foreground">
                    By {activeItem.author ?? "Unknown"} on {activeItem.createdAt}
                  </p>
                )}

                {isAdmin ? (
                  <div className="mt-6 flex flex-col gap-2">
                    <button
                      onClick={() => openComposerForEdit(activeItem)}
                      className="inline-flex items-center justify-center gap-1.5 rounded-full border border-border px-4 py-2 text-sm font-medium hover:bg-muted/60"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleSingleDelete(activeItem.id)}
                      disabled={isDeleting}
                      className="inline-flex items-center justify-center gap-1.5 rounded-full border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-100 disabled:opacity-50"
                    >
                      {isDeleting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
                      Delete post
                    </button>
                  </div>
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

      {/* ---------------- Composer modal — admin only ---------------- */}
      {isAdmin && composerOpen && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-xl font-semibold text-foreground">
                {editingId ? "Edit Post" : "New Post"}
              </h2>
              <button onClick={() => setComposerOpen(false)} className="rounded-full p-1.5 hover:bg-muted/60">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-5">
              <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-border p-6 text-center hover:bg-muted/40">
                {draft.previewUrl ? (
                  <img src={draft.previewUrl} alt="" className="max-h-40 rounded-lg object-contain" />
                ) : (
                  <>
                    <Plus className="h-6 w-6 text-amber-500" />
                    <p className="text-sm font-medium text-foreground">Choose a cover photo (optional)</p>
                    <p className="text-xs text-muted-foreground">JPG or PNG</p>
                  </>
                )}
                <input type="file" accept="image/*" className="hidden" onChange={handleFilePick} />
              </label>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-4">
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Title</label>
                <input
                  value={draft.title}
                  onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))}
                  className="mt-1.5 w-full rounded-xl border border-border px-3 py-2 text-sm focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-100"
                  placeholder="e.g. Ganeshotsav 2026 dates announced"
                />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Excerpt</label>
                <input
                  value={draft.excerpt}
                  onChange={(e) => setDraft((d) => ({ ...d, excerpt: e.target.value }))}
                  className="mt-1.5 w-full rounded-xl border border-border px-3 py-2 text-sm focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-100"
                  placeholder="Short one-line summary shown in listings"
                />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Content</label>
                <textarea
                  value={draft.content}
                  onChange={(e) => setDraft((d) => ({ ...d, content: e.target.value }))}
                  rows={6}
                  className="mt-1.5 w-full rounded-xl border border-border px-3 py-2 text-sm focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-100"
                  placeholder="Full post content"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={() => setComposerOpen(false)}
                className="rounded-full border border-border px-4 py-2 text-sm font-medium hover:bg-muted/60"
              >
                Cancel
              </button>
              <button
                onClick={() => handleSave("draft")}
                disabled={!draft.title.trim() || !draft.content.trim() || isSaving}
                className="inline-flex items-center gap-1.5 rounded-full border border-border px-4 py-2 text-sm font-medium hover:bg-muted/60 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {isSaving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <FileText className="h-3.5 w-3.5" />}
                Save draft
              </button>
              <button
                onClick={() => handleSave("published")}
                disabled={!draft.title.trim() || !draft.content.trim() || isSaving}
                className="inline-flex items-center gap-1.5 rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {isSaving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
                Publish
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}