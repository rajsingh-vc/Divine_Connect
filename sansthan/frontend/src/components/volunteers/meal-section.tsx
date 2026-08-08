import { useEffect, useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { QRCodeSVG } from "qrcode.react";
import { Html5Qrcode } from "html5-qrcode";
import { toast } from "sonner";
import { Plus, MapPin, Clock, ScanLine, QrCode, LogIn, LogOut, Users, Trash2, Hourglass, Smartphone, Camera } from "lucide-react";
import { ChartCard } from "@/components/admin/chart-card";
import { DataTable } from "@/components/admin/data-table";
import { usePermissions } from "@/lib/permissions";
import {
  createMealSession, getMealSessions, getMealCheckins, getMealStats,
  getMealSessionMyQr, getMealSessionGateQr, scanMeal, selfScanMeal, deleteMealSession,
  MEAL_NAME_OPTIONS,
  type MealSession, type MealSessionPayload, type MealCheckIn, type VolunteerMealStat, type MealName,
} from "@/api/meal";

export function MealSection() {
  const { isAdmin, isVolunteer } = usePermissions();

  if (!isAdmin && !isVolunteer) return null;

  return (
    <>
      {isAdmin && <AdminMealPanel />}
      {isVolunteer && <VolunteerScanPanel />}
    </>
  );
}

/* ------------------------------------------------------------------ */
/* ADMIN — creates sessions (gate + start/end time), scans volunteers'  */
/* personal QR codes at the gate (kiosk), views who checked in, views   */
/* scan stats, deletes sessions.                                        */
/* ------------------------------------------------------------------ */

function AdminMealPanel() {
  const [createOpen, setCreateOpen] = useState(false);
  const [kioskSession, setKioskSession] = useState<MealSession | null>(null);
  const [gateQrSession, setGateQrSession] = useState<MealSession | null>(null);
  const [checkinsSession, setCheckinsSession] = useState<MealSession | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<MealSession | null>(null);
  const queryClient = useQueryClient();

  const sessions = useQuery({
    queryKey: ["mealSessions"],
    queryFn: getMealSessions,
  });

  const stats = useQuery({ queryKey: ["mealStats"], queryFn: getMealStats });

  function invalidateSessions() {
    queryClient.invalidateQueries({ queryKey: ["mealSessions"] });
    queryClient.invalidateQueries({ queryKey: ["mealStats"] });
    queryClient.invalidateQueries({ queryKey: ["volunteerMealSessions"] }); // keep volunteer view in sync too
  }

  function invalidateCheckins(sessionId: number) {
    queryClient.invalidateQueries({ queryKey: ["mealCheckins", sessionId] });
    queryClient.invalidateQueries({ queryKey: ["mealStats"] });
  }

  async function handleDeleteSession(session: MealSession) {
    await deleteMealSession(session.id);
    toast.success(`"${session.location}" meal session deleted.`);
    invalidateSessions();
    setDeleteTarget(null);
    if (checkinsSession?.id === session.id) setCheckinsSession(null);
    if (kioskSession?.id === session.id) setKioskSession(null);
    if (gateQrSession?.id === session.id) setGateQrSession(null);
  }

  return (
    <div className="mt-6">
      <ChartCard
        title="Volunteer Meal — sessions"
        action={
          <button
            onClick={() => setCreateOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-full bg-foreground px-3 py-1.5 text-xs font-semibold text-background"
          >
            <Plus className="h-3.5 w-3.5" /> New meal session
          </button>
        }
      >
        {sessions.isLoading && (
          <p className="py-6 text-center text-sm text-muted-foreground">Loading meal sessions...</p>
        )}
        {!sessions.isLoading && (sessions.data ?? []).length === 0 && (
          <p className="py-6 text-center text-sm text-muted-foreground">No meal sessions created yet.</p>
        )}

        <div className="grid gap-3 sm:grid-cols-2">
          {(sessions.data ?? []).map((session) => (
            <div key={session.id} className="rounded-xl border border-border p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <MapPin className="h-4 w-4 text-primary" /> {session.location}
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">
                    {session.meal_name_display}
                  </span>
                  {session.is_open && (
                    <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                      Open
                    </span>
                  )}
                </div>
              </div>
              <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                <Clock className="h-3.5 w-3.5" />
                {new Date(session.start_time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} –{" "}
                {new Date(session.end_time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </p>
              <div className="mt-3 flex gap-2">
                <button
                  onClick={() => setKioskSession(session)}
                  disabled={!session.is_open}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-border py-1.5 text-xs font-semibold hover:bg-muted disabled:opacity-40"
                >
                  <ScanLine className="h-3.5 w-3.5" /> Scan
                </button>
                <button
                  onClick={() => setGateQrSession(session)}
                  disabled={!session.is_open}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-border py-1.5 text-xs font-semibold hover:bg-muted disabled:opacity-40"
                  title="Display a QR for volunteers to scan themselves"
                >
                  <Smartphone className="h-3.5 w-3.5" /> Gate QR
                </button>
                <button
                  onClick={() => setCheckinsSession(session)}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-foreground py-1.5 text-xs font-semibold text-background"
                >
                  <Users className="h-3.5 w-3.5" /> Check-ins
                </button>
                <button
                  onClick={() => setDeleteTarget(session)}
                  className="grid place-items-center rounded-lg border border-rose-200 px-2.5 text-rose-600 hover:bg-rose-50"
                  title="Delete session"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </ChartCard>

      <div className="mt-6">
        <ChartCard title="Volunteer Meal — scan activity">
          <DataTable
            rows={stats.data ?? []}
            loading={stats.isLoading}
            empty="No meal scans recorded yet."
            columns={[
              { key: "volunteer_name", header: "Volunteer" },
              {
                key: "total_scans",
                header: "Total scans",
                render: (r: VolunteerMealStat) => (
                  <span className="font-semibold text-primary">{r.total_scans}</span>
                ),
              },
              {
                key: "by_location",
                header: "Locations",
                render: (r: VolunteerMealStat) => (
                  <div className="flex flex-wrap gap-1.5">
                    {Object.entries(r.by_location).map(([loc, count]) => (
                      <span key={loc} className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium">
                        {loc}: {count}
                      </span>
                    ))}
                  </div>
                ),
              },
            ]}
          />
        </ChartCard>
      </div>

      {createOpen && (
        <MealSessionModal
          onClose={() => setCreateOpen(false)}
          onSubmit={async (payload) => {
            await createMealSession(payload);
            toast.success("Meal session created — volunteers have been notified.");
            invalidateSessions();
            setCreateOpen(false);
          }}
        />
      )}

      {kioskSession && (
        <KioskScanModal
          session={kioskSession}
          onClose={() => setKioskSession(null)}
          onScanned={() => invalidateCheckins(kioskSession.id)}
        />
      )}
      {gateQrSession && (
        <GateQRModal session={gateQrSession} onClose={() => setGateQrSession(null)} />
      )}
      {checkinsSession && (
        <CheckinsModal
          session={checkinsSession}
          onClose={() => setCheckinsSession(null)}
          onDelete={setDeleteTarget}
        />
      )}
      {deleteTarget && (
        <ConfirmDeleteModal
          title={deleteTarget.location}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={() => handleDeleteSession(deleteTarget)}
        />
      )}
    </div>
  );
}

/**
 * Kiosk scan screen for the admin/gate device. Runs the camera continuously —
 * each decoded volunteer QR is submitted immediately (no confirm step, since
 * this device scans many different volunteers back-to-back), shows a brief
 * result, then auto-resumes for the next person.
 */
function KioskScanModal({
  session,
  onClose,
  onScanned,
}: {
  session: MealSession;
  onClose: () => void;
  onScanned: () => void;
}) {
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const busyRef = useRef(false);
  const [result, setResult] = useState<MealCheckIn | null>(null);
  const [error, setError] = useState<string | null>(null);
  const elementId = "meal-kiosk-reader";

  useEffect(() => {
    const scanner = new Html5Qrcode(elementId);
    scannerRef.current = scanner;
    let stopped = false;

    scanner
      .start(
        { facingMode: "environment" },
        { fps: 10, qrbox: 240 },
        async (decodedText) => {
          if (stopped || busyRef.current) return;
          busyRef.current = true;
          await scanner.pause(true);
          try {
            const record = await scanMeal(decodedText);
            setResult(record);
            setError(null);
            onScanned();
          } catch (err: any) {
            setResult(null);
            setError(err?.response?.data?.detail || "Could not process this scan.");
          } finally {
            setTimeout(() => {
              if (stopped) return;
              setResult(null);
              setError(null);
              busyRef.current = false;
              scanner.resume();
            }, 2200);
          }
        },
        () => {},
      )
      .catch(() => setError("Could not access the camera. Check permissions and try again."));

    return () => {
      stopped = true;
      scanner.stop().catch(() => {});
    };
  }, [onScanned]);

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4" onClick={onClose}>
      <div className="w-full max-w-sm rounded-2xl bg-background p-5 shadow-xl" onClick={(e) => e.stopPropagation()}>
        <p className="text-[10px] font-semibold uppercase tracking-wide text-primary">{session.meal_name_display}</p>
        <h3 className="font-bold">{session.location} — kiosk scan</h3>
        <p className="text-xs text-muted-foreground">Point at each volunteer's QR to check them in / out.</p>

        <div className="relative mt-4">
          <div id={elementId} className="overflow-hidden rounded-xl" />

          {result && (
            <div className="absolute inset-0 grid place-items-center rounded-xl bg-background/95">
              <div className="text-center">
                <div
                  className={`mx-auto grid h-12 w-12 place-items-center rounded-full ${
                    result.status === "checked_in" ? "bg-emerald-100 text-emerald-700" : "bg-sky-100 text-sky-700"
                  }`}
                >
                  {result.status === "checked_in" ? <LogIn className="h-6 w-6" /> : <LogOut className="h-6 w-6" />}
                </div>
                <p className="mt-2 text-sm font-semibold">{result.volunteer_name}</p>
                <p className="text-xs text-muted-foreground">{result.volunteer_code}</p>
                <p className="mt-1 text-[10px] font-semibold uppercase tracking-wide text-primary">
                  {result.meal_name_display}
                </p>
                <p className="mt-1 text-xs font-semibold">
                  {result.status === "checked_in" ? "Checked in" : "Checked out"}
                </p>
              </div>
            </div>
          )}

          {error && (
            <div className="absolute inset-0 grid place-items-center rounded-xl bg-background/95">
              <p className="px-4 text-center text-sm text-rose-600">{error}</p>
            </div>
          )}
        </div>

        <button onClick={onClose} className="mt-4 w-full rounded-full border border-border py-2 text-xs font-semibold hover:bg-muted">
          Close
        </button>
      </div>
    </div>
  );
}

/**
 * Admin-facing "gate QR" — a session-level (not personal) QR meant to be
 * displayed on a tablet/poster at the food counter. Volunteers scan it with
 * their own phone to self check-in / check-out (see `SelfScanModal` below).
 * Polls for a fresh signed token before the current one expires, same
 * pattern as the volunteer's own `MyQRDisplay`.
 */
function GateQRModal({ session, onClose }: { session: MealSession; onClose: () => void }) {
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function refresh() {
      try {
        const data = await getMealSessionGateQr(session.id);
        if (cancelled) return;
        setToken(data.token);
        setError(null);
      } catch (err: any) {
        if (!cancelled) setError(err?.response?.data?.detail || "Could not load the gate QR.");
      }
    }
    refresh();
    const interval = setInterval(refresh, 10000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [session.id]);

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4" onClick={onClose}>
      <div className="w-full max-w-sm rounded-2xl bg-background p-5 shadow-xl" onClick={(e) => e.stopPropagation()}>
        <p className="text-[10px] font-semibold uppercase tracking-wide text-primary">{session.meal_name_display}</p>
        <h3 className="font-bold">{session.location} — gate QR</h3>
        <p className="text-xs text-muted-foreground">Display this screen at the counter. Volunteers scan it from the app to check themselves in / out.</p>

        <div className="mt-4 rounded-xl border border-border p-4 text-center">
          <div className="grid place-items-center">
            {error ? (
              <p className="py-16 text-sm text-rose-600">{error}</p>
            ) : token ? (
              <QRCodeSVG value={token} size={240} />
            ) : (
              <p className="py-16 text-sm text-muted-foreground">Loading...</p>
            )}
          </div>
          <p className="mt-2 text-[10px] text-muted-foreground">Refreshes automatically every few seconds.</p>
        </div>

        <button onClick={onClose} className="mt-4 w-full rounded-full border border-border py-2 text-xs font-semibold hover:bg-muted">
          Close
        </button>
      </div>
    </div>
  );
}

function CheckinsModal({
  session,
  onClose,
  onDelete,
}: {
  session: MealSession;
  onClose: () => void;
  onDelete: (session: MealSession) => void;
}) {
  const checkins = useQuery({
    queryKey: ["mealCheckins", session.id],
    queryFn: () => getMealCheckins(session.id),
  });

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4" onClick={onClose}>
      <div className="w-full max-w-lg rounded-2xl bg-background p-5 shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wide text-primary">{session.meal_name_display}</p>
            <h3 className="font-bold">{session.location} — check-ins</h3>
            <p className="text-xs text-muted-foreground">
              {new Date(session.start_time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} –{" "}
              {new Date(session.end_time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </p>
          </div>
          <button
            onClick={() => onDelete(session)}
            className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-rose-600 hover:bg-rose-50"
            title="Delete session"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-4 max-h-96 overflow-y-auto">
          <DataTable
            rows={checkins.data ?? []}
            loading={checkins.isLoading}
            empty="No one has checked in yet."
            columns={[
              { key: "volunteer_name", header: "Volunteer" },
              { key: "volunteer_code", header: "Code" },
              {
                key: "status",
                header: "Status",
                render: (r: MealCheckIn) => (
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                      r.status === "checked_in" ? "bg-emerald-100 text-emerald-700" : "bg-sky-100 text-sky-700"
                    }`}
                  >
                    {r.status === "checked_in" ? "Checked in" : "Checked out"}
                  </span>
                ),
              },
              {
                key: "check_in_time",
                header: "Check-in time",
                render: (r: MealCheckIn) =>
                  r.check_in_time
                    ? new Date(r.check_in_time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                    : "—",
              },
              { key: "scan_count", header: "Scans" },
            ]}
          />
        </div>

        <button onClick={onClose} className="mt-4 w-full rounded-full border border-border py-2 text-xs font-semibold hover:bg-muted">
          Close
        </button>
      </div>
    </div>
  );
}

function ConfirmDeleteModal({
  title,
  onCancel,
  onConfirm,
}: {
  title: string;
  onCancel: () => void;
  onConfirm: () => Promise<void>;
}) {
  const [deleting, setDeleting] = useState(false);

  async function handleConfirm() {
    setDeleting(true);
    try {
      await onConfirm();
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[60] grid place-items-center bg-black/60 p-4" onClick={onCancel}>
      <div className="w-full max-w-sm rounded-2xl bg-background p-5 shadow-xl" onClick={(e) => e.stopPropagation()}>
        <h3 className="font-bold">Delete meal session?</h3>
        <p className="mt-1 text-xs text-muted-foreground">
          "{title}" and all of its check-in records will be permanently removed. This can't be undone.
        </p>
        <div className="mt-5 flex justify-end gap-2">
          <button onClick={onCancel} className="rounded-full border border-border px-4 py-1.5 text-sm">
            Cancel
          </button>
          <button
            disabled={deleting}
            onClick={handleConfirm}
            className="rounded-full bg-rose-600 px-4 py-1.5 text-sm font-semibold text-white disabled:opacity-50"
          >
            {deleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

function MealSessionModal({
  onClose,
  onSubmit,
}: {
  onClose: () => void;
  onSubmit: (payload: MealSessionPayload) => Promise<void>;
}) {
  const [mealName, setMealName] = useState<MealName>("lunch");
  const [location, setLocation] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await onSubmit({ meal_name: mealName, location, start_time: startTime, end_time: endTime, is_active: true });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4" onClick={onClose}>
      <form onSubmit={handleSubmit} className="w-full max-w-sm rounded-2xl bg-background p-5 shadow-xl" onClick={(e) => e.stopPropagation()}>
        <h3 className="font-bold">New meal session</h3>
        <p className="mt-1 text-xs text-muted-foreground">Volunteers will be notified once created.</p>

        <label className="mt-3 block text-xs font-medium text-muted-foreground">Meal</label>
        <select
          required
          value={mealName}
          onChange={(e) => setMealName(e.target.value as MealName)}
          className="mt-1 w-full rounded-lg border border-border bg-background p-2 text-sm"
        >
          {MEAL_NAME_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        <label className="mt-3 block text-xs font-medium text-muted-foreground">Location / Zone</label>
        <input
          required
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="e.g. Gate 3"
          className="mt-1 w-full rounded-lg border border-border bg-background p-2 text-sm"
        />

        <label className="mt-3 block text-xs font-medium text-muted-foreground">Start time</label>
        <input
          required
          type="datetime-local"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          className="mt-1 w-full rounded-lg border border-border bg-background p-2 text-sm"
        />

        <label className="mt-3 block text-xs font-medium text-muted-foreground">End time</label>
        <input
          required
          type="datetime-local"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
          className="mt-1 w-full rounded-lg border border-border bg-background p-2 text-sm"
        />

        <div className="mt-5 flex justify-end gap-2">
          <button type="button" onClick={onClose} className="rounded-full border border-border px-4 py-1.5 text-sm">
            Cancel
          </button>
          <button disabled={saving} className="rounded-full bg-foreground px-4 py-1.5 text-sm font-semibold text-background disabled:opacity-50">
            {saving ? "Creating..." : "Create"}
          </button>
        </div>
      </form>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* VOLUNTEER —                                                          */
/*                                                                      */
/*   Dashboard -> Click "My QR" -> fetch the session -> show its        */
/*   details (meal name/venue/time) -> branch on status:                */
/*     Upcoming -> "Meal not started yet"                               */
/*     Active   -> show the volunteer's own personal QR, auto-          */
/*                 refreshing, for the gate's kiosk to scan             */
/* ------------------------------------------------------------------ */

type SessionPhase = "upcoming" | "active" | "ended";

function getSessionPhase(session: MealSession, now: Date): SessionPhase {
  const start = new Date(session.start_time);
  const end = new Date(session.end_time);
  if (now < start) return "upcoming";
  if (now > end) return "ended";
  return "active";
}

function VolunteerScanPanel() {
  const allSessions = useQuery({
    queryKey: ["volunteerMealSessions"],
    queryFn: getMealSessions,
    refetchInterval: 15000,
  });

  const now = new Date();
  const visibleSessions = (allSessions.data ?? [])
    .filter((s) => getSessionPhase(s, now) !== "ended") // hide sessions that have already ended
    .sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime());

  return (
    <div className="mt-6">
      <ChartCard title="Volunteer Meal">
        {allSessions.isLoading && (
          <p className="py-6 text-center text-sm text-muted-foreground">Checking for meal sessions...</p>
        )}
        {!allSessions.isLoading && visibleSessions.length === 0 && (
          <p className="py-6 text-center text-sm text-muted-foreground">No meal session is scheduled right now.</p>
        )}

        <div className="grid gap-3 sm:grid-cols-2">
          {visibleSessions.map((session) => {
            const phase = getSessionPhase(session, now);
            return (
              <div key={session.id} className="rounded-xl border border-border p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm font-semibold">
                    <MapPin className="h-4 w-4 text-primary" /> {session.location}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">
                      {session.meal_name_display}
                    </span>
                    {phase === "upcoming" ? (
                      <span className="flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-700">
                        <Hourglass className="h-3 w-3" /> Upcoming
                      </span>
                    ) : (
                      <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                        Open
                      </span>
                    )}
                  </div>
                </div>
                <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Clock className="h-3.5 w-3.5" />
                  {new Date(session.start_time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} –{" "}
                  {new Date(session.end_time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </p>
                <VolunteerQRButton session={session} />
              </div>
            );
          })}
        </div>
      </ChartCard>
    </div>
  );
}

function VolunteerQRButton({ session }: { session: MealSession }) {
  const [open, setOpen] = useState(false);
  const [scanOpen, setScanOpen] = useState(false);
  const queryClient = useQueryClient();
  const phase = getSessionPhase(session, new Date());

  return (
    <>
      <div className="mt-3 flex gap-2">
        <button
          onClick={() => setOpen(true)}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-foreground py-1.5 text-xs font-semibold text-background"
        >
          <QrCode className="h-3.5 w-3.5" /> My QR
        </button>
        <button
          onClick={() => setScanOpen(true)}
          disabled={phase !== "active"}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-border py-1.5 text-xs font-semibold hover:bg-muted disabled:opacity-40"
          title="Scan the QR displayed at the gate"
        >
          <Camera className="h-3.5 w-3.5" /> Scan QR
        </button>
      </div>
      {open && <MealQRFlowModal sessionId={session.id} onClose={() => setOpen(false)} />}
      {scanOpen && (
        <SelfScanModal
          session={session}
          onClose={() => setScanOpen(false)}
          onScanned={() => {
            queryClient.invalidateQueries({ queryKey: ["volunteerMealSessions"] });
          }}
        />
      )}
    </>
  );
}

/**
 * Volunteer-facing self-scan — the volunteer points their own camera at the
 * gate QR the admin's kiosk/tablet is displaying (see `GateQRModal`). Since
 * the QR only identifies the session/window (not a person), the check-in is
 * recorded against whichever volunteer account is logged in on this device.
 * On success it shows the meal details the admin filled in when the session
 * was created (meal name, location) plus the resulting status.
 */
function SelfScanModal({
  session,
  onClose,
  onScanned,
}: {
  session: MealSession;
  onClose: () => void;
  onScanned: () => void;
}) {
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const busyRef = useRef(false);
  const [result, setResult] = useState<MealCheckIn | null>(null);
  const [error, setError] = useState<string | null>(null);
  const elementId = "meal-self-scan-reader";

  useEffect(() => {
    const scanner = new Html5Qrcode(elementId);
    scannerRef.current = scanner;
    let stopped = false;

    scanner
      .start(
        { facingMode: "environment" },
        { fps: 10, qrbox: 240 },
        async (decodedText) => {
          if (stopped || busyRef.current) return;
          busyRef.current = true;
          await scanner.pause(true);
          try {
            const record = await selfScanMeal(decodedText);
            setResult(record);
            setError(null);
            onScanned();
          } catch (err: any) {
            setResult(null);
            setError(err?.response?.data?.detail || "Could not process this scan.");
          } finally {
            setTimeout(() => {
              if (stopped) return;
              setResult(null);
              setError(null);
              busyRef.current = false;
              scanner.resume();
            }, 2200);
          }
        },
        () => {},
      )
      .catch(() => setError("Could not access the camera. Check permissions and try again."));

    return () => {
      stopped = true;
      scanner.stop().catch(() => {});
    };
  }, [onScanned]);

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4" onClick={onClose}>
      <div className="w-full max-w-sm rounded-2xl bg-background p-5 shadow-xl" onClick={(e) => e.stopPropagation()}>
        <p className="text-[10px] font-semibold uppercase tracking-wide text-primary">{session.meal_name_display}</p>
        <h3 className="font-bold">{session.location} — scan gate QR</h3>
        <p className="text-xs text-muted-foreground">Point your camera at the QR shown at the counter.</p>

        <div className="relative mt-4">
          <div id={elementId} className="overflow-hidden rounded-xl" />

          {result && (
            <div className="absolute inset-0 grid place-items-center rounded-xl bg-background/95">
              <div className="text-center">
                <div
                  className={`mx-auto grid h-12 w-12 place-items-center rounded-full ${
                    result.status === "checked_in" ? "bg-emerald-100 text-emerald-700" : "bg-sky-100 text-sky-700"
                  }`}
                >
                  {result.status === "checked_in" ? <LogIn className="h-6 w-6" /> : <LogOut className="h-6 w-6" />}
                </div>
                <p className="mt-2 text-sm font-semibold">{result.meal_name_display}</p>
                <p className="text-xs text-muted-foreground">{result.location}</p>
                <p className="mt-1 text-xs font-semibold">
                  {result.status === "checked_in" ? "Checked in" : "Checked out"}
                </p>
              </div>
            </div>
          )}

          {error && (
            <div className="absolute inset-0 grid place-items-center rounded-xl bg-background/95">
              <p className="px-4 text-center text-sm text-rose-600">{error}</p>
            </div>
          )}
        </div>

        <button onClick={onClose} className="mt-4 w-full rounded-full border border-border py-2 text-xs font-semibold hover:bg-muted">
          Close
        </button>
      </div>
    </div>
  );
}

/**
 * Click "My QR" -> fetch the session fresh -> show meal details -> branch on
 * status (Upcoming / Active / Ended) -> if Active, show the volunteer's own
 * personal QR, auto-refreshing, for the gate kiosk to scan.
 */
function MealQRFlowModal({ sessionId, onClose }: { sessionId: number; onClose: () => void }) {
  const [session, setSession] = useState<MealSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      try {
        const sessions = await getMealSessions();
        const match = sessions.find((s) => s.id === sessionId) ?? null;
        if (cancelled) return;
        if (!match) {
          setLoadError("This meal session is no longer available.");
        } else {
          setSession(match);
          setLoadError(null);
        }
      } catch {
        if (!cancelled) setLoadError("Could not load this meal session. Try again.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [sessionId]);

  const phase = session ? getSessionPhase(session, new Date()) : null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4" onClick={onClose}>
      <div className="w-full max-w-sm rounded-2xl bg-background p-5 shadow-xl" onClick={(e) => e.stopPropagation()}>
        <h3 className="font-bold">Meal check-in</h3>

        {loading && <p className="py-8 text-center text-sm text-muted-foreground">Loading meal session...</p>}

        {!loading && loadError && <p className="py-8 text-center text-sm text-rose-600">{loadError}</p>}

        {!loading && session && (
          <div className="mt-3 rounded-xl border border-border p-4">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-primary">{session.meal_name_display}</p>
            <div className="flex items-center gap-2 text-sm font-semibold">
              <MapPin className="h-4 w-4 text-primary" /> {session.location}
            </div>
            <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
              <Clock className="h-3.5 w-3.5" />
              {new Date(session.start_time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} –{" "}
              {new Date(session.end_time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </p>
            <p className="mt-1 text-[10px] uppercase tracking-wide text-muted-foreground">{session.session_code}</p>
          </div>
        )}

        {!loading && session && phase === "upcoming" && (
          <div className="mt-4 rounded-xl bg-amber-50 p-4 text-center">
            <Hourglass className="mx-auto h-6 w-6 text-amber-600" />
            <p className="mt-2 text-sm font-semibold text-amber-800">Meal not started yet</p>
            <p className="mt-1 text-xs text-amber-700">
              Check-in opens at{" "}
              {new Date(session.start_time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}.
            </p>
          </div>
        )}

        {!loading && session && phase === "ended" && (
          <div className="mt-4 rounded-xl bg-muted p-4 text-center">
            <p className="text-sm font-semibold">This meal session has ended.</p>
          </div>
        )}

        {!loading && session && phase === "active" && <MyQRDisplay sessionId={session.id} />}

        <button onClick={onClose} className="mt-4 w-full rounded-full border border-border py-2 text-xs font-semibold hover:bg-muted">
          Close
        </button>
      </div>
    </div>
  );
}

/**
 * The volunteer's own personal QR, nested inside MealQRFlowModal. Polls for
 * a fresh signed token before the current one expires (10s poll, 15s TTL)
 * so the code on screen is never stale when the kiosk reads it.
 */
function MyQRDisplay({ sessionId }: { sessionId: number }) {
  const [token, setToken] = useState<string | null>(null);
  const [volunteerCode, setVolunteerCode] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function refresh() {
      try {
        const data = await getMealSessionMyQr(sessionId);
        if (cancelled) return;
        setToken(data.token);
        setVolunteerCode(data.volunteer_code);
        setError(null);
      } catch (err: any) {
        if (!cancelled) setError(err?.response?.data?.detail || "Could not load your QR code.");
      }
    }
    refresh();
    const interval = setInterval(refresh, 10000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [sessionId]);

  if (error) {
    return (
      <div className="mt-4 rounded-xl bg-rose-50 p-4 text-center">
        <p className="text-sm text-rose-700">{error}</p>
      </div>
    );
  }

  return (
    <div className="mt-4 rounded-xl border border-border p-4 text-center">
      <p className="text-xs text-muted-foreground">Show this to the scanner at the gate</p>
      <div className="mt-3 grid place-items-center">
        {token ? <QRCodeSVG value={token} size={220} /> : <p className="py-16 text-sm text-muted-foreground">Loading...</p>}
      </div>
      {volunteerCode && <p className="mt-2 text-xs font-semibold">{volunteerCode}</p>}
      <p className="mt-1 text-[10px] text-muted-foreground">Refreshes automatically — do not screenshot, it expires in seconds.</p>
    </div>
  );
}