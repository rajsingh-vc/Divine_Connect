import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState, type FormEvent, type ReactNode } from "react";
import { CalendarCheck, Clock, CheckCircle2, XCircle, Filter, Download, Search, Plus, User, X, Trash2 } from "lucide-react";
import { toast } from "sonner";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { PageHeader, ChartCard } from "@/components/admin/chart-card";
import { StatCard } from "@/components/admin/stat-card";
import { DataTable } from "@/components/admin/data-table";
import { StatusBadge } from "@/components/admin/badges";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { getBookings, getSevas, getDevotees, createBooking, deleteBooking, type BookingPayload } from "@/api";
import { cn } from "@/lib/utils";

type BookingRow = Awaited<ReturnType<typeof getBookings>>[number];

export const Route = createFileRoute("/admin/bookings")({
  head: () => ({ meta: [{ title: "Booking Management — Sansthan Console" }] }),
  component: () => {
    const q = useQuery({ queryKey: ["bookings"], queryFn: getBookings });
    // Sevas catalogue, shared with the "Sevas & Services" page — any seva
    // created/edited there shows up here immediately (react-query cache is
    // keyed the same as ["sevas"], and this list is refetched on mount).
    const sevasQ = useQuery({ queryKey: ["sevas"], queryFn: getSevas });
    const queryClient = useQueryClient();
    const [view, setView] = useState<"List" | "Calendar" | "Day view">("List");
    const [viewing, setViewing] = useState<BookingRow | null>(null);
    const [addOpen, setAddOpen] = useState(false);
    const [deleting, setDeleting] = useState<BookingRow | null>(null);
    const [deleteBusy, setDeleteBusy] = useState(false);

    const bookings = q.data || [];

    // ---- Dynamic stats (replaces the old hardcoded 1,284 / 42 / 1,180 / 62) ----
    const todayStr = new Date().toISOString().slice(0, 10);
    const todaysCount = bookings.filter((b) => b.date === todayStr).length;
    const awaitingCount = bookings.filter((b) => b.rawStatus === "pending").length;
    const confirmedCount = bookings.filter((b) => b.rawStatus === "confirmed").length;
    const cancelledCount = bookings.filter((b) => b.rawStatus === "cancelled").length;

    function invalidate() {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    }

    async function handleDelete() {
      if (!deleting) return;
      setDeleteBusy(true);
      try {
        await deleteBooking(deleting._id);
        toast.success(`Booking ${deleting.id} removed.`);
        invalidate();
        setDeleting(null);
      } catch (err: any) {
        toast.error(err?.response?.data?.detail || "Could not remove this booking.");
      } finally {
        setDeleteBusy(false);
      }
    }

    function handleExportPdf() {
      if (bookings.length === 0) {
        toast.error("No bookings to export.");
        return;
      }
      const doc = new jsPDF();
      doc.setFontSize(14);
      doc.text("Booking Management — Sansthan", 14, 16);
      doc.setFontSize(9);
      doc.setTextColor(120);
      doc.text(`Generated ${new Date().toLocaleString("en-IN")} · ${bookings.length} bookings`, 14, 22);
      autoTable(doc, {
        startY: 28,
        head: [["ID", "Devotee", "Seva", "Date", "Slot", "Amount", "Channel", "Payment ID", "Status"]],
        body: bookings.map((b) => [b.id, b.devotee, b.seva, b.date, b.slot, b.amount, b.channel, b.paymentId || "—", b.status]),
        styles: { fontSize: 8, cellPadding: 3 },
        headStyles: { fillColor: [180, 83, 9] },
        alternateRowStyles: { fillColor: [250, 245, 235] },
      });
      doc.save(`bookings-${todayStr}.pdf`);
      toast.success("Bookings exported as PDF.");
    }

    return (
      <>
        <PageHeader eyebrow="Operations" title="Booking Management" subtitle="Approve, reschedule, cancel and manage the entire booking pipeline." />
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCard label="Today's Bookings" value={String(todaysCount)} icon={CalendarCheck} accent="amber" trend="flat" />
          <StatCard label="Awaiting Approval" value={String(awaitingCount)} icon={Clock} accent="amber" trend="flat" />
          <StatCard label="Confirmed" value={String(confirmedCount)} icon={CheckCircle2} accent="emerald" trend="flat" />
          <StatCard label="Cancelled" value={String(cancelledCount)} icon={XCircle} accent="rose" trend="flat" />
        </div>
        <div className="mt-6 flex gap-1 rounded-full border border-border bg-card p-1 w-fit">
          {(["List", "Calendar", "Day view"] as const).map((v) => (
            <button key={v} onClick={() => setView(v)} className={cn("rounded-full px-4 py-1.5 text-sm font-medium", view === v ? "bg-foreground text-background" : "text-muted-foreground")}>{v}</button>
          ))}
        </div>
        <div className="mt-4">
          <ChartCard title="All bookings" action={
            <div className="flex items-center gap-2">
              <div className="relative hidden sm:block">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                <input placeholder="Search..." className="rounded-full border border-border bg-background py-1.5 pl-9 pr-3 text-sm outline-none" />
              </div>
              <button className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs font-medium hover:bg-muted"><Filter className="h-3.5 w-3.5" /> Filter</button>
              <button onClick={handleExportPdf} className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs font-medium hover:bg-muted"><Download className="h-3.5 w-3.5" /> Export</button>
              <button
                onClick={() => setAddOpen(true)}
                className="inline-flex items-center gap-1.5 rounded-full bg-foreground px-3 py-1.5 text-xs font-semibold text-background"
              >
                <Plus className="h-3.5 w-3.5" /> New Booking
              </button>
            </div>
          }>
            {view === "List" ? (
              <DataTable rows={bookings} empty={q.isLoading ? "Loading..." : "No bookings found."} columns={[
                { key: "id", header: "ID", render: (r) => <span className="font-mono text-xs text-muted-foreground">{r.id}</span> },
                { key: "devotee", header: "Devotee" },
                { key: "seva", header: "Seva" },
                { key: "date", header: "Date" },
                { key: "slot", header: "Slot" },
                { key: "amount", header: "Amount", render: (r) => <span className="font-semibold">{r.amount}</span> },
                { key: "channel", header: "Channel" },
                { key: "paymentId", header: "Payment ID", render: (r) => r.paymentId ? <span className="font-mono text-xs text-muted-foreground">{r.paymentId}</span> : <span className="text-xs text-muted-foreground">—</span> },
                { key: "status", header: "Status", render: (r) => <StatusBadge status={r.status} /> },
                { key: "act", header: "", render: (r) => <button onClick={() => setViewing(r)} className="text-xs font-semibold text-primary hover:underline">View</button> },
                { key: "remove", header: "", render: (r) => (
                  <button
                    onClick={() => setDeleting(r)}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-rose-600 hover:underline"
                    title="Remove booking"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                ) },
              ]} />
            ) : (
              <p className="py-16 text-center text-sm text-muted-foreground">{view} coming soon</p>
            )}
          </ChartCard>
        </div>

        {viewing && <BookingViewModal booking={viewing} onClose={() => setViewing(null)} />}

        <ConfirmDialog
          open={!!deleting}
          onOpenChange={(open) => !open && setDeleting(null)}
          title="Remove this booking?"
          description={deleting ? `This will permanently remove booking ${deleting.id} for ${deleting.devotee}. This cannot be undone.` : ""}
          loading={deleteBusy}
          onConfirm={handleDelete}
        />

        {addOpen && (
          <BookingFormModal
            sevas={sevasQ.data || []}
            onClose={() => setAddOpen(false)}
            onSubmit={async (payload) => {
              await createBooking(payload);
              toast.success("Booking created.");
              invalidate();
              setAddOpen(false);
            }}
          />
        )}
      </>
    );
  },
});

