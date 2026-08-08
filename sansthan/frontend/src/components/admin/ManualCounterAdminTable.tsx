// components/admin/ManualCounterAdminTable.tsx — FULL FILE
import { useQuery } from "@tanstack/react-query";
import { ChartCard } from "@/components/admin/chart-card";
import { DataTable } from "@/components/admin/data-table";
import { getManualCounterAdminList, type ManualCounterLogEntry } from "@/api/manual-counter";

const LIST_POLL_MS = 15_000;

function ActionBadge({ action }: { action: ManualCounterLogEntry["action"] }) {
  const isIncrement = action === "INCREMENT";
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
        isIncrement
          ? "border-emerald-200 bg-emerald-50 text-emerald-700"
          : "border-rose-200 bg-rose-50 text-rose-700"
      }`}
    >
      {isIncrement ? "+" : "–"} {isIncrement ? "Increment" : "Decrement"}
    </span>
  );
}

function formatTimestamp(iso: string) {
  return new Date(iso).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/** Admin-only — GET /api/manual-counter/admin/ enforces IsAdminUser server-side. */
export function ManualCounterAdminTable() {
  const logs = useQuery({
    queryKey: ["manualCounterAdminList"],
    queryFn: () => getManualCounterAdminList(),
    refetchInterval: LIST_POLL_MS,
  });

  const rows = logs.data || [];

  return (
    <ChartCard title="Manual Counter — Volunteer Entries">
      <div className="max-h-96 overflow-y-auto pr-1">
        <DataTable
          rows={rows}
          columns={[
            { key: "volunteerName", header: "Volunteer", render: (r) => r.volunteerName || "—" },
            { key: "assignedArea", header: "Area" },
            { key: "action", header: "Action", render: (r) => <ActionBadge action={r.action} /> },
            { key: "count", header: "Count" },
            { key: "reason", header: "Reason", render: (r) => r.reason || "—" },
            { key: "timestamp", header: "Timestamp", render: (r) => formatTimestamp(r.timestamp) },
          ]}
        />
      </div>
      {!logs.isLoading && rows.length === 0 && (
        <p className="py-6 text-center text-sm text-muted-foreground">No manual counter entries yet.</p>
      )}
    </ChartCard>
  );
}