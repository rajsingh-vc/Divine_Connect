import { createFileRoute, redirect } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { Download, X } from "lucide-react";
import { getStoredUser } from "@/lib/api";
import type { AuthUser } from "@/lib/auth-context";
import { getHomeRouteFor } from "@/lib/role-redirect";
import { getBookings, downloadBookingPdf, type Booking } from "@/api";

export const Route = createFileRoute("/my-bookings")({
  beforeLoad: () => {
    const user = getStoredUser<AuthUser>();
    if (!user) throw redirect({ to: "/login" });
    if (user.user_type !== "devotee") throw redirect({ to: getHomeRouteFor(user) });
  },
  head: () => ({ meta: [{ title: "My Bookings — Sansthan Console" }] }),
  component: MyBookingsPage,
});

function MyBookingsPage() {
  // BookingViewSet.get_queryset() already scopes this to the signed-in
  // devotee's own bookings server-side (Sec.19) — nothing extra needed here.
  const q = useQuery({ queryKey: ["my-bookings"], queryFn: getBookings });
  const [viewing, setViewing] = useState<Booking | null>(null);

  return (
    <div className="min-h-screen bg-background px-4 py-10">
      <div className="mx-auto max-w-3xl">
        <h1 className="font-serif text-2xl font-semibold">My Bookings</h1>
        <div className="mt-6 space-y-3">
          {(q.data || []).map((b) => (
            <button
              key={b._id}
              onClick={() => setViewing(b)}
              className="flex w-full items-center justify-between rounded-2xl border border-border bg-card p-4 text-left shadow-sm hover:bg-muted"
            >
              <div>
                <p className="font-semibold">{b.seva}</p>
                <p className="text-xs text-muted-foreground">{b.id} · {b.date}</p>
              </div>
              <span className="rounded-full border border-border px-3 py-1 text-xs font-semibold">{b.status}</span>
            </button>
          ))}
          {q.data?.length === 0 && <p className="text-sm text-muted-foreground">You have no bookings yet.</p>}
        </div>
      </div>

      {viewing && <BookingViewModal booking={viewing} onClose={() => setViewing(null)} />}
    </div>
  );
}

// Sec.10/11 — full booking detail + Export PDF button, calling the
// backend receipt endpoint (never client-generated from editable state).
function BookingViewModal({ booking, onClose }: { booking: Booking; onClose: () => void }) {
  const [exporting, setExporting] = useState(false);

  async function handleExport() {
    setExporting(true);
    try {
      await downloadBookingPdf(booking._id, booking.id);
    } catch {
      toast.error("Could not generate the PDF receipt. Please try again.");
    } finally {
      setExporting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4" onClick={onClose}>
      <div className="w-full max-w-md rounded-2xl bg-card p-5 shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between">
          <h3 className="font-serif text-lg font-semibold">Seva Booking</h3>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="h-4 w-4" />
          </button>
        </div>
        <dl className="mt-4 divide-y divide-border text-sm">
          <Row label="Booking Reference" value={booking.id} />
          <Row label="Devotee" value={booking.devotee} />
          <Row label="Seva" value={booking.seva} />
          <Row label="Booking Date" value={booking.date} />
          <Row label="Status" value={booking.status} />
        </dl>
        <button
          onClick={handleExport}
          disabled={exporting}
          className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-foreground py-2 text-xs font-semibold text-background disabled:opacity-50"
        >
          <Download className="h-3.5 w-3.5" /> {exporting ? "Preparing PDF…" : "Export PDF"}
        </button>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 py-2">
      <dt className="shrink-0 text-muted-foreground">{label}</dt>
      <dd className="text-right font-medium">{value}</dd>
    </div>
  );
}