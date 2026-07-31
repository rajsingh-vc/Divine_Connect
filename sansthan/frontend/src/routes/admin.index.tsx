import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid,
  PieChart, Pie, Cell, Legend,
} from "recharts";
import {
  Users, ShoppingBag, Heart, HandHeart, CalendarDays, Boxes, TrendingUp,
  Sparkles, Plus, Pencil, Trash2, Clock3,
} from "lucide-react";
import { PageHeader, ChartCard } from "@/components/admin/chart-card";
import { StatCard } from "@/components/admin/stat-card";
import { StatusBadge, SeverityBadge } from "@/components/admin/badges";
import { DataTable } from "@/components/admin/data-table";
import { LiveBadge, ExportButton } from "@/components/admin/shell";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { useAuth } from "@/lib/auth-context";
import {
  getDashboardStats, getVisitorFlow,
  getFestivalInfo, createFestivalInfo, updateFestivalInfo, deleteFestivalInfo,
  type LiveFestivalInfo, type FestivalInfoPayload,
  getRevenueMix, getAlerts, getRecentBookings,
} from "@/api/dashboard";

export const Route = createFileRoute("/admin/")({
  head: () => ({
    meta: [
      { title: "Command Dashboard — Sansthan Console" },
      { name: "description", content: "Realtime operations dashboard for temples and sansthans." },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const { user } = useAuth();
  const isAdmin = user?.user_type === "admin";
  const queryClient = useQueryClient();

  const stats = useQuery({ queryKey: ["stats"], queryFn: getDashboardStats });
  const flow = useQuery({ queryKey: ["flow"], queryFn: getVisitorFlow });
  const festivalInfo = useQuery({ queryKey: ["festivalInfo"], queryFn: getFestivalInfo });
  const mix = useQuery({ queryKey: ["mix"], queryFn: getRevenueMix });
  const alerts = useQuery({ queryKey: ["alerts"], queryFn: getAlerts });
  const bookings = useQuery({ queryKey: ["recentBookings"], queryFn: getRecentBookings });
  const s = stats.data;

  const [addOpen, setAddOpen] = useState(false);
  const [editing, setEditing] = useState<LiveFestivalInfo | null>(null);
  const [deleting, setDeleting] = useState<LiveFestivalInfo | null>(null);
  const [deleteBusy, setDeleteBusy] = useState(false);

  function invalidateFestivalInfo() {
    queryClient.invalidateQueries({ queryKey: ["festivalInfo"] });
  }

  async function handleDeleteFestivalInfo() {
    if (!deleting) return;
    setDeleteBusy(true);
    try {
      await deleteFestivalInfo(deleting.id);
      toast.success(`${deleting.title} was removed.`);
      setDeleting(null);
      invalidateFestivalInfo();
    } catch {
      toast.error("Could not delete this entry.");
    } finally {
      setDeleteBusy(false);
    }
  }

  function formatSlot(iso: string) {
    return new Date(iso).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
  }

  return (
    <>
      <PageHeader
        eyebrow="Live Overview"
        title="Command Dashboard"
        subtitle="Realtime visibility into visitors, bookings, donations and operational alerts across all zones."
        actions={<><LiveBadge /><ExportButton /></>}
      />

      {stats.isLoading || !s ? (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-32 animate-pulse rounded-2xl bg-muted" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCard label="Live Visitors" value={s.liveVisitors.value} icon={Users} accent="amber" trend="flat" />
          <StatCard label="Today's Bookings" value={s.todaysBookings.value} icon={ShoppingBag} accent="sky" trend="flat" />
          <StatCard label="Today's Donations" value={s.todaysDonations.value} icon={Heart} accent="emerald" trend="flat" />
          <StatCard label="Volunteers On Duty" value={s.volunteersOnDuty.value} icon={HandHeart} accent="amber" trend="flat" />
          <StatCard label="Total Devotees" value={s.totalDevotees.value} icon={Users} accent="sky" trend="flat" />
          <StatCard label="Total Events" value={s.totalEvents.value} icon={CalendarDays} accent="amber" trend="flat" />
          <StatCard label="Inventory Alerts" value={s.inventoryAlerts.value} icon={Boxes} accent="rose" trend="flat" />
          <StatCard label="Revenue MTD" value={s.revenueMTD.value} icon={TrendingUp} accent="emerald" trend="flat" />
        </div>
      )}

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ChartCard title="Visitor & booking flow · today">
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={flow.data || []}>
                  <defs>
                    <linearGradient id="gVis" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(35 90% 55%)" stopOpacity={0.5} />
                      <stop offset="100%" stopColor="hsl(35 90% 55%)" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="gBook" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(210 70% 50%)" stopOpacity={0.4} />
                      <stop offset="100%" stopColor="hsl(210 70% 50%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(30 10% 90%)" />
                  <XAxis dataKey="hour" fontSize={11} stroke="hsl(30 10% 55%)" />
                  <YAxis fontSize={11} stroke="hsl(30 10% 55%)" />
                  <Tooltip />
                  <Area type="monotone" dataKey="visitors" stroke="hsl(35 90% 55%)" fill="url(#gVis)" strokeWidth={2} />
                  <Area type="monotone" dataKey="bookings" stroke="hsl(210 70% 50%)" fill="url(#gBook)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
        <ChartCard
          title="Live festival info"
          action={
            isAdmin && (
              <button
                onClick={() => setAddOpen(true)}
                className="inline-flex items-center gap-1.5 rounded-full bg-foreground px-3 py-1.5 text-xs font-semibold text-background"
              >
                <Plus className="h-3.5 w-3.5" /> Add
              </button>
            )
          }
        >
          <div className="space-y-3">
            {festivalInfo.isLoading && (
              <p className="py-6 text-center text-sm text-muted-foreground">Loading festival info...</p>
            )}
            {festivalInfo.isError && (
              <p className="py-6 text-center text-sm text-rose-600">Could not load live festival info.</p>
            )}
            {!festivalInfo.isLoading && (festivalInfo.data || []).length === 0 && (
              <p className="py-6 text-center text-sm text-muted-foreground">No festival info added yet.</p>
            )}
            {(festivalInfo.data || []).map((f) => (
              <div key={f.id} className="rounded-xl border border-border bg-background p-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="flex items-center gap-2 text-sm font-semibold text-foreground">
                      <Sparkles className="h-3.5 w-3.5 shrink-0 text-amber-500" />
                      {f.title}
                      {!f.isActive && (
                        <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                          Inactive
                        </span>
                      )}
                    </p>
                    <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock3 className="h-3 w-3" /> {formatSlot(f.startTime)} – {formatSlot(f.endTime)}
                    </p>
                    {f.description && (
                      <p className="mt-1 text-xs text-muted-foreground">{f.description}</p>
                    )}
                  </div>
                  {isAdmin && (
                    <div className="flex shrink-0 items-center gap-1.5">
                      <button
                        onClick={() => setEditing(f)}
                        className="rounded-full border border-border p-1.5 hover:bg-muted"
                        title="Edit"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => setDeleting(f)}
                        className="rounded-full border border-border p-1.5 text-rose-600 hover:bg-rose-50"
                        title="Delete"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </ChartCard>
      </div>

      {addOpen && (
        <FestivalInfoModal
          title="Add live festival info"
          onClose={() => setAddOpen(false)}
          onSubmit={async (payload) => {
            await createFestivalInfo(payload);
            toast.success(`${payload.title} was added.`);
            invalidateFestivalInfo();
            setAddOpen(false);
          }}
        />
      )}

      {editing && (
        <FestivalInfoModal
          title="Edit live festival info"
          initial={editing}
          onClose={() => setEditing(null)}
          onSubmit={async (payload) => {
            await updateFestivalInfo(editing.id, payload);
            toast.success(`${payload.title} was updated.`);
            invalidateFestivalInfo();
            setEditing(null);
          }}
        />
      )}

      <ConfirmDialog
        open={!!deleting}
        onOpenChange={(open) => !open && setDeleting(null)}
        title="Delete this entry?"
        description={deleting ? `"${deleting.title}" will be permanently removed from the live festival info list.` : ""}
        loading={deleteBusy}
        onConfirm={handleDeleteFestivalInfo}
      />

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <ChartCard title="Revenue mix · 12 months">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={mix.data || []} dataKey="value" nameKey="name" innerRadius={50} outerRadius={90} paddingAngle={2}>
                  {(mix.data || []).map((e, i) => <Cell key={i} fill={e.color} />)}
                </Pie>
                <Legend verticalAlign="bottom" iconType="circle" wrapperStyle={{ fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
        <div className="lg:col-span-2">
          <ChartCard title="Active alerts">
            <div className="space-y-2">
              {(alerts.data || []).map((a) => (
                <div key={a.id} className="flex items-start gap-3 rounded-xl border border-border p-3">
                  <SeverityBadge severity={a.severity} />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-foreground">
                      <span className="text-xs uppercase tracking-wider text-muted-foreground">{a.category}</span>
                      <span className="mx-2 text-muted-foreground">·</span>
                      {a.desc}
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{a.id} · {a.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </ChartCard>
        </div>
      </div>

      <div className="mt-6">
        <ChartCard title="Recent bookings">
          <DataTable
            rows={bookings.data || []}
            columns={[
              { key: "id", header: "ID", render: (r) => <span className="font-mono text-xs text-muted-foreground">{r.id}</span> },
              { key: "devotee", header: "Devotee" },
              { key: "seva", header: "Seva" },
              { key: "date", header: "Date" },
              { key: "slot", header: "Slot" },
              { key: "amount", header: "Amount", render: (r) => <span className="font-semibold">{r.amount}</span> },
              { key: "status", header: "Status", render: (r) => <StatusBadge status={r.status} /> },
            ]}
          />
        </ChartCard>
      </div>
    </>
  );
}

// ---------------------------------------------------------------------------
// Live Festival Info — add/edit modal (admin only)
// ---------------------------------------------------------------------------

/** ISO datetime -> value a <input type="datetime-local"> can display. */
function toLocalInputValue(iso?: string) {
  if (!iso) return "";
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

/** <input type="datetime-local"> value -> ISO datetime for the API. */
function fromLocalInputValue(value: string) {
  return value ? new Date(value).toISOString() : "";
}

function FestivalInfoModal({
  title,
  initial,
  onClose,
  onSubmit,
}: {
  title: string;
  initial?: LiveFestivalInfo;
  onClose: () => void;
  onSubmit: (payload: FestivalInfoPayload) => Promise<void>;
}) {
  const [name, setName] = useState(initial?.title ?? "");
  const [startTime, setStartTime] = useState(toLocalInputValue(initial?.startTime));
  const [endTime, setEndTime] = useState(toLocalInputValue(initial?.endTime));
  const [description, setDescription] = useState(initial?.description ?? "");
  const [isActive, setIsActive] = useState(initial?.isActive ?? true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await onSubmit({
        title: name,
        start_time: fromLocalInputValue(startTime),
        end_time: fromLocalInputValue(endTime),
        description,
        is_active: isActive,
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
          <FieldLabel label="Title (e.g. Aarti, VIP Darshan)">
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Aarti"
              className={modalInputCls}
            />
          </FieldLabel>
          <div className="grid grid-cols-2 gap-3">
            <FieldLabel label="Start time">
              <input
                type="datetime-local"
                required
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className={modalInputCls}
              />
            </FieldLabel>
            <FieldLabel label="End time">
              <input
                type="datetime-local"
                required
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className={modalInputCls}
              />
            </FieldLabel>
          </div>
          <FieldLabel label="Description">
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Details for devotees — location, dress code, etc."
              className={modalInputCls}
            />
          </FieldLabel>
          <label className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
            <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />
            Show on the live dashboard
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