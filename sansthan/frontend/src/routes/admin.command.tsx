import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { PageHeader, ChartCard } from "@/components/admin/chart-card";
import { LiveBadge, ExportButton } from "@/components/admin/shell";
import { SeverityBadge, IncidentStatusBadge } from "@/components/admin/badges";
import { StatCard } from "@/components/admin/stat-card";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { IncidentReportModal } from "@/components/admin/incident_report_modal";
import { SOSAlertModal } from "@/components/admin/sos-alert-modal";
import {
  Siren,
  ShieldAlert,
  Radio,
  Clock,
  Plus,
  Pencil,
  Trash2,
  MapPin,
  Search,
  AlertOctagon,
  Flame,
  UserSearch,
  HeartPulse,
  HandHeart,
} from "lucide-react";
import {
  deleteIncident,
  getIncidents,
  type IncidentCategory,
  type IncidentReport,
  type IncidentSeverity,
  type IncidentStatus,
} from "@/api/incidents";
import { getSOSAlerts, deleteSOSAlert, type SOSAlert, type SOSAlertType } from "@/api/sos";
import { useAuth } from "@/lib/auth-context";

const CATEGORY_FILTERS: { value: IncidentCategory | "all"; label: string }[] = [
  { value: "all", label: "All categories" },
  { value: "medical", label: "Medical" },
  { value: "crowd", label: "Crowd" },
  { value: "security", label: "Security" },
  { value: "queue", label: "Queue" },
  { value: "volunteer_support", label: "Volunteer Support" },
];

const SEVERITY_FILTERS: { value: IncidentSeverity | "all"; label: string }[] = [
  { value: "all", label: "All severities" },
  { value: "critical", label: "Critical" },
  { value: "high", label: "High" },
  { value: "medium", label: "Medium" },
  { value: "low", label: "Low" },
];

const STATUS_FILTERS: { value: IncidentStatus | "all"; label: string }[] = [
  { value: "all", label: "All statuses" },
  { value: "open", label: "Open" },
  { value: "in_progress", label: "In Progress" },
  { value: "resolved", label: "Resolved" },
  { value: "closed", label: "Closed" },
];

const SOS_BUTTONS: { value: SOSAlertType; label: string; icon: typeof Flame }[] = [
  { value: "fire", label: "Fire", icon: Flame },
  { value: "lost_child_item", label: "Lost Child / Item", icon: UserSearch },
  { value: "security", label: "Security", icon: ShieldAlert },
  { value: "medical", label: "Medical", icon: HeartPulse },
  { value: "volunteer_support", label: "Volunteer Support", icon: HandHeart },
];

function sosStatusColor(status: SOSAlert["status"]) {
  return {
    open: "bg-rose-100 text-rose-700",
    in_progress: "bg-sky-100 text-sky-700",
    resolved: "bg-emerald-100 text-emerald-700",
    closed: "bg-muted text-muted-foreground",
  }[status];
}

export const Route = createFileRoute("/admin/command")({
  head: () => ({ meta: [{ title: "Command Centre — Sansthan Console" }] }),
  component: CommandCentrePage,
});

