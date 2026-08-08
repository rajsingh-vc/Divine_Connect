import { createFileRoute, redirect } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import {
  ClipboardList,
  Clock,
  CircleCheck,
  HelpCircle,
  Play,
  Check,
  ArrowLeftRight,
  X,
  UserCheck,
  ClipboardCheck,
} from "lucide-react";
import { toast } from "sonner";
import {
  getDuties,
  acceptDuty,
  startDuty,
  completeDuty,
  requestDutyHelp,
  getSwapCandidates,
  respondToSwap,
  type Duty,
  type SwapCandidate,
} from "@/api/duties";
import { useAuth } from "@/lib/auth-context";
import { PageHeader, ChartCard } from "@/components/admin/chart-card";
import { StatCard } from "@/components/admin/stat-card";
import { DataTable } from "@/components/admin/data-table";
import { StatusBadge } from "@/components/admin/badges";
import { cn } from "@/lib/utils";

// This route no longer renders anything itself — /admin/duties (inside the
// shared AdminShell) is now where every role, including volunteers, lands.
// TodaysDutiesDashboard below is kept (and exported) because it has the
// real accept/start/complete/swap logic; admin.duties.tsx renders it for
// volunteers instead of this route ever mounting it.
export const Route = createFileRoute("/volunteer/duties")({
  beforeLoad: () => {
    throw redirect({ to: "/admin/duties" });
  },
  component: () => null,
});

const STATUS_LABEL: Record<Duty["status"], string> = {
  assigned: "Pending",
  accepted: "Accepted",
  in_progress: "In Progress",
  completed: "Completed",
  help_requested: "Help Requested",
  swap_requested: "Swap Requested",
};

