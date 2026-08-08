import { useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Radio } from "lucide-react";
import { getLiveSevas, type LiveSeva } from "@/api";

// Sec.7 — reasonable polling interval; not excessive. 15s keeps the
// "06:00 PM -> LIVE" transition feeling near-real-time without hammering
// the API. Swap for the project's existing websocket/channel layer later
// if one already exists for this dashboard.
const POLL_INTERVAL_MS = 15_000;

export function LiveSevaWidget({ onView }: { onView?: (seva: LiveSeva) => void }) {
  const q = useQuery({
    queryKey: ["sevas-live"],
    queryFn: () => getLiveSevas(true),
    refetchInterval: POLL_INTERVAL_MS,
  });

  // Sec.8 — track previously-seen LIVE ids so the popup only fires on the
  // NOT LIVE -> LIVE transition, never repeatedly on every poll.
  const seenLiveIds = useRef<Set<number>>(new Set());
  const firstLoad = useRef(true);

  useEffect(() => {
    if (!q.data) return;
    const currentlyLive = q.data.filter((s) => s.status === "LIVE");
    const currentIds = new Set(currentlyLive.map((s) => s.id));

    if (!firstLoad.current) {
      for (const seva of currentlyLive) {
        if (!seenLiveIds.current.has(seva.id)) {
          toast(
            <div className="flex items-center gap-2">
              <span className="text-rose-500">🔴 LIVE SEVA</span>
              <span>{seva.name} is now LIVE.</span>
            </div>,
            {
              action: onView ? { label: "View Seva", onClick: () => onView(seva) } : undefined,
              duration: 8000,
            }
          );
        }
      }
    }
    firstLoad.current = false;
    seenLiveIds.current = currentIds;
  }, [q.data, onView]);

  const live = (q.data || []).filter((s) => s.status === "LIVE");
  const upcoming = (q.data || []).filter((s) => s.status === "UPCOMING");
  // Sec.6 — LIVE first, then upcoming; already sorted by start_time by the backend.
  const ordered = [...live, ...upcoming];

  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <div className="flex items-center gap-2">
        <Radio className="h-4 w-4 text-rose-500" />
        <h3 className="font-serif text-lg font-semibold">Live Seva</h3>
      </div>
      {ordered.length === 0 && <p className="mt-3 text-sm text-muted-foreground">No Seva is live right now.</p>}
      <div className="mt-3 space-y-2">
        {ordered.map((s) => (
          <button
            key={s.id}
            onClick={() => onView?.(s)}
            className="flex w-full items-center justify-between rounded-xl border border-border p-3 text-left hover:bg-muted"
          >
            <div>
              <p className="text-sm font-semibold">{s.name}</p>
              <p className="text-xs text-muted-foreground">
                {s.startDate} {s.startTime} → {s.endDate} {s.endTime}
              </p>
            </div>
            {s.status === "LIVE" ? (
              <span className="rounded-full bg-rose-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-rose-600">🔴 LIVE</span>
            ) : (
              <span className="rounded-full bg-amber-400/10 px-2.5 py-0.5 text-[11px] font-semibold text-amber-600">Upcoming</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}