function CommandCentrePage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const [category, setCategory] = useState<IncidentCategory | "all">("all");
  const [severity, setSeverity] = useState<IncidentSeverity | "all">("all");
  const [status, setStatus] = useState<IncidentStatus | "all">("all");
  const [search, setSearch] = useState("");

  const [addOpen, setAddOpen] = useState(false);
  const [editing, setEditing] = useState<IncidentReport | null>(null);
  const [deleting, setDeleting] = useState<IncidentReport | null>(null);
  const [deleteBusy, setDeleteBusy] = useState(false);

  // Emergency SOS state
  const [sosCreateType, setSosCreateType] = useState<SOSAlertType | null>(null);
  const [sosEditing, setSosEditing] = useState<SOSAlert | null>(null);
  const [sosDeleting, setSosDeleting] = useState<SOSAlert | null>(null);
  const [sosDeleteBusy, setSosDeleteBusy] = useState(false);

  const isAdmin = user?.user_type === "admin";
  const isVolunteer = user?.user_type === "volunteer";
  // Devotees can view the log but never file, edit, or delete a report.
  const canReport = isAdmin || isVolunteer;

  const q = useQuery({
    queryKey: ["incidents", category, severity, status, search],
    queryFn: () =>
      getIncidents({
        category: category === "all" ? undefined : category,
        severity: severity === "all" ? undefined : severity,
        status: status === "all" ? undefined : status,
        search: search || undefined,
        ordering: "-created_at",
      }),
  });

  const incidents = q.data ?? [];

  const sosQuery = useQuery({
    queryKey: ["sos-alerts"],
    queryFn: () => getSOSAlerts({ ordering: "-created_at" }),
  });
  const sosAlerts = sosQuery.data ?? [];

  // Live stat cards computed from the current (filtered) incident log.
  const stats = useMemo(() => {
    const open = incidents.filter((i) => i.status === "open").length;
    const inProgress = incidents.filter((i) => i.status === "in_progress").length;
    const critical = incidents.filter((i) => i.severity === "critical").length;
    const resolvedToday = incidents.filter(
      (i) =>
        (i.status === "resolved" || i.status === "closed") &&
        new Date(i.updated_at).toDateString() === new Date().toDateString(),
    ).length;
    return { open, inProgress, critical, resolvedToday };
  }, [incidents]);

  function invalidate() {
    queryClient.invalidateQueries({ queryKey: ["incidents"] });
  }

  function invalidateSOS() {
    queryClient.invalidateQueries({ queryKey: ["sos-alerts"] });
  }

  // Admin can edit/delete any report; a volunteer only their own; devotee never.
  function canEdit(incident: IncidentReport) {
    if (isAdmin) return true;
    if (isVolunteer) return incident.reported_by === user?.id;
    return false;
  }

  // Same rule as backend SOSAlertPermission: admin -> any alert,
  // volunteer -> only their own, devotee -> never.
  function canEditSOS(alert: SOSAlert) {
    if (isAdmin) return true;
    if (isVolunteer) return alert.raised_by === user?.id;
    return false;
  }

  async function handleDelete() {
    if (!deleting) return;
    setDeleteBusy(true);
    try {
      await deleteIncident(deleting.id);
      toast.success(`${deleting.incident_code} was removed.`);
      setDeleting(null);
      invalidate();
    } catch {
      toast.error("Could not delete this incident report.");
    } finally {
      setDeleteBusy(false);
    }
  }

  async function handleDeleteSOS() {
    if (!sosDeleting) return;
    setSosDeleteBusy(true);
    try {
      await deleteSOSAlert(sosDeleting.id);
      toast.success(`${sosDeleting.sos_code} was removed.`);
      setSosDeleting(null);
      invalidateSOS();
    } catch {
      toast.error("Could not delete this SOS alert.");
    } finally {
      setSosDeleteBusy(false);
    }
  }

  return (
    <>
      <PageHeader
        eyebrow="Operations"
        title="Command Centre"
        subtitle="War-room view of every active incident, zone status and field response."
        actions={
          <>
            <LiveBadge />
            <ExportButton />
            {canReport && (
              <button
                onClick={() => setAddOpen(true)}
                className="inline-flex items-center gap-1.5 rounded-full bg-foreground px-4 py-2 text-xs font-semibold text-background"
              >
                <Plus className="h-3.5 w-3.5" />
                Report Incident
              </button>
            )}
          </>
        }
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Open Incidents" value={String(stats.open)} change="awaiting response" icon={Siren} accent="rose" />
        <StatCard label="In Progress" value={String(stats.inProgress)} change="being handled" icon={Radio} accent="sky" trend="flat" />
        <StatCard label="Critical Severity" value={String(stats.critical)} change="needs escalation" icon={ShieldAlert} accent="amber" trend="flat" />
        <StatCard label="Resolved Today" value={String(stats.resolvedToday)} change="closed out" icon={Clock} accent="emerald" />
      </div>

      <div className="mt-6">
        <ChartCard
          title="Incident log"
          action={
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search incidents..."
                  className="rounded-full border border-border bg-background py-1.5 pl-8 pr-3 text-xs outline-none focus:border-primary"
                />
              </div>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as IncidentCategory | "all")}
                className="rounded-full border border-border bg-background px-2.5 py-1.5 text-xs outline-none"
              >
                {CATEGORY_FILTERS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
              <select
                value={severity}
                onChange={(e) => setSeverity(e.target.value as IncidentSeverity | "all")}
                className="rounded-full border border-border bg-background px-2.5 py-1.5 text-xs outline-none"
              >
                {SEVERITY_FILTERS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as IncidentStatus | "all")}
                className="rounded-full border border-border bg-background px-2.5 py-1.5 text-xs outline-none"
              >
                {STATUS_FILTERS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
          }
        >
          <div className="space-y-2">
            {q.isLoading && (
              <p className="py-6 text-center text-sm text-muted-foreground">Loading incident log...</p>
            )}
            {q.isError && (
              <p className="py-6 text-center text-sm text-rose-600">Could not load the incident log.</p>
            )}
            {!q.isLoading && incidents.length === 0 && (
              <p className="py-6 text-center text-sm text-muted-foreground">No incidents match these filters.</p>
            )}

            {incidents.map((incident) => (
              <div key={incident.id} className="flex items-start gap-3 rounded-xl border border-border p-3">
                {incident.image ? (
                  <img
                    src={incident.image}
                    alt={incident.title}
                    className="h-14 w-14 shrink-0 rounded-lg border border-border object-cover"
                  />
                ) : (
                  <div className="grid h-14 w-14 shrink-0 place-items-center rounded-lg bg-muted">
                    <Siren className="h-5 w-5 text-muted-foreground" />
                  </div>
                )}

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <SeverityBadge severity={incident.severity} />
                    <IncidentStatusBadge status={incident.status} />
                    <span className="text-xs uppercase tracking-wider text-muted-foreground">
                      {incident.category_display}
                    </span>
                  </div>
                  <p className="mt-1 text-sm font-medium text-foreground">{incident.title}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2">{incident.description}</p>
                  <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-muted-foreground">
                    <span>{incident.incident_code}</span>
                    {incident.location && (
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="h-3 w-3" /> {incident.location}
                      </span>
                    )}
                    <span>Reported by {incident.reported_by_name}</span>
                    <span>{new Date(incident.created_at).toLocaleString()}</span>
                  </p>
                </div>

                {canEdit(incident) && (
                  <div className="flex shrink-0 items-center gap-1.5">
                    <button
                      onClick={() => setEditing(incident)}
                      className="rounded-full border border-border p-1.5 hover:bg-muted"
                      title="Edit"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => setDeleting(incident)}
                      className="rounded-full border border-border p-1.5 text-rose-600 hover:bg-rose-50"
                      title="Delete"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </ChartCard>
      </div>

      {/* ---------------------------------------------------------------- */}
      {/* Emergency SOS                                                    */}
      {/* ---------------------------------------------------------------- */}
      <div className="mt-6">
        <ChartCard
          title="Emergency SOS"
          action={
            <span className="text-xs text-muted-foreground">
              {sosAlerts.filter((a) => a.status === "open").length} open
            </span>
          }
        >
          {canReport && (
            <div className="mb-4 grid grid-cols-2 gap-2 sm:grid-cols-5">
              {SOS_BUTTONS.map(({ value, label, icon: Icon }) => (
                <button
                  key={value}
                  onClick={() => setSosCreateType(value)}
                  className="flex flex-col items-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs font-semibold text-rose-700 transition hover:bg-rose-100"
                >
                  <Icon className="h-5 w-5" />
                  {label}
                </button>
              ))}
            </div>
          )}

          <div className="space-y-2">
            {sosQuery.isLoading && (
              <p className="py-6 text-center text-sm text-muted-foreground">Loading SOS alerts...</p>
            )}
            {sosQuery.isError && (
              <p className="py-6 text-center text-sm text-rose-600">Could not load SOS alerts.</p>
            )}
            {!sosQuery.isLoading && sosAlerts.length === 0 && (
              <p className="py-6 text-center text-sm text-muted-foreground">No emergency alerts raised.</p>
            )}

            {sosAlerts.map((alert) => (
              <div key={alert.id} className="flex items-start gap-3 rounded-xl border border-border p-3">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-rose-50">
                  <AlertOctagon className="h-4.5 w-4.5 text-rose-600" />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${sosStatusColor(alert.status)}`}>
                      {alert.status_display}
                    </span>
                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      {alert.alert_type_display}
                    </span>
                    <span
                      className={`text-[10px] font-medium ${
                        alert.response_status === "responded" ? "text-emerald-600" : "text-amber-600"
                      }`}
                    >
                      {alert.response_status_display}
                    </span>
                  </div>
                  {alert.description && (
                    <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{alert.description}</p>
                  )}
                  <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-muted-foreground">
                    <span>{alert.sos_code}</span>
                    {alert.location && (
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="h-3 w-3" /> {alert.location}
                      </span>
                    )}
                    <span>
                      Raised by {alert.raised_by_name}
                      {alert.volunteer_id ? ` (${alert.volunteer_id})` : ""}
                    </span>
                    <span>{new Date(alert.created_at).toLocaleString()}</span>
                  </p>
                  {alert.resolution_notes && (
                    <p className="mt-1.5 rounded-lg bg-muted/60 p-2 text-xs text-foreground">
                      <span className="font-semibold">Admin response: </span>
                      {alert.resolution_notes}
                    </p>
                  )}
                </div>

                {canEditSOS(alert) && (
                  <div className="flex shrink-0 items-center gap-1.5">
                    <button
                      onClick={() => setSosEditing(alert)}
                      className="rounded-full border border-border p-1.5 hover:bg-muted"
                      title="Edit"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => setSosDeleting(alert)}
                      className="rounded-full border border-border p-1.5 text-rose-600 hover:bg-rose-50"
                      title="Delete"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </ChartCard>
      </div>

      {addOpen && (
        <IncidentReportModal
          mode="create"
          canManageStatus={isAdmin}
          onClose={() => setAddOpen(false)}
          onSaved={invalidate}
        />
      )}
      {editing && (
        <IncidentReportModal
          mode="edit"
          incident={editing}
          canManageStatus={isAdmin}
          onClose={() => setEditing(null)}
          onSaved={invalidate}
        />
      )}

      <ConfirmDialog
        open={!!deleting}
        onOpenChange={(open) => !open && setDeleting(null)}
        title="Delete incident report?"
        description={
          deleting ? `"${deleting.title}" (${deleting.incident_code}) will be permanently removed from the incident log.` : ""
        }
        loading={deleteBusy}
        onConfirm={handleDelete}
      />

      {sosCreateType && (
        <SOSAlertModal
          mode="create"
          initialAlertType={sosCreateType}
          canManageStatus={isAdmin}
          onClose={() => setSosCreateType(null)}
          onSaved={invalidateSOS}
        />
      )}
      {sosEditing && (
        <SOSAlertModal
          mode="edit"
          alert={sosEditing}
          canManageStatus={isAdmin}
          onClose={() => setSosEditing(null)}
          onSaved={invalidateSOS}
        />
      )}

      <ConfirmDialog
        open={!!sosDeleting}
        onOpenChange={(open) => !open && setSosDeleting(null)}
        title="Delete SOS alert?"
        description={
          sosDeleting ? `"${sosDeleting.sos_code}" (${sosDeleting.alert_type_display}) will be permanently removed.` : ""
        }
        loading={sosDeleteBusy}
        onConfirm={handleDeleteSOS}
      />
    </>
  );
}