function formatTime(t: string | null) {
  if (!t) return "—";
  const [h, m] = t.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${hour12}:${String(m).padStart(2, "0")} ${period}`;
}

export function TodaysDutiesDashboard() {
  const [helpTarget, setHelpTarget] = useState<Duty | null>(null);
  const [busyId, setBusyId] = useState<number | null>(null);
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const today = new Date().toISOString().slice(0, 10);
  const q = useQuery({
    queryKey: ["myDuties", today],
    queryFn: () => getDuties({ duty_date: today }),
  });

  // Duties someone else wants to swap onto THIS volunteer — the backend
  // scopes this to duties I own plus duties where I'm the swap target, so
  // no date filter here (a swap could be offered for a duty on any date).
  const incomingSwaps = useQuery({
    queryKey: ["incomingSwaps"],
    queryFn: () => getDuties(),
  });

  // "My" duties today — excludes any row that only appears in this list
  // because someone else is offering ME a swap on it (that shows in the
  // separate table below instead).
  const myDutiesToday = (q.data ?? []).filter((d) => d.volunteer_name === user?.full_name);
  const incomingSwapRows = (incomingSwaps.data ?? []).filter(
    (d) => d.status === "swap_requested" && d.volunteer_name !== user?.full_name,
  );

  const pendingCount = myDutiesToday.filter(
    (d) => d.status === "assigned" || d.status === "accepted" || d.status === "in_progress",
  ).length;
  const completedCount = myDutiesToday.filter((d) => d.status === "completed").length;
  const helpSwapCount =
    myDutiesToday.filter((d) => d.status === "help_requested" || d.status === "swap_requested")
      .length + incomingSwapRows.length;

  function invalidate() {
    queryClient.invalidateQueries({ queryKey: ["myDuties"] });
    queryClient.invalidateQueries({ queryKey: ["incomingSwaps"] });
  }

  async function handleAccept(d: Duty) {
    setBusyId(d.id);
    try {
      await acceptDuty(d.id);
      toast.success(`"${d.title}" accepted.`);
      invalidate();
    } catch {
      toast.error("Could not accept this duty.");
    } finally {
      setBusyId(null);
    }
  }

  async function handleStart(d: Duty) {
    setBusyId(d.id);
    try {
      await startDuty(d.id);
      toast.success(`${d.title} started.`);
      invalidate();
    } catch {
      toast.error("Could not start this duty.");
    } finally {
      setBusyId(null);
    }
  }

  async function handleComplete(d: Duty) {
    setBusyId(d.id);
    try {
      await completeDuty(d.id);
      toast.success(`${d.title} marked complete. Admin has been notified.`);
      invalidate();
    } catch {
      toast.error("Could not complete this duty.");
    } finally {
      setBusyId(null);
    }
  }

  async function handleSwapResponse(d: Duty, action: "accept" | "decline") {
    setBusyId(d.id);
    try {
      await respondToSwap(d.id, action);
      toast.success(action === "accept" ? `You're now on "${d.title}".` : "Swap request declined.");
      invalidate();
    } catch {
      toast.error("Could not respond to this swap request.");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <>
      <PageHeader
        eyebrow="Volunteer"
        title="Today's Duties"
        subtitle="Accept, start, and complete your assigned duties — swap or ask for help anytime."
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="Today's Duties"
          value={String(myDutiesToday.length)}
          icon={ClipboardList}
          accent="amber"
          trend="flat"
        />
        <StatCard
          label="Pending"
          value={String(pendingCount)}
          icon={Clock}
          accent="sky"
          trend="flat"
        />
        <StatCard
          label="Completed"
          value={String(completedCount)}
          icon={CircleCheck}
          accent="emerald"
          trend="flat"
        />
        <StatCard
          label="Help / Swap"
          value={String(helpSwapCount)}
          icon={HelpCircle}
          accent="rose"
          trend="flat"
        />
      </div>

      <div className="mt-6">
        <ChartCard title="My duties today">
          <DataTable
            rows={myDutiesToday}
            loading={q.isLoading}
            empty="No duties assigned to you for today."
            columns={[
              {
                key: "duty_code",
                header: "ID",
                render: (r) => (
                  <span className="font-mono text-xs text-muted-foreground">{r.duty_code}</span>
                ),
              },
              {
                key: "title",
                header: "Title",
                render: (r) => (
                  <div>
                    <p className="font-medium text-foreground">{r.title}</p>
                    {r.instructions && (
                      <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">
                        {r.instructions}
                      </p>
                    )}
                    {r.status === "help_requested" && r.help_note && (
                      <p className="mt-0.5 text-xs text-amber-600">Help note: {r.help_note}</p>
                    )}
                    {r.status === "swap_requested" && r.swap_requested_with_name && (
                      <p className="mt-0.5 text-xs text-sky-600">
                        Swap sent to {r.swap_requested_with_name} — waiting for their response
                      </p>
                    )}
                  </div>
                ),
              },
              {
                key: "time",
                header: "Time",
                render: (r) => <span className="text-xs">{formatTime(r.time)}</span>,
              },
              {
                key: "location",
                header: "Location",
                render: (r) => <span className="text-xs">{r.location || "—"}</span>,
              },
              {
                key: "priority",
                header: "Priority",
                render: (r) => <span className="text-xs capitalize">{r.priority}</span>,
              },
              {
                key: "status",
                header: "Status",
                render: (r) => <StatusBadge status={STATUS_LABEL[r.status]} />,
              },
              {
                key: "act",
                header: "Actions",
                render: (r) => (
                  <div className="flex items-center gap-3">
                    {r.status === "assigned" && (
                      <button
                        disabled={busyId === r.id}
                        onClick={() => handleAccept(r)}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline disabled:opacity-50"
                      >
                        <ClipboardCheck className="h-3.5 w-3.5" /> Accept
                      </button>
                    )}
                    {(r.status === "accepted" || r.status === "in_progress") && (
                      <button
                        disabled={busyId === r.id}
                        onClick={() =>
                          r.status === "accepted" ? handleStart(r) : handleComplete(r)
                        }
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline disabled:opacity-50"
                      >
                        {r.status === "accepted" ? (
                          <Play className="h-3.5 w-3.5" />
                        ) : (
                          <Check className="h-3.5 w-3.5" />
                        )}
                        {r.status === "accepted" ? "Start" : "Complete"}
                      </button>
                    )}
                    {(r.status === "assigned" ||
                      r.status === "accepted" ||
                      r.status === "in_progress") && (
                      <button
                        onClick={() => setHelpTarget(r)}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-primary"
                      >
                        <ArrowLeftRight className="h-3.5 w-3.5" /> Swap / help
                      </button>
                    )}
                  </div>
                ),
              },
            ]}
          />
        </ChartCard>
      </div>

      {incomingSwapRows.length > 0 && (
        <div className="mt-6">
          <ChartCard title="Swap requests waiting on you">
            <DataTable
              rows={incomingSwapRows}
              empty="Nothing waiting on you."
              columns={[
                {
                  key: "duty_code",
                  header: "ID",
                  render: (r) => (
                    <span className="font-mono text-xs text-muted-foreground">{r.duty_code}</span>
                  ),
                },
                { key: "title", header: "Title" },
                { key: "volunteer_name", header: "Currently with" },
                {
                  key: "duty_date",
                  header: "Date",
                  render: (r) => new Date(r.duty_date).toLocaleDateString(),
                },
                {
                  key: "time",
                  header: "Time",
                  render: (r) => <span className="text-xs">{formatTime(r.time)}</span>,
                },
                {
                  key: "help_note",
                  header: "Note",
                  render: (r) => (
                    <span className="text-xs text-muted-foreground">{r.help_note || "—"}</span>
                  ),
                },
                {
                  key: "act",
                  header: "Actions",
                  render: (r) => (
                    <div className="flex items-center gap-3">
                      <button
                        disabled={busyId === r.id}
                        onClick={() => handleSwapResponse(r, "accept")}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline disabled:opacity-50"
                      >
                        <UserCheck className="h-3.5 w-3.5" /> Accept
                      </button>
                      <button
                        disabled={busyId === r.id}
                        onClick={() => handleSwapResponse(r, "decline")}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-rose-600 disabled:opacity-50"
                      >
                        <X className="h-3.5 w-3.5" /> Decline
                      </button>
                    </div>
                  ),
                },
              ]}
            />
          </ChartCard>
        </div>
      )}

      {helpTarget && (
        <HelpModal
          duty={helpTarget}
          onClose={() => setHelpTarget(null)}
          onSubmit={async (note, swapWithId) => {
            await requestDutyHelp(helpTarget.id, note, swapWithId ?? undefined);
            toast.success(
              swapWithId
                ? "Swap request sent — waiting for their response."
                : "Request sent — admin has been notified.",
            );
            invalidate();
            setHelpTarget(null);
          }}
        />
      )}
    </>
  );
}

