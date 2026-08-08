import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState, type FormEvent } from "react";
import { toast } from "sonner";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid,
  PieChart, Pie, Cell, Legend,
} from "recharts";
import {
  Users, ShoppingBag, Heart, HandHeart, CalendarDays, Boxes, TrendingUp,
  Sparkles, Plus, Pencil, Trash2, Clock3,
  // NEW — Live Darshan management icons
  Radio, Link as LinkIcon, Power,
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
  // NEW — Live Darshan admin API
  getLiveDarshanAdminList, createLiveDarshan, updateLiveDarshan, deleteLiveDarshan,
  type LiveDarshanAdmin, type LiveDarshanPayload,
} from "@/api/dashboard";
import { QRScanWidget } from "@/components/admin/QRScanWidget";
import { EntryLogsTable } from "@/components/admin/EntryLogsTable";
import { MyDevoteeQR } from "@/components/admin/MyDevoteeQR";
import { ManualCounterWidget } from "@/components/admin/ManualCounterWidget";
import { ManualCounterAdminTable } from "@/components/admin/ManualCounterAdminTable";
import { getManualCounterAdminList } from "@/api/manual-counter";
import { LiveDarshanBanner } from "@/components/LiveDarshanBanner";

export const Route = createFileRoute("/admin/")({
  head: () => ({
    meta: [
      { title: "Command Dashboard — Sansthan Console" },
      { name: "description", content: "Realtime operations dashboard for temples and sansthans." },
    ],
  }),
  component: Dashboard,
});

const AREA_POLL_MS = 10_000;

