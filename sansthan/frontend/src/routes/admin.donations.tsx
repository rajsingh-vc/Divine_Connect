import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  CheckCircle2,
  ChevronRight,
  Clock,
  FileText,
  Heart,
  IndianRupee,
  Loader2,
  Repeat,
  ShieldCheck,
  TrendingUp,
  User,
  Users,
} from "lucide-react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell, Legend } from "recharts";
import { toast } from "sonner";
import { PageHeader, ChartCard } from "@/components/admin/chart-card";
import { StatCard } from "@/components/admin/stat-card";
import { getDonationTrend, getRevenueMix } from "@/api";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { openRazorpayCheckout } from "@/lib/razorpay";
import { formatINR } from "@/lib/format";

// Local fetcher for the stat-card numbers — hits your stats endpoint via the
// same axios instance used for donation submission. Adjust the URL and
// field names below to match your actual backend response shape.
interface DonationStats {
  received_today: number;
  mtd_total: number;
  mtd_change_percent: number | null;
  donors_this_month: number;
  recurring_donors: number;
}

async function getDonationStats(): Promise<DonationStats> {
  const { data } = await api.get("/donations/stats/");
  return data;
}

// Persisted, server-backed list of individual donations — this is what
// keeps a donation visible (to admins and anyone else on this page) after
// a refresh. Reuses the same GET /donations/ list route the admin console
// CRUD uses (DRF pagination), just ordered newest-first and capped to a
// page.
interface DonationRecord {
  id: number;
  donation_code: string;
  donor_name: string;
  is_anonymous: boolean;
  amount: number;
  total_amount: number;
  payment_status: "pending" | "paid" | "failed";
  created_at: string;
}

async function getRecentDonations(): Promise<DonationRecord[]> {
  const { data } = await api.get("/donations/", {
    params: { ordering: "-created_at", page_size: 10 },
  });
  // DRF's default pagination wraps results in { count, next, previous, results }.
  // Fall back to a bare array in case pagination is off.
  return Array.isArray(data) ? data : data.results ?? [];
}