function HelpModal({
  duty,
  onClose,
  onSubmit,
}: {
  duty: Duty;
  onClose: () => void;
  onSubmit: (note: string, swapWithId: number | null) => Promise<void>;
}) {
  const [note, setNote] = useState("");
  const [mode, setMode] = useState<"help" | "swap">("help");
  const [swapWithId, setSwapWithId] = useState<number | "">("");
  const [saving, setSaving] = useState(false);

  const candidatesQ = useQuery({
    queryKey: ["swapCandidates", duty.id],
    queryFn: () => getSwapCandidates(duty.id),
    enabled: mode === "swap",
  });

  const canSubmit = mode === "help" || (mode === "swap" && swapWithId !== "");

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 sm:items-center">
      <div className="w-full max-w-sm rounded-t-2xl bg-background p-5 shadow-xl sm:rounded-2xl">
        <h3 className="font-bold text-foreground">Need a swap or help?</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          "{duty.title}" — let us know what's going on.
        </p>

        <div className="mt-4 flex gap-2 rounded-full bg-muted p-1">
          <button
            onClick={() => setMode("help")}
            className={cn(
              "flex-1 rounded-full py-1.5 text-sm font-semibold transition-colors",
              mode === "help" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground",
            )}
          >
            Just need help
          </button>
          <button
            onClick={() => setMode("swap")}
            className={cn(
              "flex-1 rounded-full py-1.5 text-sm font-semibold transition-colors",
              mode === "swap" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground",
            )}
          >
            Swap with someone
          </button>
        </div>

        {mode === "swap" && (
          <div className="mt-3">
            <label className="text-xs font-semibold text-muted-foreground">Swap with</label>
            <select
              value={swapWithId}
              onChange={(e) => setSwapWithId(e.target.value ? Number(e.target.value) : "")}
              className="mt-1 w-full rounded-xl border border-border bg-background p-3 text-sm outline-none focus:border-primary"
            >
              <option value="">
                {candidatesQ.isLoading ? "Loading volunteers…" : "Select a volunteer"}
              </option>
              {(candidatesQ.data ?? []).map((c: SwapCandidate) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.volunteer_code})
                </option>
              ))}
            </select>
            {!candidatesQ.isLoading && (candidatesQ.data ?? []).length === 0 && (
              <p className="mt-1 text-xs text-muted-foreground">
                No other volunteers available to swap with right now.
              </p>
            )}
          </div>
        )}

        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={3}
          placeholder={
            mode === "swap"
              ? "Optional note for them (e.g. why you need to swap)"
              : "e.g. Running late, need someone to cover this duty"
          }
          className="mt-3 w-full rounded-xl border border-border bg-background p-3 text-sm outline-none focus:border-primary"
        />

        <div className="mt-4 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 rounded-full border border-border py-2 text-sm font-semibold"
          >
            Cancel
          </button>
          <button
            disabled={saving || !canSubmit}
            onClick={async () => {
              setSaving(true);
              try {
                await onSubmit(note, mode === "swap" ? (swapWithId as number) : null);
              } finally {
                setSaving(false);
              }
            }}
            className="flex-1 rounded-full bg-primary py-2 text-sm font-semibold text-primary-foreground disabled:opacity-50"
          >
            {mode === "swap" ? "Send swap request" : "Send request"}
          </button>
        </div>
      </div>
    </div>
  );
}