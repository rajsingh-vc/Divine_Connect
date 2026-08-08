import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, type FormEvent, type ReactNode } from "react";
import { UtensilsCrossed, Clock, CheckCircle2, XCircle, Search, Plus, User, X, Trash2, QrCode, Download } from "lucide-react";
import { toast } from "sonner";
import { PageHeader, ChartCard } from "@/components/admin/chart-card";
import { StatCard } from "@/components/admin/stat-card";
import { DataTable } from "@/components/admin/data-table";
import { StatusBadge } from "@/components/admin/badges";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { getMealBookings, getDevotees, createMealBooking, deleteMealBooking, type MealBookingPayload } from "@/api";
import { cn } from "@/lib/utils";

type MealBookingRow = Awaited<ReturnType<typeof getMealBookings>>[number];

export const Route = createFileRoute("/admin/")({
  head: () => ({ meta: [{ title: "Meal Bookings — Sansthan Console" }] }),
  component: () => {
    const q = useQuery({ queryKey: ["meal-bookings"], queryFn: getMealBookings });
    const queryClient = useQueryClient();
    const [viewing, setViewing] = useState<MealBookingRow | null>(null);
    const [qrBooking, setQrBooking] = useState<MealBookingRow | null>(null);
    const [addOpen, setAddOpen] = useState(false);
    const [deleting, setDeleting] = useState<MealBookingRow | null>(null);
    const [deleteBusy, setDeleteBusy] = useState(false);

    const bookings = q.data || [];
    const todayStr = new Date().toISOString().slice(0, 10);
    const todaysCount = bookings.filter((b) => b.mealDate === todayStr).length;
    const pendingCount = bookings.filter((b) => b.rawStatus === "pending").length;
    const confirmedCount = bookings.filter((b) => b.rawStatus === "confirmed").length;
    const cancelledCount = bookings.filter((b) => b.rawStatus === "cancelled").length;

    function invalidate() {
      queryClient.invalidateQueries({ queryKey: ["meal-bookings"] });
    }

    async function handleDelete() {
      if (!deleting) return;
      setDeleteBusy(true);
      try {
        await deleteMealBooking(deleting._id);
        toast.success(`Meal booking ${deleting.id} removed.`);
        invalidate();
        setDeleting(null);
      } catch (err: any) {
        toast.error(err?.response?.data?.detail || "Could not remove this meal booking.");
      } finally {
        setDeleteBusy(false);
      }
    }

    return (
      <>
        <PageHeader eyebrow="Operations" title="Meal Bookings" subtitle="Manage Mahaprasad / meal booking QR issuance and redemption." />
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCard label="Today's Meal Bookings" value={String(todaysCount)} icon={UtensilsCrossed} accent="amber" trend="flat" />
          <StatCard label="Pending" value={String(pendingCount)} icon={Clock} accent="amber" trend="flat" />
          <StatCard label="Confirmed" value={String(confirmedCount)} icon={CheckCircle2} accent="emerald" trend="flat" />
          <StatCard label="Cancelled" value={String(cancelledCount)} icon={XCircle} accent="rose" trend="flat" />
        </div>
        <div className="mt-4">
          <ChartCard title="All meal bookings" action={
            <button
              onClick={() => setAddOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-full bg-foreground px-3 py-1.5 text-xs font-semibold text-background"
            >
              <Plus className="h-3.5 w-3.5" /> New Meal Booking
            </button>
          }>
            <DataTable rows={bookings} empty={q.isLoading ? "Loading..." : "No meal bookings found."} columns={[
              { key: "id", header: "ID", render: (r) => <span className="font-mono text-xs text-muted-foreground">{r.id}</span> },
              { key: "devotee", header: "Devotee" },
              { key: "mealName", header: "Meal" },
              { key: "mealDate", header: "Date" },
              { key: "mealTime", header: "Time" },
              { key: "amount", header: "Amount", render: (r) => <span className="font-semibold">{r.amount || "—"}</span> },
              { key: "status", header: "Status", render: (r) => <StatusBadge status={r.status} /> },
              { key: "qr", header: "", render: (r) => r.encryptedQr ? (
                <button
                  onClick={() => setQrBooking(r)}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                  title={r.isUsed ? "QR already scanned" : "View Booking QR"}
                >
                  <QrCode className="h-3.5 w-3.5" /> {r.isUsed ? "Used" : "QR"}
                </button>
              ) : <span className="text-xs text-muted-foreground">—</span> },
              { key: "act", header: "", render: (r) => <button onClick={() => setViewing(r)} className="text-xs font-semibold text-primary hover:underline">View</button> },
              { key: "remove", header: "", render: (r) => (
                <button
                  onClick={() => setDeleting(r)}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-rose-600 hover:underline"
                  title="Remove meal booking"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              ) },
            ]} />
          </ChartCard>
        </div>

        {viewing && <MealBookingViewModal booking={viewing} onClose={() => setViewing(null)} onViewQr={() => { setQrBooking(viewing); setViewing(null); }} />}

        {qrBooking && <MealBookingQRModal booking={qrBooking} onClose={() => setQrBooking(null)} />}

        <ConfirmDialog
          open={!!deleting}
          onOpenChange={(open) => !open && setDeleting(null)}
          title="Remove this meal booking?"
          description={deleting ? `This will permanently remove meal booking ${deleting.id} for ${deleting.devotee}. This cannot be undone.` : ""}
          loading={deleteBusy}
          onConfirm={handleDelete}
        />

        {addOpen && (
          <MealBookingFormModal
            onClose={() => setAddOpen(false)}
            onSubmit={async (payload) => {
              await createMealBooking(payload);
              toast.success("Meal booking created.");
              invalidate();
              setAddOpen(false);
            }}
          />
        )}
      </>
    );
  },
});

function MealBookingViewModal({
  booking,
  onClose,
  onViewQr,
}: {
  booking: MealBookingRow;
  onClose: () => void;
  onViewQr: () => void;
}) {
  const rows: [string, string][] = [
    ["Booking ID", booking.id],
    ["Devotee", booking.devotee],
    ["Meal", booking.mealName],
    ["Date", booking.mealDate],
    ["Time", booking.mealTime],
    ["Amount", booking.amount || "—"],
    ["Status", booking.status],
    ...(booking.encryptedQr ? ([["Booking QR", booking.isUsed ? "Scanned / Used" : "Not yet scanned"]] as [string, string][]) : []),
  ];
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4 overflow-y-auto" onClick={onClose}>
      <div className="w-full max-w-md rounded-2xl bg-card p-5 shadow-xl" onClick={(e) => e.stopPropagation()}>
        <h3 className="font-serif text-lg font-semibold">Meal booking details</h3>
        <dl className="mt-4 divide-y divide-border">
          {rows.map(([label, value]) => (
            <div key={label} className="flex items-center justify-between gap-4 py-2 text-sm">
              <dt className="shrink-0 text-muted-foreground">{label}</dt>
              <dd className="text-right font-medium">{value}</dd>
            </div>
          ))}
        </dl>
        <div className="mt-5 grid grid-cols-2 gap-2">
          <button onClick={onClose} className="rounded-full border border-border py-2 text-xs font-semibold hover:bg-muted">
            Close
          </button>
          {booking.encryptedQr ? (
            <button onClick={onViewQr} className="inline-flex items-center justify-center gap-1.5 rounded-full bg-foreground py-2 text-xs font-semibold text-background">
              <QrCode className="h-3.5 w-3.5" /> View QR
            </button>
          ) : (
            <button disabled className="rounded-full border border-border py-2 text-xs font-semibold text-muted-foreground opacity-50">
              No QR yet
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function MealBookingQRModal({ booking, onClose }: { booking: MealBookingRow; onClose: () => void }) {
  function handleDownload() {
    if (!booking.qrImage) return;
    const a = document.createElement("a");
    a.href = booking.qrImage;
    a.download = `meal-booking-qr-${booking.id}.png`;
    a.click();
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4 overflow-y-auto" onClick={onClose}>
      <div className="w-full max-w-sm rounded-2xl bg-card p-5 shadow-xl text-center" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between text-left">
          <h3 className="font-serif text-lg font-semibold">Meal Booking QR</h3>
          <button type="button" onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="h-4 w-4" />
          </button>
        </div>
        <p className="mt-1 text-left text-xs text-muted-foreground">
          {booking.devotee} · {booking.mealName} · {booking.mealDate} {booking.mealTime}
        </p>

        <div className="mt-4 flex justify-center">
          {booking.qrImage ? (
            <img src={booking.qrImage} alt={`QR for meal booking ${booking.id}`} className="h-52 w-52 rounded-xl border border-border object-contain" />
          ) : (
            <div className="flex h-52 w-52 items-center justify-center rounded-xl border border-dashed border-border text-xs text-muted-foreground">
              QR image not available
            </div>
          )}
        </div>

        <p className={cn("mt-3 text-xs font-semibold", booking.isUsed ? "text-rose-600" : "text-emerald-600")}>
          {booking.isUsed
            ? `Already scanned${booking.qrScannedAt ? ` · ${new Date(booking.qrScannedAt).toLocaleString("en-IN")}` : ""}`
            : "Not yet scanned"}
        </p>

        <div className="mt-5 grid grid-cols-2 gap-2">
          <button onClick={onClose} className="rounded-full border border-border py-2 text-xs font-semibold hover:bg-muted">
            Close
          </button>
          <button
            onClick={handleDownload}
            disabled={!booking.qrImage}
            className="inline-flex items-center justify-center gap-1.5 rounded-full bg-foreground py-2 text-xs font-semibold text-background disabled:opacity-50"
          >
            <Download className="h-3.5 w-3.5" /> Download
          </button>
        </div>
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

interface DevoteeOption {
  _id: number;
  id: string;
  name: string;
  mobile: string;
}

function MealBookingFormModal({
  onClose,
  onSubmit,
}: {
  onClose: () => void;
  onSubmit: (payload: MealBookingPayload) => Promise<void>;
}) {
  const [devoteeSearch, setDevoteeSearch] = useState("");
  const [devotee, setDevotee] = useState<DevoteeOption | null>(null);
  const [mealName, setMealName] = useState("Mahaprasad");
  const [mealDate, setMealDate] = useState(new Date().toISOString().slice(0, 10));
  const [mealTime, setMealTime] = useState("");
  const [amount, setAmount] = useState("");
  const [status, setStatus] = useState<NonNullable<MealBookingPayload["status"]>>("pending");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const devoteeQuery = useQuery({
    queryKey: ["devotees", "meal-booking-search", devoteeSearch],
    queryFn: () => getDevotees({ search: devoteeSearch, page: 1 }),
    enabled: devoteeSearch.trim().length > 0 && !devotee,
  });

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!devotee) {
      setError("Please select a devotee first.");
      return;
    }
    if (!mealTime.trim()) {
      setError("Please enter a meal time (e.g. 12:30 PM).");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      await onSubmit({
        devotee: devotee._id,
        meal_name: mealName,
        meal_date: mealDate,
        meal_time: mealTime,
        amount: amount ? Number(amount) : undefined,
        status,
      });
    } catch (err: any) {
      const data = err?.response?.data;
      const firstError = data && typeof data === "object" ? Object.values(data)[0] : null;
      const msg = Array.isArray(firstError) ? firstError[0] : firstError || "Could not create this meal booking.";
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
          <h3 className="font-serif text-lg font-semibold">New Meal Booking</h3>
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

          <Field label="Meal">
            <input required value={mealName} onChange={(e) => setMealName(e.target.value)} className={inputCls} />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Date">
              <input required type="date" value={mealDate} onChange={(e) => setMealDate(e.target.value)} className={inputCls} />
            </Field>
            <Field label="Time">
              <input required placeholder="e.g. 12:30 PM" value={mealTime} onChange={(e) => setMealTime(e.target.value)} className={inputCls} />
            </Field>
          </div>

          <Field label="Amount (₹, optional)">
            <input type="number" min={0} value={amount} onChange={(e) => setAmount(e.target.value)} className={inputCls} />
          </Field>

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
              {saving ? "Saving..." : "Create Meal Booking"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}