export const Route = createFileRoute("/admin/donations")({
  head: () => ({ meta: [{ title: "Donation Management — Sansthan Console" }] }),
  component: () => {
    const { user } = useAuth();
    const trend = useQuery({ queryKey: ["donationTrend"], queryFn: getDonationTrend });
    const mix = useQuery({ queryKey: ["mix"], queryFn: getRevenueMix });
    // Drives the four stat cards below — replace the field names here to
    // match whatever shape /donations/stats/ (or your getDonationStats
    // implementation) actually returns.
    const stats = useQuery({ queryKey: ["donationStats"], queryFn: getDonationStats });
    // Recent donations list — fetched from the server so it survives a
    // refresh and is visible to admins, not just the person who donated.
    const recentDonations = useQuery({ queryKey: ["recentDonations"], queryFn: getRecentDonations });

    // Only devotees and volunteers can record a donation from this page —
    // admins just see the analytics below, same as before.
    const canRecordDonation = user?.user_type === "devotee" || user?.user_type === "volunteer";

    return (
      <>
        <PageHeader eyebrow="Fundraising" title="Donation Management" subtitle="Categories, campaigns, receipts and analytics across all donation channels." />

        {/* Stats + charts now lead the page */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCard
            label="Received Today"
            value={stats.isLoading ? "—" : formatINR(stats.data?.received_today ?? 0)}
            icon={Heart}
            accent="amber"
            trend="flat"
          />
          <StatCard
            label="MTD"
            value={stats.isLoading ? "—" : formatINR(stats.data?.mtd_total ?? 0)}
            change={stats.data?.mtd_change_percent != null ? `${stats.data.mtd_change_percent > 0 ? "+" : ""}${stats.data.mtd_change_percent}%` : undefined}
            icon={TrendingUp}
            accent="emerald"
          />
          <StatCard
            label="Donors This Month"
            value={stats.isLoading ? "—" : (stats.data?.donors_this_month ?? 0).toLocaleString("en-IN")}
            icon={Users}
            accent="sky"
            trend="flat"
          />
          <StatCard
            label="Recurring"
            value={stats.isLoading ? "—" : (stats.data?.recurring_donors ?? 0).toLocaleString("en-IN")}
            icon={Repeat}
            accent="amber"
            trend="flat"
          />
        </div>
        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <ChartCard title="Donation trend">
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trend.data || []}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(30 10% 90%)" />
                    <XAxis dataKey="month" fontSize={11} stroke="hsl(30 10% 55%)" />
                    <YAxis fontSize={11} stroke="hsl(30 10% 55%)" />
                    <Tooltip />
                    <Line type="monotone" dataKey="amount" stroke="hsl(35 90% 55%)" strokeWidth={2.5} dot={{ r: 3 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>
          </div>
          <ChartCard title="Category mix">
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={mix.data || []} dataKey="value" nameKey="name" innerRadius={45} outerRadius={90}>
                    {(mix.data || []).map((e, i) => <Cell key={i} fill={e.color} />)}
                  </Pie>
                  <Legend verticalAlign="bottom" iconType="circle" wrapperStyle={{ fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>

        {/* Recent donations — persisted server-side, visible to admins too */}
        <div className="mt-6">
          <RecentDonationsCard donations={recentDonations.data} isLoading={recentDonations.isLoading} />
        </div>

        {/* Record-a-donation form sits below the analytics now */}
        {canRecordDonation && (
          <div className="mt-6">
            <RecordDonationCard />
          </div>
        )}
      </>
    );
  },
});

// ---------------------------------------------------------------------------
// Record a Donation — devotee / volunteer only.
// Self-contained: calls /donations/generate/ and /donations/<id>/verify/
// directly, doesn't touch src/api/index.ts.
// ---------------------------------------------------------------------------

const PRESETS = [101, 501, 1101, 2100];

const PLATFORM_FEE_PERCENT = 2; // mirrors the backend's live preview only — the real figure comes back from /generate/

interface DonationBillSummary {
  donor: string;
  donation_amount: number;
  platform_fee: number;
  total_amount: number;
}

type Step = "form" | "paying" | "done";

function RecordDonationCard() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [amount, setAmount] = useState("501");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [donorName, setDonorName] = useState(user?.full_name || "");
  const [donorEmail, setDonorEmail] = useState("");
  const [donorMobile, setDonorMobile] = useState("");
  const [donorAddress, setDonorAddress] = useState("");
  const [want80g, setWant80g] = useState(false);
  const [donorPan, setDonorPan] = useState("");

  const [step, setStep] = useState<Step>("form");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [finalSummary, setFinalSummary] = useState<DonationBillSummary | null>(null);

  // Live bill summary preview — updates as the donor types/toggles, before
  // the server has even created the Donation. Donor name is withheld the
  // instant "Donate anonymously" is checked.
  const previewSummary: DonationBillSummary = useMemo(() => {
    const amt = Number(amount) || 0;
    const fee = Math.round(((amt * PLATFORM_FEE_PERCENT) / 100) * 100) / 100;
    return {
      donor: isAnonymous ? "Anonymous Donor" : donorName.trim() || "Anonymous Donor",
      donation_amount: amt,
      platform_fee: fee,
      total_amount: amt + fee,
    };
  }, [amount, isAnonymous, donorName]);

  const summary = finalSummary ?? previewSummary;

  function resetForAnother() {
    setStep("form");
    setFinalSummary(null);
    setError(null);
  }

  async function handleDonate() {
    setError(null);

    const amt = Number(amount);
    if (!amt || amt < 1) {
      setError("Please enter a valid donation amount.");
      return;
    }
    if (!isAnonymous && !donorName.trim()) {
      setError("Please enter the donor's name, or mark this donation anonymous.");
      return;
    }
    if (want80g && !donorPan.trim()) {
      setError("PAN is required to issue an 80G tax receipt.");
      return;
    }

    setSubmitting(true);
    try {
      const { data } = await api.post("/donations/generate/", {
        amount: amt,
        is_anonymous: isAnonymous,
        donor_name: donorName,
        donor_email: donorEmail,
        donor_mobile: donorMobile,
        donor_address: donorAddress,
        want_80g_receipt: want80g,
        donor_pan: donorPan,
      });

      const donation = data.donation;
      const razorpay = data.razorpay as { order_id: string; amount: number; currency: string; key: string };

      setStep("paying");

      await openRazorpayCheckout({
        key: razorpay.key,
        amount: razorpay.amount,
        currency: razorpay.currency,
        orderId: razorpay.order_id,
        name: "Sansthan Donation",
        description: "Donation",
        prefill: {
          name: isAnonymous ? undefined : donorName,
          contact: donorMobile || undefined,
          email: donorEmail || undefined,
        },
        onSuccess: async (response) => {
          try {
            const verifyRes = await api.post(`/donations/${donation.id}/verify/`, response);
            if (verifyRes.data.verified && verifyRes.data.bill_summary) {
              setFinalSummary(verifyRes.data.bill_summary as DonationBillSummary);
              setStep("done");
              toast.success(`Donation ${donation.donation_code} received. Thank you!`);
              // Refresh server-backed data so the new donation, and the
              // updated totals, show up right away — and stay there after
              // a page refresh, since it's now coming from the server
              // instead of this component's local state.
              queryClient.invalidateQueries({ queryKey: ["recentDonations"] });
              queryClient.invalidateQueries({ queryKey: ["donationStats"] });
              queryClient.invalidateQueries({ queryKey: ["donationTrend"] });
              queryClient.invalidateQueries({ queryKey: ["mix"] });
            } else {
              setError(verifyRes.data.message || "Payment could not be verified.");
              setStep("form");
              toast.error("Payment verification failed.");
            }
          } catch {
            setError("Payment could not be verified. Please check the Donations list.");
            setStep("form");
          }
        },
        onDismiss: () => {
          if (step !== "done") setStep("form");
        },
      });
    } catch (err: any) {
      const data = err?.response?.data;
      const firstError =
        data?.donor_name?.[0] || data?.donor_pan?.[0] || data?.amount?.[0] || data?.error || data?.details;
      setError(firstError || "Could not start this donation. Please try again.");
      setStep("form");
    } finally {
      setSubmitting(false);
    }
  }

  // -------------------------------------------------------------------
  // Success state
  // -------------------------------------------------------------------
  if (step === "done") {
    return (
      <div className="mx-auto w-full max-w-md rounded-2xl border border-border bg-card p-8 text-center shadow-sm">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50">
          <CheckCircle2 className="h-8 w-8 text-emerald-600" />
        </div>
        <h3 className="mt-4 font-serif text-xl font-semibold">Donation recorded</h3>
        <p className="mt-1 text-xs text-muted-foreground">The payment has been received and a receipt is on its way.</p>
        <div className="mt-5">
          <ReceiptPanel summary={summary} />
        </div>
        <button
          onClick={resetForAnother}
          className="mt-5 inline-flex w-full items-center justify-center gap-1.5 rounded-full border border-border py-2.5 text-xs font-semibold transition hover:bg-muted"
        >
          Record another donation
          <ChevronRight className="h-3.5 w-3.5" />
        </button>
      </div>
    );
  }

  // -------------------------------------------------------------------
  // Form state — two columns: fields on the left, sticky receipt on the right
  // -------------------------------------------------------------------
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      {/* Card header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-muted/30 px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-100">
            <Heart className="h-4.5 w-4.5 text-amber-700" />
          </div>
          <div>
            <h3 className="font-serif text-lg font-semibold leading-tight">Record a Donation</h3>
            <p className="text-xs text-muted-foreground">
              Logged in as {user?.full_name} · <span className="capitalize">{user?.user_type}</span>
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-0 lg:grid-cols-5">
        {/* Left: form fields */}
        <div className="space-y-6 p-6 lg:col-span-3 lg:border-r lg:border-border">
          {/* Amount */}
          <section>
            <FieldLabel icon={IndianRupee}>Amount</FieldLabel>
            <div className="mt-2 flex items-center gap-2 rounded-xl border border-border bg-background px-3 py-2 focus-within:border-primary">
              <span className="text-sm font-semibold text-muted-foreground">₹</span>
              <input
                type="number"
                min={1}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-transparent text-lg font-semibold outline-none"
              />
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {PRESETS.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setAmount(String(preset))}
                  className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
                    Number(amount) === preset
                      ? "border-amber-600 bg-amber-50 text-amber-800"
                      : "border-border text-muted-foreground hover:bg-muted"
                  }`}
                >
                  ₹{preset}
                </button>
              ))}
            </div>
          </section>

          {/* Donor information */}
          <section>
            <div className="flex items-center justify-between">
              <FieldLabel icon={User}>Donor Information</FieldLabel>
              <label className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <input
                  type="checkbox"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                  className="h-3.5 w-3.5 rounded border-border"
                />
                Donate anonymously
              </label>
            </div>
            <div className="mt-2 grid gap-2">
              <input
                placeholder={isAnonymous ? "Name (hidden — donating anonymously)" : "Full name"}
                value={donorName}
                disabled={isAnonymous}
                onChange={(e) => setDonorName(e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary disabled:bg-muted disabled:text-muted-foreground"
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  placeholder="Email (for receipt)"
                  type="email"
                  value={donorEmail}
                  onChange={(e) => setDonorEmail(e.target.value)}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                />
                <input
                  placeholder="Mobile number"
                  value={donorMobile}
                  onChange={(e) => setDonorMobile(e.target.value)}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                />
              </div>
              <input
                placeholder="Address (optional)"
                value={donorAddress}
                onChange={(e) => setDonorAddress(e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
              />
            </div>
          </section>

          {/* Tax & receipt */}
          <section className="rounded-xl border border-dashed border-border p-3">
            <label className="flex items-center gap-2 text-sm font-medium">
              <input
                type="checkbox"
                checked={want80g}
                onChange={(e) => setWant80g(e.target.checked)}
                className="h-4 w-4 rounded border-border"
              />
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              Need an 80G tax receipt
            </label>
            {want80g && (
              <input
                placeholder="PAN number"
                value={donorPan}
                onChange={(e) => setDonorPan(e.target.value.toUpperCase())}
                maxLength={10}
                className="mt-2 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
              />
            )}
          </section>

          {error && (
            <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-600">{error}</p>
          )}
        </div>

        {/* Right: sticky receipt + CTA */}
        <div className="bg-muted/20 p-6 lg:col-span-2">
          <div className="lg:sticky lg:top-6">
            <FieldLabel icon={FileText}>Bill Summary</FieldLabel>
            <div className="mt-2">
              <ReceiptPanel summary={summary} />
            </div>

            <button
              disabled={submitting || step === "paying"}
              onClick={handleDonate}
              className="mt-4 inline-flex w-full items-center justify-center gap-1.5 rounded-full bg-foreground py-3 text-sm font-semibold text-background transition hover:opacity-90 disabled:opacity-50"
            >
              {submitting || step === "paying" ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              {step === "paying" ? "Waiting for payment..." : `Donate ${formatINR(summary.total_amount)}`}
            </button>
            <p className="mt-2 text-center text-[11px] text-muted-foreground">
              Secure payment via Razorpay · Platform fee is added automatically
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function FieldLabel({ icon: Icon, children }: { icon: React.ElementType; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
      <Icon className="h-3.5 w-3.5" />
      {children}
    </div>
  );
}

function ReceiptPanel({ summary }: { summary: DonationBillSummary }) {
  const rows: [string, string][] = [
    ["Donor", summary.donor],
    ["Donation Amount", formatINR(summary.donation_amount)],
    ["Platform Fee", formatINR(summary.platform_fee)],
  ];
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <dl className="divide-y divide-dashed divide-border">
        {rows.map(([label, value]) => (
          <div key={label} className="flex items-center justify-between py-1.5 text-sm">
            <dt className="text-muted-foreground">{label}</dt>
            <dd className="font-medium">{value}</dd>
          </div>
        ))}
        <div className="flex items-center justify-between pt-2 text-sm">
          <dt className="font-semibold">Total</dt>
          <dd className="font-serif text-lg font-semibold text-amber-700">{formatINR(summary.total_amount)}</dd>
        </div>
      </dl>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Recent Donations — server-backed list. This is what admins (and everyone
// else on this page) see; it's driven by the "recentDonations" query, so it
// stays populated across refreshes instead of relying on any one form's
// local state.
// ---------------------------------------------------------------------------

function RecentDonationsCard({ donations, isLoading }: { donations?: DonationRecord[]; isLoading: boolean }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      <div className="flex items-center justify-between border-b border-border bg-muted/30 px-6 py-4">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <h3 className="font-serif text-lg font-semibold leading-tight">Recent Donations</h3>
        </div>
        <span className="text-xs text-muted-foreground">
          {isLoading ? "Loading…" : `${donations?.length ?? 0} shown`}
        </span>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center gap-2 p-10 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading donations…
        </div>
      ) : !donations || donations.length === 0 ? (
        <div className="p-10 text-center text-sm text-muted-foreground">No donations recorded yet.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <th className="px-6 py-3">Donor</th>
                <th className="px-6 py-3">Receipt No.</th>
                <th className="px-6 py-3">Amount</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {donations.map((d) => (
                <tr key={d.id}>
                  <td className="px-6 py-3 font-medium">{d.is_anonymous ? "Anonymous Donor" : d.donor_name}</td>
                  <td className="px-6 py-3 text-muted-foreground">{d.donation_code}</td>
                  <td className="px-6 py-3 font-semibold">{formatINR(d.total_amount ?? d.amount)}</td>
                  <td className="px-6 py-3">
                    <StatusBadge status={d.payment_status} />
                  </td>
                  <td className="px-6 py-3 text-muted-foreground">
                    {new Date(d.created_at).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: DonationRecord["payment_status"] }) {
  const styles: Record<DonationRecord["payment_status"], string> = {
    paid: "bg-emerald-50 text-emerald-700",
    pending: "bg-amber-50 text-amber-700",
    failed: "bg-rose-50 text-rose-700",
  };
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium capitalize ${styles[status]}`}>
      {status}
    </span>
  );
}