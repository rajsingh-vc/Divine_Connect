import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Clock, MapPin, Play, Check, ArrowLeftRight } from "lucide-react";
import { toast } from "sonner";
import { getDuties, startDuty, completeDuty, requestDutyHelp, type Duty } from "@/api/duties";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/volunteer/duties")({
  head: () => ({ meta: [{ title: "Today's Duties — Sansthan Console" }] }),
  component: TodaysDutiesPage,
});

type Tab = "assigned" | "completed" | "help";

const PRIORITY_STYLE: Record<Duty["priority"], { dot: string; badge: string }> = {
  high: { dot: "bg-amber-500", badge: "bg-amber-100 text-amber-700" },
  normal: { dot: "bg-orange-400", badge: "bg-orange-100 text-orange-600" },
  low: { dot: "bg-neutral-400", badge: "bg-neutral-200 text-neutral-600" },
};

function formatTime(t: string | null) {
  if (!t) return "—";
  const [h, m] = t.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${hour12}:${String(m).padStart(2, "0")} ${period}`;
}

function TodaysDutiesPage() {
  const [tab, setTab] = useState<Tab>("assigned");
  const [helpTarget, setHelpTarget] = useState<Duty | null>(null);
  const [busyId, setBusyId] = useState<number | null>(null);
  const queryClient = useQueryClient();

  const today = new Date().toISOString().slice(0, 10);
  const q = useQuery({
    queryKey: ["myDuties", today],
    queryFn: () => getDuties({ duty_date: today }),
  });

  const duties = q.data ?? [];
  const assigned = duties.filter((d) => d.status === "assigned" || d.status === "in_progress");
  const completed = duties.filter((d) => d.status === "completed");
  const help = duties.filter((d) => d.status === "help_requested");
  const doneCount = completed.length;

  function invalidate() {
    queryClient.invalidateQueries({ queryKey: ["myDuties"] });
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

  const list = tab === "assigned" ? assigned : tab === "completed" ? completed : help;

  return (
    <div className="mx-auto min-h-screen max-w-md bg-[#faf7f0] pb-24">
      <div className="px-5 pt-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-extrabold text-neutral-900">Today's Duties</h1>
          <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-500">
            {doneCount}/{duties.length} done
          </span>
        </div>

        <div className="mt-4 flex gap-2 rounded-full bg-white p-1 shadow-sm">
          {([
            ["assigned", `Assigned (${assigned.length})`],
            ["completed", `Completed (${completed.length})`],
            ["help", `Help (${help.length})`],
          ] as [Tab, string][]).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={cn(
                "flex-1 rounded-full py-2 text-sm font-semibold transition-colors",
                tab === key ? "bg-orange-400 text-white" : "text-neutral-500",
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-5 space-y-4 px-5">
        {q.isLoading && <p className="text-sm text-neutral-500">Loading duties…</p>}
        {!q.isLoading && list.length === 0 && (
          <p className="rounded-2xl bg-white p-6 text-center text-sm text-neutral-500 shadow-sm">
            Nothing here yet.
          </p>
        )}

        {list.map((d) => {
          const style = PRIORITY_STYLE[d.priority];
          return (
            <div key={d.id} className="rounded-2xl border border-orange-100 bg-white p-4 shadow-sm">
              <div className="flex items-start gap-3">
                <span className={cn("mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full", style.dot)} />
                <span
                  className={cn(
                    "mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full border",
                    d.status === "completed" ? "border-emerald-500 bg-emerald-500 text-white" : "border-neutral-300",
                  )}
                >
                  {d.status === "completed" && <Check className="h-3 w-3" strokeWidth={3} />}
                </span>
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-bold text-neutral-900">{d.title}</h3>
                    <span className={cn("shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold", style.badge)}>
                      {d.priority.charAt(0).toUpperCase() + d.priority.slice(1)}
                    </span>
                  </div>
                  <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-neutral-500">
                    <span className="inline-flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" /> {formatTime(d.time)}
                    </span>
                    {d.location && (
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5" /> {d.location}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {d.instructions && (
                <p className="mt-3 rounded-xl bg-orange-50/60 p-3 text-sm text-neutral-600">{d.instructions}</p>
              )}

              {d.status === "help_requested" && d.help_note && (
                <p className="mt-3 rounded-xl bg-amber-50 p-3 text-sm text-amber-700">Help note: {d.help_note}</p>
              )}

              {d.status !== "completed" && d.status !== "help_requested" && (
                <div className="mt-4 flex items-center gap-6">
                  <button
                    disabled={busyId === d.id}
                    onClick={() => (d.status === "assigned" ? handleStart(d) : handleComplete(d))}
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-orange-500 disabled:opacity-50"
                  >
                    {d.status === "assigned" ? <Play className="h-4 w-4" /> : <Check className="h-4 w-4" />}
                    {d.status === "assigned" ? "Start" : "Complete"}
                  </button>
                  <button
                    onClick={() => setHelpTarget(d)}
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-orange-500"
                  >
                    <ArrowLeftRight className="h-4 w-4" /> Swap / help
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {helpTarget && (
        <HelpModal
          duty={helpTarget}
          onClose={() => setHelpTarget(null)}
          onSubmit={async (note) => {
            await requestDutyHelp(helpTarget.id, note);
            toast.success("Request sent — admin has been notified.");
            invalidate();
            setHelpTarget(null);
          }}
        />
      )}
    </div>
  );
}

function HelpModal({ duty, onClose, onSubmit }: { duty: Duty; onClose: () => void; onSubmit: (note: string) => Promise<void> }) {
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 sm:items-center">
      <div className="w-full max-w-sm rounded-t-2xl bg-white p-5 sm:rounded-2xl">
        <h3 className="font-bold text-neutral-900">Need a swap or help?</h3>
        <p className="mt-1 text-sm text-neutral-500">"{duty.title}" — let the admin know what's going on.</p>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={3}
          placeholder="e.g. Running late, need someone to cover this duty"
          className="mt-3 w-full rounded-xl border border-neutral-200 p-3 text-sm outline-none focus:border-orange-400"
        />
        <div className="mt-4 flex gap-3">
          <button onClick={onClose} className="flex-1 rounded-full border border-neutral-200 py-2 text-sm font-semibold">
            Cancel
          </button>
          <button
            disabled={saving}
            onClick={async () => {
              setSaving(true);
              await onSubmit(note);
              setSaving(false);
            }}
            className="flex-1 rounded-full bg-orange-400 py-2 text-sm font-semibold text-white disabled:opacity-50"
          >
            Send request
          </button>
        </div>
      </div>
    </div>
  );
}