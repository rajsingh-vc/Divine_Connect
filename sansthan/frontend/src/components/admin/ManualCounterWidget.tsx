// components/admin/ManualCounterWidget.tsx — FULL FILE
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Minus, Plus, Users2 } from "lucide-react";
import { ChartCard } from "@/components/admin/chart-card";
import {
  getManualCounterSummary,
  postManualCounterAction,
  type ManualCounterAction,
} from "@/api/manual-counter";

// Summary is polled, same idea as the crowd-status areas poll — it should
// feel live even though it's driven by button presses, not a stream.
const SUMMARY_POLL_MS = 10_000;

const REASON_SUGGESTIONS = ["Senior Citizen", "Family Entry", "QR Not Working", "VIP Entry", "Walk-in"];

export function ManualCounterWidget() {
  const queryClient = useQueryClient();
  const [reason, setReason] = useState("");

  const summary = useQuery({
    queryKey: ["manualCounterSummary"],
    queryFn: getManualCounterSummary,
    refetchInterval: SUMMARY_POLL_MS,
  });

  const mutation = useMutation({
    mutationFn: postManualCounterAction,
    onSuccess: (data, variables) => {
      // Reflect the new total immediately, then reconcile with the server
      // on the next poll — keeps the button feel snappy.
      queryClient.setQueryData(["manualCounterSummary"], (prev: any) =>
        prev ? { ...prev, currentManualCount: data.currentManualCount } : prev,
      );
      queryClient.invalidateQueries({ queryKey: ["manualCounterSummary"] });
      queryClient.invalidateQueries({ queryKey: ["manualCounterAdminList"] });
      const verb = variables.action === "increment" ? "added" : "removed";
      toast.success(`1 devotee ${verb} manually.`);
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.message || "Could not update the manual count.";
      toast.error(msg);
    },
  });

  function handlePress(action: ManualCounterAction) {
    mutation.mutate({ action, count: 1, reason: reason.trim() });
  }

  const count = summary.data?.currentManualCount ?? 0;
  const busy = mutation.isPending;
  const canDecrement = count > 0 && !busy;

  return (
    <ChartCard title="Manual Counter">
      <div className="flex flex-col items-center gap-4 py-2">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          <Users2 className="h-3.5 w-3.5" />
          Current Manual Count
        </div>
        <p className="font-serif text-5xl font-semibold tabular-nums text-foreground">
          {summary.isLoading ? "–" : count}
        </p>

        <div className="flex w-full items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => handlePress("decrement")}
            disabled={!canDecrement}
            className="grid h-16 w-16 place-items-center rounded-full border-2 border-rose-200 bg-rose-50 text-rose-600 transition hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Decrease manual count"
          >
            <Minus className="h-7 w-7" />
          </button>
          <button
            type="button"
            onClick={() => handlePress("increment")}
            disabled={busy}
            className="grid h-16 w-16 place-items-center rounded-full border-2 border-emerald-200 bg-emerald-50 text-emerald-600 transition hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Increase manual count"
          >
            <Plus className="h-7 w-7" />
          </button>
        </div>

        <div className="w-full">
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Reason (Optional)
          </label>
          <input
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="e.g. QR Not Working"
            list="manual-counter-reasons"
            className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
          />
          <datalist id="manual-counter-reasons">
            {REASON_SUGGESTIONS.map((r) => (
              <option key={r} value={r} />
            ))}
          </datalist>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {REASON_SUGGESTIONS.map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setReason(r)}
                className={`rounded-full border px-2.5 py-1 text-[11px] font-medium transition ${
                  reason === r
                    ? "border-foreground bg-foreground text-background"
                    : "border-border text-muted-foreground hover:bg-muted"
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {!summary.isLoading && (
          <p className="text-xs text-muted-foreground">
            Today: +{summary.data?.todayIncrement ?? 0} · -{summary.data?.todayDecrement ?? 0}
          </p>
        )}
      </div>
    </ChartCard>
  );
}