function BookingViewModal({ booking, onClose }: { booking: BookingRow; onClose: () => void }) {
  const rows: [string, string][] = [
    ["Booking ID", booking.id],
    ["Devotee", booking.devotee],
    ["Seva", booking.seva],
    ["Date", booking.date],
    ["Slot", booking.slot],
    ["Amount", booking.amount],
    ["Channel", booking.channel],
    ["Status", booking.status],
    ...(booking.billNumber ? ([["Bill Number", booking.billNumber]] as [string, string][]) : []),
    ...(booking.paymentId ? ([["Payment ID", booking.paymentId]] as [string, string][]) : []),
  ];
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4 overflow-y-auto" onClick={onClose}>
      <div className="w-full max-w-md rounded-2xl bg-card p-5 shadow-xl" onClick={(e) => e.stopPropagation()}>
        <h3 className="font-serif text-lg font-semibold">Booking details</h3>
        <dl className="mt-4 divide-y divide-border">
          {rows.map(([label, value]) => (
            <div key={label} className="flex items-center justify-between gap-4 py-2 text-sm">
              <dt className="shrink-0 text-muted-foreground">{label}</dt>
              <dd className="text-right font-medium">{value}</dd>
            </div>
          ))}
        </dl>
        <button onClick={onClose} className="mt-5 w-full rounded-full border border-border py-2 text-xs font-semibold hover:bg-muted">
          Close
        </button>
      </div>
    </div>
  );
}

