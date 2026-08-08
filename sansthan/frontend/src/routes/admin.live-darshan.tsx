import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Radio, Link as LinkIcon, Power } from "lucide-react";
import { PageHeader, ChartCard } from "@/components/admin/chart-card";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import {
  getLiveDarshanAdminList,
  createLiveDarshan,
  updateLiveDarshan,
  deleteLiveDarshan,
  type LiveDarshanAdmin,
  type LiveDarshanPayload,
} from "@/api/dashboard";

export const Route = createFileRoute("/admin/live-darshan")({
  head: () => ({
    meta: [
      { title: "Live Darshan Management — Sansthan Console" },
      { name: "description", content: "Manage the Live Ganpati Darshan stream shown on every dashboard." },
    ],
  }),
  component: LiveDarshanManagement,
});

function LiveDarshanManagement() {
  const queryClient = useQueryClient();
  const list = useQuery({ queryKey: ["liveDarshanAdmin"], queryFn: getLiveDarshanAdminList });

  const [addOpen, setAddOpen] = useState(false);
  const [editing, setEditing] = useState<LiveDarshanAdmin | null>(null);
  const [deleting, setDeleting] = useState<LiveDarshanAdmin | null>(null);
  const [deleteBusy, setDeleteBusy] = useState(false);
  const [togglingId, setTogglingId] = useState<number | null>(null);

  function invalidate() {
    queryClient.invalidateQueries({ queryKey: ["liveDarshanAdmin"] });
    // Refresh the banner/player everywhere so the change reflects immediately.
    queryClient.invalidateQueries({ queryKey: ["liveDarshanStatus"] });
  }

  async function handleDelete() {
    if (!deleting) return;
    setDeleteBusy(true);
    try {
      await deleteLiveDarshan(deleting.id);
      toast.success(`${deleting.title} was removed.`);
      setDeleting(null);
      invalidate();
    } catch {
      toast.error("Could not delete this entry.");
    } finally {
      setDeleteBusy(false);
    }
  }

  async function handleToggle(d: LiveDarshanAdmin) {
    setTogglingId(d.id);
    try {
      await updateLiveDarshan(d.id, { title: d.title, live_url: d.liveUrl, is_live: !d.isLive });
      toast.success(d.isLive ? `${d.title} deactivated.` : `${d.title} is now live.`);
      invalidate();
    } catch {
      toast.error("Could not update status.");
    } finally {
      setTogglingId(null);
    }
  }

  return (
    <>
      <PageHeader
        eyebrow="Live Darshan"
        title="Live Darshan Management"
        subtitle="Control the Live Ganpati Darshan banner shown on Admin, Volunteer and Devotee dashboards."
        actions={
          <button
            onClick={() => setAddOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-full bg-foreground px-4 py-2 text-xs font-semibold text-background"
          >
            <Plus className="h-3.5 w-3.5" /> Add Live Darshan
          </button>
        }
      />

      <div className="mt-6">
        <ChartCard title="Live Darshan entries">
          <div className="space-y-3">
            {list.isLoading && (
              <p className="py-6 text-center text-sm text-muted-foreground">Loading entries...</p>
            )}
            {list.isError && (
              <p className="py-6 text-center text-sm text-rose-600">Could not load Live Darshan entries.</p>
            )}
            {!list.isLoading && (list.data || []).length === 0 && (
              <p className="py-6 text-center text-sm text-muted-foreground">
                No Live Darshan entries yet. Add one to show the banner on dashboards.
              </p>
            )}
            {(list.data || []).map((d) => (
              <div key={d.id} className="flex items-start justify-between gap-3 rounded-xl border border-border bg-background p-4">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-semibold text-foreground">{d.title}</p>
                    {d.isLive ? (
                      <span className="flex items-center gap-1 rounded-full bg-rose-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-rose-600">
                        <Radio className="h-2.5 w-2.5 animate-pulse" /> Active
                      </span>
                    ) : (
                      <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                        Off
                      </span>
                    )}
                  </div>
                  {d.description && <p className="mt-1 text-xs text-muted-foreground">{d.description}</p>}
                  <p className="mt-1 flex items-center gap-1 truncate text-xs text-muted-foreground">
                    <LinkIcon className="h-3 w-3 shrink-0" />
                    <a href={d.liveUrl} target="_blank" rel="noreferrer" className="truncate hover:underline">
                      {d.liveUrl}
                    </a>
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-1.5">
                  <button
                    onClick={() => handleToggle(d)}
                    disabled={togglingId === d.id}
                    className="rounded-full border border-border p-1.5 hover:bg-muted disabled:opacity-50"
                    title={d.isLive ? "Deactivate" : "Activate"}
                  >
                    <Power className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => setEditing(d)}
                    className="rounded-full border border-border p-1.5 hover:bg-muted"
                    title="Edit"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => setDeleting(d)}
                    className="rounded-full border border-border p-1.5 text-rose-600 hover:bg-rose-50"
                    title="Delete"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </ChartCard>
      </div>

      {addOpen && (
        <LiveDarshanModal
          title="Add Live Darshan"
          onClose={() => setAddOpen(false)}
          onSubmit={async (payload) => {
            await createLiveDarshan(payload);
            toast.success(`${payload.title || "Live Ganpati Darshan"} was added.`);
            invalidate();
            setAddOpen(false);
          }}
        />
      )}

      {editing && (
        <LiveDarshanModal
          title="Edit Live Darshan"
          initial={editing}
          onClose={() => setEditing(null)}
          onSubmit={async (payload) => {
            await updateLiveDarshan(editing.id, payload);
            toast.success(`${payload.title || "Live Ganpati Darshan"} was updated.`);
            invalidate();
            setEditing(null);
          }}
        />
      )}

      <ConfirmDialog
        open={!!deleting}
        onOpenChange={(open) => !open && setDeleting(null)}
        title="Delete this entry?"
        description={deleting ? `"${deleting.title}" will be permanently removed and its banner will stop showing.` : ""}
        loading={deleteBusy}
        onConfirm={handleDelete}
      />
    </>
  );
}

// ---------------------------------------------------------------------------
// Add/edit modal — ONLY Live URL (required) + Title (optional), per spec
// ---------------------------------------------------------------------------

function LiveDarshanModal({
  title,
  initial,
  onClose,
  onSubmit,
}: {
  title: string;
  initial?: LiveDarshanAdmin;
  onClose: () => void;
  onSubmit: (payload: LiveDarshanPayload) => Promise<void>;
}) {
  const [name, setName] = useState(initial?.title ?? "");
  const [liveUrl, setLiveUrl] = useState(initial?.liveUrl ?? "");
  const [isLive, setIsLive] = useState(initial?.isLive ?? false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await onSubmit({
        title: name.trim() || undefined, // blank -> backend defaults to "Live Ganpati Darshan"
        live_url: liveUrl,
        is_live: isLive,
      });
    } catch (err: any) {
      const data = err?.response?.data;
      const firstError = data && typeof data === "object" ? Object.values(data)[0] : null;
      const msg = Array.isArray(firstError) ? firstError[0] : firstError || "Could not save this entry.";
      setError(msg);
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4 overflow-y-auto" onClick={onClose}>
      <div className="w-full max-w-md rounded-2xl bg-card p-5 shadow-xl" onClick={(e) => e.stopPropagation()}>
        <h3 className="font-serif text-lg font-semibold">{title}</h3>
        <form onSubmit={handleSubmit} className="mt-4 space-y-3">
          <FieldLabel label="Live URL (YouTube Live, Vimeo Live, or any HTTPS stream) — required">
            <input
              required
              type="url"
              value={liveUrl}
              onChange={(e) => setLiveUrl(e.target.value)}
              placeholder="https://www.youtube.com/live/xxxxxxxx"
              className={modalInputCls}
            />
          </FieldLabel>

          <FieldLabel label='Title — optional (defaults to "Live Ganpati Darshan")'>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ganpati Live Darshan"
              className={modalInputCls}
            />
          </FieldLabel>

          <label className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
            <input type="checkbox" checked={isLive} onChange={(e) => setIsLive(e.target.checked)} />
            Activate now (deactivates any other currently-active Live Darshan)
          </label>

          {error && <p className="text-sm text-rose-600">{error}</p>}

          <div className="mt-5 grid grid-cols-2 gap-2">
            <button type="button" onClick={onClose} className="rounded-full border border-border py-2 text-xs font-semibold hover:bg-muted">
              Cancel
            </button>
            <button disabled={saving} className="rounded-full bg-foreground py-2 text-xs font-semibold text-background disabled:opacity-50">
              {saving ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const modalInputCls =
  "mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary";

function FieldLabel({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</label>
      {children}
    </div>
  );
}