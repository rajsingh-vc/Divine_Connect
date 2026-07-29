import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, type FormEvent, type ReactNode } from "react";
import { Sparkles, CheckCircle2, CalendarCheck, TrendingUp, Plus, Receipt, X } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/admin/chart-card";
import { StatCard } from "@/components/admin/stat-card";
import { GenerateBillModal } from "@/components/admin/generate-bill-modal";
import { getSevas, getDashboardStats, createSeva, updateSeva, type SevaPayload } from "@/api";
import { cn } from "@/lib/utils";

const TABS = ["All", "Grand Pooja", "Daily", "Special", "Charity"];

type SevaRow = Awaited<ReturnType<typeof getSevas>>[number];

export const Route = createFileRoute("/admin/sevas")({
  head: () => ({ meta: [{ title: "Sevas & Services — Sansthan Console" }] }),
  component: () => {
    const q = useQuery({ queryKey: ["sevas"], queryFn: getSevas });
    const statsQ = useQuery({ queryKey: ["dashboard-stats"], queryFn: getDashboardStats });
    const queryClient = useQueryClient();
    const [tab, setTab] = useState("All");
    const rows = (q.data || []).filter((s) => tab === "All" || s.category === tab);
    const [billingSeva, setBillingSeva] = useState<(typeof rows)[number] | null>(null);
    const [formOpen, setFormOpen] = useState(false);
    const [editingSeva, setEditingSeva] = useState<SevaRow | null>(null);
    const [previewingSeva, setPreviewingSeva] = useState<SevaRow | null>(null);
    // Sevas whose most recent bill (this session) was completed — shows the
    // "Bill Completed" badge on that seva's card.
    const [completedSevas, setCompletedSevas] = useState<Record<number, string>>({});

    function invalidate() {
      queryClient.invalidateQueries({ queryKey: ["sevas"] });
    }

    const totalSevas = q.data?.length ?? 0;
    const activeSevas = q.data?.filter((s) => s.isActive).length ?? 0;

    return (
      <>
        <PageHeader
          eyebrow="Catalogue"
          title="Sevas & Religious Services"
          subtitle="Manage the entire catalogue of religious offerings, pricing, priests and capacity."
          actions={
            <button
              onClick={() => setFormOpen(true)}
              className="inline-flex items-center gap-2 rounded-full bg-foreground px-4 py-2 text-xs font-semibold text-background"
            >
              <Plus className="h-3.5 w-3.5" /> New Seva
            </button>
          }
        />
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCard label="Total Sevas" value={String(totalSevas)} icon={Sparkles} accent="amber" trend="flat" />
          <StatCard label="Active" value={String(activeSevas)} icon={CheckCircle2} accent="emerald" trend="flat" />
          <StatCard label="Bookings Today" value={statsQ.data?.todaysBookings.value ?? "—"} icon={CalendarCheck} accent="sky" />
          <StatCard label="Revenue (MTD)" value={statsQ.data?.revenueMTD.value ?? "—"} icon={TrendingUp} accent="emerald" />
        </div>
        <div className="mt-6 flex flex-wrap gap-1 rounded-full border border-border bg-card p-1 w-fit">
          {TABS.map((t) => (
            <button key={t} onClick={() => setTab(t)} className={cn("rounded-full px-4 py-1.5 text-sm font-medium transition-colors", tab === t ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground")}>{t}</button>
          ))}
        </div>
        <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {rows.map((s) => (
            <div key={s.name} className="rounded-2xl border border-border bg-card p-5 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <span className="rounded-full border border-primary/30 bg-primary/10 px-3 py-0.5 text-[11px] font-semibold text-primary">{s.category}</span>
                <div className="text-right">
                  <p className="font-serif text-xl font-semibold text-primary">{s.price}</p>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">/booking</p>
                </div>
              </div>
              <h3 className="mt-3 font-serif text-lg font-semibold text-foreground">{s.name}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{s.desc}</p>
              <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                <div className="rounded-lg border border-border p-2">
                  <p className="text-sm font-semibold">{s.duration}</p>
                  <p className="text-[10px] uppercase text-muted-foreground">Duration</p>
                </div>
                <div className="rounded-lg border border-border p-2">
                  <p className="text-sm font-semibold">{s.slots}</p>
                  <p className="text-[10px] uppercase text-muted-foreground">Slots/day</p>
                </div>
                <div className="rounded-lg border border-border p-2">
                  <p className="text-sm font-semibold">{s.capacity}</p>
                  <p className="text-[10px] uppercase text-muted-foreground">Capacity</p>
                </div>
              </div>
              <p className="mt-3 text-xs text-muted-foreground">Priest · <span className="font-medium text-foreground">{s.priest}</span></p>
              <div className="mt-4 grid grid-cols-2 gap-2">
                <button onClick={() => setEditingSeva(s)} className="rounded-full border border-border py-2 text-xs font-semibold hover:bg-muted">Edit</button>
                <button onClick={() => setPreviewingSeva(s)} className="rounded-full bg-foreground py-2 text-xs font-semibold text-background">Preview</button>
              </div>
              <button
                onClick={() => setBillingSeva(s)}
                className="mt-2 inline-flex w-full items-center justify-center gap-1.5 rounded-full border border-primary/40 py-2 text-xs font-semibold text-primary hover:bg-primary/10"
              >
                <Receipt className="h-3.5 w-3.5" /> Bill
              </button>
              {completedSevas[s.id] && (
                <p className="mt-2 flex items-center justify-center gap-1 text-[11px] font-semibold text-emerald-600">
                  <CheckCircle2 className="h-3 w-3" /> Bill Completed · {completedSevas[s.id]}
                </p>
              )}
            </div>
          ))}
        </div>

        {billingSeva && (
          <GenerateBillModal
            seva={billingSeva}
            onClose={() => setBillingSeva(null)}
            onCompleted={(billNumber) => setCompletedSevas((prev) => ({ ...prev, [billingSeva.id]: billNumber }))}
          />
        )}

        {formOpen && (
          <SevaFormModal
            title="New Seva"
            onClose={() => setFormOpen(false)}
            onSubmit={async (payload) => {
              await createSeva(payload);
              toast.success(`${payload.name} was added to the catalogue.`);
              invalidate();
              setFormOpen(false);
            }}
          />
        )}

        {editingSeva && (
          <SevaFormModal
            title="Edit Seva"
            initial={editingSeva}
            onClose={() => setEditingSeva(null)}
            onSubmit={async (payload) => {
              await updateSeva(editingSeva.id, payload);
              toast.success(`${payload.name} was updated.`);
              invalidate();
              setEditingSeva(null);
            }}
          />
        )}

        {previewingSeva && <SevaPreviewModal seva={previewingSeva} onClose={() => setPreviewingSeva(null)} />}
      </>
    );
  },
});

const inputCls =
  "mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary";

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</label>
      {children}
    </div>
  );
}