const inputCls =
  "mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary";

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</label>
      {children}
    </div>
  );
}

type SevaOption = Awaited<ReturnType<typeof getSevas>>[number];

interface DevoteeOption {
  _id: number;
  id: string;
  name: string;
  mobile: string;
}

/** "New Booking" — the seva dropdown is fed straight from getSevas(), so any
 *  seva added on the Sevas & Services page (including brand new ones) shows
 *  up here immediately, no separate wiring needed. */
function BookingFormModal({
  sevas,
  onClose,
  onSubmit,
}: {
  sevas: SevaOption[];
  onClose: () => void;
  onSubmit: (payload: BookingPayload) => Promise<void>;
}) {
  const [devoteeSearch, setDevoteeSearch] = useState("");
  const [devotee, setDevotee] = useState<DevoteeOption | null>(null);
  const [sevaId, setSevaId] = useState<number | "">(sevas[0]?.id ?? "");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [slot, setSlot] = useState("");
  const [amount, setAmount] = useState(sevas[0] ? String(sevas[0].priceRaw) : "");
  const [channel, setChannel] = useState<BookingPayload["channel"]>("counter");
  const [status, setStatus] = useState<NonNullable<BookingPayload["status"]>>("pending");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const devoteeQuery = useQuery({
    queryKey: ["devotees", "booking-search", devoteeSearch],
    queryFn: () => getDevotees({ search: devoteeSearch, page: 1 }),
    enabled: devoteeSearch.trim().length > 0 && !devotee,
  });

  const selectedSeva = useMemo(() => sevas.find((s) => s.id === sevaId) ?? null, [sevas, sevaId]);

  function handleSevaChange(id: number) {
    setSevaId(id);
    const s = sevas.find((x) => x.id === id);
    if (s) setAmount(String(s.priceRaw));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!devotee) {
      setError("Please select a devotee first.");
      return;
    }
    if (!sevaId) {
      setError("Please select a seva.");
      return;
    }
    if (!slot.trim()) {
      setError("Please enter a slot (e.g. 7:00 AM).");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      await onSubmit({
        devotee: devotee._id,
        seva: Number(sevaId),
        date,
        slot,
        amount: Number(amount) || selectedSeva?.priceRaw || 0,
        channel,
        status,
      });
    } catch (err: any) {
      const data = err?.response?.data;
      const firstError = data && typeof data === "object" ? Object.values(data)[0] : null;
      const msg = Array.isArray(firstError) ? firstError[0] : firstError || "Could not create this booking.";
      setError(msg);
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4 overflow-y-auto" onClick={onClose}>
      <div className="w-full max-w-md rounded-2xl bg-card p-5 shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between">
          <h3 className="font-serif text-lg font-semibold">New Booking</h3>
          <button type="button" onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="h-4 w-4" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="mt-4 space-y-3">
          <Field label="Devotee">
            {devotee ? (
              <div className="mt-1 flex items-center justify-between rounded-lg border border-border bg-muted/40 px-3 py-2 text-sm">
                <span>
                  <span className="font-medium">{devotee.name}</span>{" "}
                  <span className="text-xs text-muted-foreground">({devotee.id})</span>
                </span>
                <button type="button" onClick={() => setDevotee(null)} className="text-muted-foreground hover:text-rose-600">
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ) : (
              <div className="relative mt-1">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                <input
                  autoFocus
                  value={devoteeSearch}
                  onChange={(e) => setDevoteeSearch(e.target.value)}
                  placeholder="Search by name, mobile or devotee ID..."
                  className="w-full rounded-lg border border-border bg-background py-2 pl-9 pr-3 text-sm outline-none focus:border-primary"
                />
                {devoteeSearch.trim() && (
                  <div className="absolute z-10 mt-1 max-h-48 w-full overflow-y-auto rounded-lg border border-border bg-card shadow-lg">
                    {devoteeQuery.isLoading && <p className="p-3 text-xs text-muted-foreground">Searching...</p>}
                    {devoteeQuery.data && devoteeQuery.data.rows.length === 0 && (
                      <p className="p-3 text-xs text-muted-foreground">No devotees found.</p>
                    )}
                    {devoteeQuery.data?.rows.map((d) => (
                      <button
                        key={d._id}
                        type="button"
                        onClick={() => {
                          setDevotee({ _id: d._id, id: d.id, name: d.name, mobile: d.mobile });
                          setDevoteeSearch("");
                        }}
                        className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-muted"
                      >
                        <User className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="font-medium">{d.name}</span>
                        <span className="text-xs text-muted-foreground">{d.id} · {d.mobile}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </Field>

          <Field label="Seva">
            <select
              required
              value={sevaId}
              onChange={(e) => handleSevaChange(Number(e.target.value))}
              className={inputCls}
            >
              <option value="" disabled>Select a seva...</option>
              {sevas.map((s) => (
                <option key={s.id} value={s.id}>{s.name} — {s.price}</option>
              ))}
            </select>
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Date">
              <input required type="date" value={date} onChange={(e) => setDate(e.target.value)} className={inputCls} />
            </Field>
            <Field label="Slot">
              <input required placeholder="e.g. 7:00 AM" value={slot} onChange={(e) => setSlot(e.target.value)} className={inputCls} />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Amount (₹)">
              <input required type="number" min={1} value={amount} onChange={(e) => setAmount(e.target.value)} className={inputCls} />
            </Field>
            <Field label="Channel">
              <select value={channel} onChange={(e) => setChannel(e.target.value as BookingPayload["channel"])} className={inputCls}>
                <option value="counter">Counter</option>
                <option value="web">Web</option>
                <option value="mobile">Mobile</option>
                <option value="whatsapp">WhatsApp</option>
              </select>
            </Field>
          </div>

          <Field label="Status">
            <select value={status} onChange={(e) => setStatus(e.target.value as typeof status)} className={inputCls}>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </Field>

          {error && <p className="text-sm text-rose-600">{error}</p>}

          <div className="mt-5 grid grid-cols-2 gap-2">
            <button type="button" onClick={onClose} className="rounded-full border border-border py-2 text-xs font-semibold hover:bg-muted">
              Cancel
            </button>
            <button disabled={saving} className="rounded-full bg-foreground py-2 text-xs font-semibold text-background disabled:opacity-50">
              {saving ? "Saving..." : "Create Booking"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}