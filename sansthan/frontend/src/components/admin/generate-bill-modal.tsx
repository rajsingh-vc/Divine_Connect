import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { CheckCircle2, Loader2, Search, User, X } from "lucide-react";
import { toast } from "sonner";

import { generateBill, getDevotees, getVolunteers, verifyBillPayment, type Bill } from "@/api";
import { useAuth } from "@/lib/auth-context";
import { openRazorpayCheckout } from "@/lib/razorpay";
import { formatINR } from "@/lib/format";

interface Seva {
  id: number;
  name: string;
  priceRaw: number;
  price: string;
}

interface DevoteeOption {
  _id: number;
  id: string;
  name: string;
  mobile: string;
}

interface VolunteerOption {
  _id: number;
  id: string;
  name: string;
}

type Step = "form" | "paying" | "invoice";

/**
 * Admin/Volunteer -> Sevas & Services -> pick a seva -> choose devotee
 * (+ optional volunteer referral) -> Generate Bill -> Razorpay -> Invoice.
 */
export function GenerateBillModal({
  seva,
  onClose,
  onCompleted,
}: {
  seva: Seva;
  onClose: () => void;
  /** Fired once the bill is fully paid — lets the Sevas page mark this seva
   *  card "Bill Completed" without this modal knowing about that page. */
  onCompleted?: (billNumber: string) => void;
}) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [step, setStep] = useState<Step>("form");
  const [devoteeSearch, setDevoteeSearch] = useState("");
  const [devotee, setDevotee] = useState<DevoteeOption | null>(null);
  const [volunteerSearch, setVolunteerSearch] = useState("");
  const [volunteer, setVolunteer] = useState<VolunteerOption | null>(null);
  const [amount, setAmount] = useState(String(seva.priceRaw));
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [bill, setBill] = useState<Bill | null>(null);

  const devoteeQuery = useQuery({
    queryKey: ["devotees", "bill-search", devoteeSearch],
    queryFn: () => getDevotees({ search: devoteeSearch, page: 1 }),
    enabled: devoteeSearch.trim().length > 0 && !devotee,
  });

  const volunteerQuery = useQuery({
    queryKey: ["volunteers", "bill-search", volunteerSearch],
    queryFn: () => getVolunteers({ search: volunteerSearch, status: "active" }),
    enabled: volunteerSearch.trim().length > 0 && !volunteer,
  });

  async function handleGenerate() {
    if (!devotee) {
      setError("Please select a devotee first.");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const { bill: createdBill, razorpay } = await generateBill({
        devotee: devotee._id,
        seva: seva.id,
        volunteer: volunteer?._id ?? null,
        amount: Number(amount) || seva.priceRaw,
      });
      setBill(createdBill);
      setStep("paying");

      await openRazorpayCheckout({
        key: razorpay.key,
        amount: razorpay.amount,
        currency: razorpay.currency,
        orderId: razorpay.order_id,
        name: "Sansthan Sevas",
        description: `${seva.name} — ${devotee.name}`,
        prefill: { name: devotee.name, contact: devotee.mobile },
        onSuccess: async (response) => {
          try {
            const result = await verifyBillPayment(createdBill.id, response);
            if (result.verified && result.bill) {
              setBill(result.bill);
              setStep("invoice");
              toast.success(`Bill ${createdBill.billNumber} completed.`);
              // The backend also creates a matching Booking record for this
              // paid bill — refresh the Bookings list cache so it's there
              // the moment the admin/volunteer lands on that page.
              queryClient.invalidateQueries({ queryKey: ["bookings"] });
              onCompleted?.(createdBill.billNumber);
            } else {
              setError(result.message || "Payment could not be verified.");
              setStep("form");
              toast.error("Payment verification failed.");
            }
          } catch {
            setError("Payment could not be verified. Please check the Bills list.");
            setStep("form");
          }
        },
        onDismiss: () => {
          if (step !== "invoice") setStep("form");
        },
      });
    } catch (err: any) {
      const data = err?.response?.data;
      setError(data?.error || data?.details || "Could not generate this bill. Please try again.");
      setStep("form");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4 overflow-y-auto" onClick={onClose}>
      <div className="w-full max-w-md rounded-2xl bg-card p-5 shadow-xl" onClick={(e) => e.stopPropagation()}>
        {step !== "invoice" ? (
          <>
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-lg font-semibold">Bill</h3>
              <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
                <X className="h-4 w-4" />
              </button>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              {seva.name} · {formatINR(Number(amount) || seva.priceRaw)}
            </p>

            <div className="mt-4 space-y-3">
              {/* Devotee picker */}
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Devotee</label>
                {devotee ? (
                  <div className="mt-1 flex items-center justify-between rounded-lg border border-border bg-muted/40 px-3 py-2 text-sm">
                    <span>
                      <span className="font-medium">{devotee.name}</span>{" "}
                      <span className="text-xs text-muted-foreground">({devotee.id})</span>
                    </span>
                    <button onClick={() => setDevotee(null)} className="text-muted-foreground hover:text-rose-600">
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
              </div>

              {/* Optional volunteer referral */}
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Volunteer <span className="normal-case font-normal text-muted-foreground/70">(optional — brought this devotee in)</span>
                </label>
                {volunteer ? (
                  <div className="mt-1 flex items-center justify-between rounded-lg border border-border bg-muted/40 px-3 py-2 text-sm">
                    <span>
                      <span className="font-medium">{volunteer.name}</span>{" "}
                      <span className="text-xs text-muted-foreground">({volunteer.id})</span>
                    </span>
                    <button onClick={() => setVolunteer(null)} className="text-muted-foreground hover:text-rose-600">
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ) : (
                  <div className="relative mt-1">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                    <input
                      value={volunteerSearch}
                      onChange={(e) => setVolunteerSearch(e.target.value)}
                      placeholder="Search volunteer name or ID..."
                      className="w-full rounded-lg border border-border bg-background py-2 pl-9 pr-3 text-sm outline-none focus:border-primary"
                    />
                    {volunteerSearch.trim() && (
                      <div className="absolute z-10 mt-1 max-h-48 w-full overflow-y-auto rounded-lg border border-border bg-card shadow-lg">
                        {volunteerQuery.isLoading && <p className="p-3 text-xs text-muted-foreground">Searching...</p>}
                        {volunteerQuery.data && volunteerQuery.data.length === 0 && (
                          <p className="p-3 text-xs text-muted-foreground">No volunteers found.</p>
                        )}
                        {volunteerQuery.data?.map((v) => (
                          <button
                            key={v._id}
                            onClick={() => {
                              setVolunteer({ _id: v._id, id: v.id, name: v.name });
                              setVolunteerSearch("");
                            }}
                            className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-muted"
                          >
                            <User className="h-3.5 w-3.5 text-muted-foreground" />
                            <span className="font-medium">{v.name}</span>
                            <span className="text-xs text-muted-foreground">{v.id}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Amount (₹)</label>
                <input
                  type="number"
                  min={1}
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                />
              </div>

              <p className="text-xs text-muted-foreground">
                Created by <span className="font-medium text-foreground">{user?.full_name || "—"}</span> · {new Date().toLocaleString("en-IN")}
              </p>

              {error && <p className="text-sm text-rose-600">{error}</p>}
            </div>

            <div className="mt-5 grid grid-cols-2 gap-2">
              <button type="button" onClick={onClose} className="rounded-full border border-border py-2 text-xs font-semibold hover:bg-muted">
                Cancel
              </button>
              <button
                disabled={submitting || step === "paying" || !devotee}
                onClick={handleGenerate}
                className="inline-flex items-center justify-center gap-1.5 rounded-full bg-foreground py-2 text-xs font-semibold text-background disabled:opacity-50"
              >
                {submitting || step === "paying" ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
                {step === "paying" ? "Waiting for payment..." : "Bill"}
              </button>
            </div>
          </>
        ) : (
          bill && <InvoiceView bill={bill} onClose={onClose} navigate={navigate} />
        )}
      </div>
    </div>
  );
}

function InvoiceView({
  bill,
  onClose,
  navigate,
}: {
  bill: Bill;
  onClose: () => void;
  navigate: ReturnType<typeof useNavigate>;
}) {
  const rows: [string, string][] = [
    ["Invoice", bill.invoiceNumber],
    ["Bill No", bill.billNumber],
    ["Devotee", `${bill.devoteeName} (${bill.devoteeCode})`],
    ["Seva", bill.sevaName],
    ["Amount", bill.amount],
    ["Volunteer", bill.volunteerName ? `${bill.volunteerName} (${bill.volunteerCode})` : "—"],
    ["Payment ID", bill.razorpayPaymentId || "—"],
    ["Date", bill.paidAt ? new Date(bill.paidAt).toLocaleString("en-IN") : "—"],
  ];

  function goToBookings() {
    onClose();
    navigate({ to: "/admin/bookings" });
  }

  // Auto-redirect to Booking Management a couple of seconds after the bill
  // completes, so the payment shows up there right away without the admin
  // having to navigate manually. The button below lets them jump instantly.
  useEffect(() => {
    const t = setTimeout(goToBookings, 2000);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="text-center">
      <CheckCircle2 className="mx-auto h-10 w-10 text-emerald-600" />
      <h3 className="mt-3 font-serif text-lg font-semibold">Bill Completed</h3>
      <p className="text-xs text-muted-foreground">Invoice saved · redirecting to Bookings...</p>
      <dl className="mt-4 divide-y divide-border text-left">
        {rows.map(([label, value]) => (
          <div key={label} className="flex items-center justify-between py-2 text-sm">
            <dt className="text-muted-foreground">{label}</dt>
            <dd className="font-medium">{value}</dd>
          </div>
        ))}
      </dl>
      <button onClick={goToBookings} className="mt-5 w-full rounded-full bg-foreground py-2 text-xs font-semibold text-background">
        View in Bookings
      </button>
    </div>
  );
}