/** Create/Edit form — shared by "New Seva" and the per-card "Edit" button.
 *  Any authenticated console user (admin or volunteer) can use this; the
 *  backend only requires authentication on the sevas endpoint, no role check. */
function SevaFormModal({
  title,
  initial,
  onClose,
  onSubmit,
}: {
  title: string;
  initial?: SevaRow;
  onClose: () => void;
  onSubmit: (payload: SevaPayload) => Promise<void>;
}) {
  const [name, setName] = useState(initial?.name ?? "");
  const [category, setCategory] = useState(initial?.category ?? TABS[1]);
  const [price, setPrice] = useState(initial ? String(initial.priceRaw) : "");
  const [durationMinutes, setDurationMinutes] = useState(initial ? String(initial.durationMinutesRaw) : "30");
  const [slotsPerDay, setSlotsPerDay] = useState(initial ? String(initial.slots) : "1");
  const [capacity, setCapacity] = useState(initial ? String(initial.capacity) : "1");
  const [priest, setPriest] = useState(initial?.priest ?? "");
  const [description, setDescription] = useState(initial?.desc ?? "");
  const [isActive, setIsActive] = useState(initial?.isActive ?? true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await onSubmit({
        name,
        category,
        price: Number(price) || 0,
        duration_minutes: Number(durationMinutes) || 30,
        slots_per_day: Number(slotsPerDay) || 1,
        capacity: Number(capacity) || 1,
        priest,
        description,
        is_active: isActive,
      });
    } catch (err: any) {
      const data = err?.response?.data;
      const firstError = data && typeof data === "object" ? Object.values(data)[0] : null;
      const msg = Array.isArray(firstError) ? firstError[0] : firstError || "Could not save this seva.";
      setError(msg);
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4 overflow-y-auto" onClick={onClose}>
      <div className="w-full max-w-md rounded-2xl bg-card p-5 shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between">
          <h3 className="font-serif text-lg font-semibold">{title}</h3>
          <button type="button" onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="h-4 w-4" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="mt-4 space-y-3">
          <Field label="Name">
            <input required value={name} onChange={(e) => setName(e.target.value)} className={inputCls} />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Category">
              <select value={category} onChange={(e) => setCategory(e.target.value)} className={inputCls}>
                {TABS.filter((t) => t !== "All").map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </Field>
            <Field label="Price (₹)">
              <input required type="number" min={0} step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} className={inputCls} />
            </Field>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <Field label="Duration (min)">
              <input type="number" min={1} value={durationMinutes} onChange={(e) => setDurationMinutes(e.target.value)} className={inputCls} />
            </Field>
            <Field label="Slots/day">
              <input type="number" min={1} value={slotsPerDay} onChange={(e) => setSlotsPerDay(e.target.value)} className={inputCls} />
            </Field>
            <Field label="Capacity">
              <input type="number" min={1} value={capacity} onChange={(e) => setCapacity(e.target.value)} className={inputCls} />
            </Field>
          </div>
          <Field label="Priest">
            <input value={priest} onChange={(e) => setPriest(e.target.value)} className={inputCls} />
          </Field>
          <Field label="Description">
            <textarea rows={3} value={description} onChange={(e) => setDescription(e.target.value)} className={inputCls} />
          </Field>
          {initial && (
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />
              Active (visible for booking)
            </label>
          )}
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

/** Read-only preview of a seva, close to what a devotee sees when booking. */
function SevaPreviewModal({ seva, onClose }: { seva: SevaRow; onClose: () => void }) {
  const rows: [string, string][] = [
    ["Category", seva.category],
    ["Price", seva.price],
    ["Duration", seva.duration],
    ["Slots/day", String(seva.slots)],
    ["Capacity", String(seva.capacity)],
    ["Priest", seva.priest || "—"],
    ["Status", seva.isActive ? "Active" : "Inactive"],
  ];
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4 overflow-y-auto" onClick={onClose}>
      <div className="w-full max-w-md rounded-2xl bg-card p-5 shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between">
          <h3 className="font-serif text-lg font-semibold">{seva.name}</h3>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="h-4 w-4" />
          </button>
        </div>
        {seva.desc && <p className="mt-2 text-sm text-muted-foreground">{seva.desc}</p>}
        <dl className="mt-4 divide-y divide-border">
          {rows.map(([label, value]) => (
            <div key={label} className="flex items-center justify-between gap-4 py-2 text-sm">
              <dt className="shrink-0 text-muted-foreground">{label}</dt>
              <dd className="text-right font-medium">{value}</dd>
            </div>
          ))}
        </dl>
        <button onClick={onClose} className="mt-5 w-full rounded-full border border-border py-2 text-xs font-semibold hover:bg-muted">
          Close
        </button>
      </div>
    </div>
  );
}