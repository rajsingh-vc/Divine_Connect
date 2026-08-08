// src/components/admin/EntryLogsTable.tsx
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { DataTable } from "@/components/admin/data-table";
import { getEntryLogs, type EntryLog } from "@/api/qr-checkin";
import { useAuth } from "@/lib/auth-context";
import { getManualCounterSummary, getManualCounterAdminList } from "@/api/manual-counter";

const POLL_MS = 10_000;

function todayISODate() {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

/** Shown above the log table when the "Manual" method filter is active —
 * surfaces the separate Manual Counter (+/-) feature's live numbers, since
 * that data doesn't live in Attendance/ScanHistory at all. */
function ManualCounterStatusStrip() {
  const { user } = useAuth();
  const isAdmin = user?.user_type === "admin";

  const volunteerSummary = useQuery({
    queryKey: ["manualCounterSummary"],
    queryFn: getManualCounterSummary,
    enabled: !isAdmin,
    refetchInterval: POLL_MS,
  });

  const adminToday = useQuery({
    queryKey: ["manualCounterAdminList", "today"],
    queryFn: () => getManualCounterAdminList({ date: todayISODate() }),
    enabled: isAdmin,
    refetchInterval: POLL_MS,
  });

  if (!isAdmin) {
    const s = volunteerSummary.data;
    return (
      <div className="mb-3 flex flex-wrap items-center gap-4 rounded-lg border border-border bg-muted/40 px-3 py-2 text-xs text-muted-foreground">
        <span className="font-semibold text-foreground">Manual Counter — your area</span>
        <span>
          Current:{" "}
          <span className="font-semibold text-foreground">
            {volunteerSummary.isLoading ? "–" : s?.currentManualCount ?? 0}
          </span>
        </span>
        <span>
          Today: +{s?.todayIncrement ?? 0} · -{s?.todayDecrement ?? 0}
        </span>
      </div>
    );
  }

  const rows = adminToday.data || [];
  const netToday = rows.reduce((sum, r) => sum + (r.action === "INCREMENT" ? r.count : -r.count), 0);
  const areasToday = new Set(rows.map((r) => r.assignedArea)).size;

  return (
    <div className="mb-3 flex flex-wrap items-center gap-4 rounded-lg border border-border bg-muted/40 px-3 py-2 text-xs text-muted-foreground">
      <span className="font-semibold text-foreground">Manual Counter — all areas, today</span>
      <span>
        Net entries: <span className="font-semibold text-foreground">{adminToday.isLoading ? "–" : netToday}</span>
      </span>
      <span>Areas active: {areasToday}</span>
    </div>
  );
}

export function EntryLogsTable() {
  const [checkType, setCheckType] = useState<string>("");
  const [scanMethod, setScanMethod] = useState<string>("");

  const logs = useQuery({
    queryKey: ["entryLogs", checkType, scanMethod],
    queryFn: () =>
      getEntryLogs({
        checkType: checkType || undefined,
        scanMethod: scanMethod || undefined,
      }),
    refetchInterval: POLL_MS,
  });

  const rows = logs.data || [];

  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm font-semibold text-foreground">Entry / Exit Log</p>
        <div className="flex gap-2">
          <select
            value={checkType}
            onChange={(e) => setCheckType(e.target.value)}
            className="rounded-lg border border-border bg-background px-2 py-1 text-xs"
          >
            <option value="">All</option>
            <option value="CHECK_IN">Check-in</option>
            <option value="CHECK_OUT">Check-out</option>
          </select>
          <select
            value={scanMethod}
            onChange={(e) => setScanMethod(e.target.value)}
            className="rounded-lg border border-border bg-background px-2 py-1 text-xs"
          >
            <option value="">All methods</option>
            <option value="QR">QR</option>
            <option value="MANUAL">Manual</option>
          </select>
        </div>
      </div>

      {scanMethod === "MANUAL" && (
        <div className="mt-3">
          <ManualCounterStatusStrip />
        </div>
      )}

      <div className="mt-3 max-h-96 overflow-y-auto pr-1">
        <DataTable
          rows={rows}
          columns={[
            {
              key: "devoteeName",
              header: "Devotee",
              render: (r: EntryLog) => <span className="font-medium">{r.devoteeName}</span>,
            },
            {
              key: "checkType",
              header: "Type",
              render: (r: EntryLog) => (
                <span
                  className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                    r.checkType === "CHECK_IN" ? "bg-emerald-50 text-emerald-700" : "bg-sky-50 text-sky-700"
                  }`}
                >
                  {r.checkType.replace("_", " ")}
                </span>
              ),
            },
            { key: "scanMethod", header: "Method" },
            { key: "bookingReference", header: "Booking Ref", render: (r: EntryLog) => r.bookingReference || "—" },
            { key: "location", header: "Location", render: (r: EntryLog) => r.location || "—" },
            {
              key: "timestamp",
              header: "Time",
              render: (r: EntryLog) => new Date(r.timestamp).toLocaleString("en-IN"),
            },
          ]}
        />
        {!logs.isLoading && rows.length === 0 && (
          <p className="py-6 text-center text-sm text-muted-foreground">No entries recorded yet.</p>
        )}
      </div>
    </div>
  );
}