function todayISODate() {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function Dashboard() {
  const { user } = useAuth();
  const isAdmin = user?.user_type === "admin";
  const queryClient = useQueryClient();



  const stats = useQuery({ queryKey: ["stats"], queryFn: getDashboardStats });
  const flow = useQuery({ queryKey: ["flow"], queryFn: getVisitorFlow });
  const festivalInfo = useQuery({
    queryKey: ["festivalInfo"],
    queryFn: getFestivalInfo,
    refetchInterval: AREA_POLL_MS, // NEW — auto-updates LIVE/NOT LIVE status without a manual page refresh
  });
  const mix = useQuery({ queryKey: ["mix"], queryFn: getRevenueMix });
  const alerts = useQuery({ queryKey: ["alerts"], queryFn: getAlerts });
  const bookings = useQuery({ queryKey: ["recentBookings"], queryFn: getRecentBookings });
  const s = stats.data;

  // Manual Counter — "Manual Entries Today" stat card (admin only). Pulls
  // straight from the manual-counter admin audit log rather than touching
  // the /dashboard/stats/ endpoint or its existing numbers.
  const manualToday = useQuery({
    queryKey: ["manualCounterAdminList", "today"],
    queryFn: () => getManualCounterAdminList({ date: todayISODate() }),
    enabled: isAdmin,
    refetchInterval: AREA_POLL_MS,
  });

  const manualEntriesToday = useMemo(() => {
    const rows = manualToday.data || [];
    return rows.reduce((sum, r) => sum + (r.action === "INCREMENT" ? r.count : -r.count), 0);
  }, [manualToday.data]);

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

  // NEW — null-safe: Seva-derived entries can have only start OR only end time.
  function formatSlot(iso?: string | null) {
    if (!iso) return "—";
    return new Date(iso).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
  }

  const sortedFestivalInfo = [...(festivalInfo.data || [])].sort((a, b) => {
    const aSeva = (a as any).source === "seva" ? 0 : 1;
    const bSeva = (b as any).source === "seva" ? 0 : 1;
    return aSeva - bSeva;
  });

  // =====================================================================
  // NEW — Live Darshan Management (admin-only card on this same dashboard,
  // no sidebar entry, no separate route). Devotee/Volunteer never call
  // getLiveDarshanAdminList — they only ever see <LiveDarshanBanner />,
  // which already existed above and is untouched.
  // =====================================================================
  const liveDarshanList = useQuery({
    queryKey: ["liveDarshanAdmin"],
    queryFn: getLiveDarshanAdminList,
    enabled: isAdmin,
  });

  const [ldAddOpen, setLdAddOpen] = useState(false);
  const [ldEditing, setLdEditing] = useState<LiveDarshanAdmin | null>(null);
  const [ldDeleting, setLdDeleting] = useState<LiveDarshanAdmin | null>(null);
  const [ldDeleteBusy, setLdDeleteBusy] = useState(false);
  const [ldTogglingId, setLdTogglingId] = useState<number | null>(null);

  function invalidateLiveDarshan() {
    queryClient.invalidateQueries({ queryKey: ["liveDarshanAdmin"] });
    queryClient.invalidateQueries({ queryKey: ["liveDarshanStatus"] }); // refreshes LiveDarshanBanner too
  }

  async function handleLdDelete() {
    if (!ldDeleting) return;
    setLdDeleteBusy(true);
    try {
      await deleteLiveDarshan(ldDeleting.id);
      toast.success(`${ldDeleting.title} was removed.`);
      setLdDeleting(null);
      invalidateLiveDarshan();
    } catch {
      toast.error("Could not delete this entry.");
    } finally {
      setLdDeleteBusy(false);
    }
  }

  async function handleLdToggle(d: LiveDarshanAdmin) {
    setLdTogglingId(d.id);
    try {
      await updateLiveDarshan(d.id, { title: d.title, live_url: d.liveUrl, is_live: !d.isLive });
      toast.success(d.isLive ? `${d.title} deactivated.` : `${d.title} is now live.`);
      invalidateLiveDarshan();
    } catch {
      toast.error("Could not update status.");
    } finally {
      setLdTogglingId(null);
    }
  }
  // ===================== END NEW Live Darshan state =====================

  return (
    <>
      <LiveDarshanBanner />

      {/* ================= NEW — Live Darshan Management card (admin only) ================= */}
      {isAdmin && (
        <div className="mt-6">
          <ChartCard
            title="Live Darshan Management"
            action={
              <button
                onClick={() => setLdAddOpen(true)}
                className="inline-flex items-center gap-1.5 rounded-full bg-foreground px-3 py-1.5 text-xs font-semibold text-background"
              >
                <Plus className="h-3.5 w-3.5" /> Add Live Darshan
              </button>
            }
          >
            <div className="space-y-3">
              {liveDarshanList.isLoading && (
                <p className="py-6 text-center text-sm text-muted-foreground">Loading entries...</p>
              )}
              {liveDarshanList.isError && (
                <p className="py-6 text-center text-sm text-rose-600">Could not load Live Darshan entries.</p>
              )}
              {!liveDarshanList.isLoading && (liveDarshanList.data || []).length === 0 && (
                <p className="py-6 text-center text-sm text-muted-foreground">
                  No Live Darshan entries yet. Add one to show the banner on all dashboards.
                </p>
              )}
              {(liveDarshanList.data || []).map((d) => (
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
                    <p className="mt-1 flex items-center gap-1 truncate text-xs text-muted-foreground">
                      <LinkIcon className="h-3 w-3 shrink-0" />
                      <a href={d.liveUrl} target="_blank" rel="noreferrer" className="truncate hover:underline">
                        {d.liveUrl}
                      </a>
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-1.5">
                    <button
                      onClick={() => handleLdToggle(d)}
                      disabled={ldTogglingId === d.id}
                      className="rounded-full border border-border p-1.5 hover:bg-muted disabled:opacity-50"
                      title={d.isLive ? "Deactivate" : "Activate"}
                    >
                      <Power className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => setLdEditing(d)}
                      className="rounded-full border border-border p-1.5 hover:bg-muted"
                      title="Edit"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => setLdDeleting(d)}
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
      )}
      {/* =============== END NEW — Live Darshan Management card =============== */}

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
          {isAdmin && (
            <StatCard
              label="Manual Entries Today"
              value={manualToday.isLoading ? "–" : String(manualEntriesToday)}
              icon={Plus}
              accent="amber"
              trend="flat"
            />
          )}
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
          <div className="max-h-80 overflow-y-auto pr-1 space-y-3">
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
                      {/* NEW — badge for Sevas that are auto-driving this entry */}
                      {(f as any).source === "seva" && (
                        <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-emerald-700">
                          LIVE · from Daily Seva
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
                  {/* NEW — Seva-derived entries aren't real LiveFestivalInfo rows, so no edit/delete */}
                  {isAdmin && (f as any).source !== "seva" && (
                    <div className="flex shrink-0 items-center gap-1.5">
                      <button
                        onClick={() => setEditing(f)}
                        className="rounded-full border border-border p-1.5 hover:bg-muted"
                        title="Edit"
                      >
                        <Pencil className="h-3.5 w-3.5" />
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

      {/* NEW — Live Darshan add/edit modals + confirm dialog */}
      {ldAddOpen && (
        <LiveDarshanModal
          title="Add Live Darshan"
          onClose={() => setLdAddOpen(false)}
          onSubmit={async (payload) => {
            await createLiveDarshan(payload);
            toast.success(`${payload.title || "Live Ganpati Darshan"} was added.`);
            invalidateLiveDarshan();
            setLdAddOpen(false);
          }}
        />
      )}

      {ldEditing && (
        <LiveDarshanModal
          title="Edit Live Darshan"
          initial={ldEditing}
          onClose={() => setLdEditing(null)}
          onSubmit={async (payload) => {
            await updateLiveDarshan(ldEditing.id, payload);
            toast.success(`${payload.title || "Live Ganpati Darshan"} was updated.`);
            invalidateLiveDarshan();
            setLdEditing(null);
          }}
        />
      )}

      <ConfirmDialog
        open={!!ldDeleting}
        onOpenChange={(open) => !open && setLdDeleting(null)}
        title="Delete this entry?"
        description={ldDeleting ? `"${ldDeleting.title}" will be permanently removed and its banner will stop showing.` : ""}
        loading={ldDeleteBusy}
        onConfirm={handleLdDelete}
      />

      {/* QR Check‑in & Attendance History */}
      <div className="mt-8 flex items-center justify-between">
        <div>
          <p className="font-serif text-lg font-semibold text-foreground">QR Check‑in & Attendance History</p>
          <p className="text-sm text-muted-foreground">
            Scan devotees in/out and review all attendance records.
          </p>
        </div>
      </div>
      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-1">
          {user?.user_type === "volunteer" ? (
            <QRScanWidget />
          ) : user?.user_type === "devotee" ? (
            <MyDevoteeQR />
          ) : (
            <div className="rounded-xl border border-border bg-card p-4 text-center text-sm text-muted-foreground">
              Volunteer access required to scan QR codes.
            </div>
          )}
        </div>
        <div className="lg:col-span-2">
          {(user?.user_type === "admin" || user?.user_type === "volunteer") && (
            <EntryLogsTable />
          )}
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Manual Counter — devotees let in without a QR scan                  */}
      {/* ------------------------------------------------------------------ */}
      <div className="mt-8 flex items-center justify-between">
        <div>
          <p className="font-serif text-lg font-semibold text-foreground">Manual Counter</p>
          <p className="text-sm text-muted-foreground">
            Entries recorded when a devotee can't scan — folded into crowd totals in real time.
          </p>
        </div>
      </div>
      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        {user?.user_type === "volunteer" && (
          <div className="lg:col-span-1">
            <ManualCounterWidget />
          </div>
        )}
        {isAdmin && (
          <div className="lg:col-span-3">
            <ManualCounterAdminTable />
          </div>
        )}
        {!isAdmin && user?.user_type !== "volunteer" && (
          <div className="lg:col-span-3 rounded-xl border border-border bg-card p-4 text-center text-sm text-muted-foreground">
            Manual Counter is available to volunteers and admins only.
          </div>
        )}
      </div>
      {/* ------------------------------------------------------------------ */}

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
          <div className="max-h-80 overflow-y-auto pr-1">
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
          </div>
        </ChartCard>
      </div>
    </>
  );
}

// ---------------------------------------------------------------------------
// Live Festival Info — add/edit modal (admin only)
// ---------------------------------------------------------------------------

function toLocalInputValue(iso?: string) {
  if (!iso) return "";
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

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

// ---------------------------------------------------------------------------
// NEW — Live Darshan — add/edit modal (admin only). ONLY Live URL
// (required) + Title (optional), per spec.
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