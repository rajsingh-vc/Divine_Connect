import { createFileRoute, redirect } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, type FormEvent } from "react";
import { Crown } from "lucide-react";
import { toast } from "sonner";
import { getStoredUser } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { PageHeader, ChartCard } from "@/components/admin/chart-card";
import { DataTable } from "@/components/admin/data-table";
import { getDevotees, registerDevotee } from "@/api";
import type { DevoteeFormPayload } from "@/components/admin/devotee-registration-form";

export const Route = createFileRoute("/volunteer/vip-registration")({
  head: () => ({ meta: [{ title: "VIP Registration — Sansthan Console" }] }),
  beforeLoad: () => {
    const user = getStoredUser<{ user_type: string }>();
    if (!user) throw redirect({ to: "/login" });
    if (user.user_type !== "volunteer") {
      throw redirect({ to: user.user_type === "admin" ? "/admin" : "/" });
    }
  },
  component: VipRegistrationPage,
});

function VipRegistrationPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const [vipName, setVipName] = useState("");
  const [guestCount, setGuestCount] = useState("1");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const vipList = useQuery({
    queryKey: ["devotees", "vip-list"],
    queryFn: () => getDevotees({ tier: "vip" }),
  });

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const trimmedName = vipName.trim();
    const count = Number(guestCount);

    if (!trimmedName) {
      setError("Please enter the VIP's name.");
      return;
    }
    if (!Number.isFinite(count) || count < 1) {
      setError("Please enter how many people they're bringing (1 or more).");
      return;
    }

    const payload: DevoteeFormPayload = {
      mobile: "",
      whatsapp: "",
      firstName: trimmedName,
      middleName: "",
      lastName: "",
      email: "",
      address: "",
      city: "",
      pincode: "",
      pan: "",
      referredByVolunteerId: user?.volunteer_id ?? null,
      guestCount: count,
    };

    setSubmitting(true);
    try {
      await registerDevotee(payload, { isVip: true });
      toast.success(`${trimmedName} registered as VIP.`);
      setVipName("");
      setGuestCount("1");
      queryClient.invalidateQueries({ queryKey: ["devotees"] });
    } catch (err) {
      console.error(err);
      toast.error("Couldn't register this VIP. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-md mx-auto w-full space-y-6">
      <div className="text-center">
        <PageHeader
          eyebrow="Volunteer"
          title={
            <span className="inline-flex w-full items-center justify-center gap-2">
              <Crown className="h-6 w-6 shrink-0 text-[#D4AF37]" strokeWidth={2.2} />
              <span>VIP Devotee Registration</span>
            </span> as any
          }
          subtitle="Register a devotee as VIP. Only volunteers can do this."
        />
      </div>

      <form
        onSubmit={handleSubmit}
        className="mx-auto w-full max-w-sm space-y-4 rounded-2xl border bg-card p-6 shadow-sm"
      >
        <div className="space-y-1.5">
          <label htmlFor="vip-name" className="text-sm font-medium">
            VIP Name
          </label>
          <input
            id="vip-name"
            type="text"
            value={vipName}
            onChange={(e) => setVipName(e.target.value)}
            placeholder="Enter name"
            className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#D4AF37]/40"
            disabled={submitting}
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="vip-guest-count" className="text-sm font-medium">
            Number of Guests
          </label>
          <input
            id="vip-guest-count"
            type="number"
            min={1}
            value={guestCount}
            onChange={(e) => setGuestCount(e.target.value)}
            className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#D4AF37]/40"
            disabled={submitting}
          />
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-md bg-[#D4AF37] px-4 py-2 text-sm font-semibold text-background disabled:opacity-60"
        >
          {submitting ? "Registering..." : "Register VIP"}
        </button>
      </form>

      <ChartCard title="VIP devotees">
        <DataTable
          rows={vipList.data?.rows || []}
          empty={vipList.isLoading ? "Loading..." : "No VIP devotees yet."}
          columns={[
            { key: "name", header: "Name" },
            { key: "guestCount", header: "Guests" },
          ]}
        />
      </ChartCard>
    </div>
  );
}