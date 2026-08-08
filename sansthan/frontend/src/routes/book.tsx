import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth-context";
import { DevoteeRegistrationForm, type VolunteerOption } from "@/components/admin/devotee-registration-form";
import { getVolunteers, lookupDevoteeByMobile, registerDevotee } from "@/api";

// Public "Online Seva Booking" page — a devotee signs in with their own
// account and fills this in themselves. Mirrors the sign-in gate used on
// /apply-volunteer so an unauthenticated visitor is sent to /login first
// instead of hitting a 401 from the backend.
export const Route = createFileRoute("/book")({
  head: () => ({ meta: [{ title: "Online Seva Booking — Sansthan Console" }] }),
  component: BookingPage,
});

function BookingPage() {
  const { user, isAuthenticated, isLoading } = useAuth();

  const volunteersQ = useQuery({
    queryKey: ["volunteers", "active"],
    queryFn: () => getVolunteers({ status: "active" }),
    enabled: isAuthenticated,
  });

  if (isLoading) {
    return <div className="grid min-h-screen place-items-center text-sm text-muted-foreground">Loading…</div>;
  }

  if (!isAuthenticated) {
    return (
      <div className="grid min-h-screen place-items-center bg-background px-4">
        <div className="w-full max-w-md rounded-3xl border border-border bg-card p-8 text-center shadow-lg">
          <h1 className="font-serif text-xl font-semibold">Sign in required</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Please sign in with your devotee account to book a seva online.
          </p>
          <Link
            to="/login"
            className="mt-4 inline-block rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
          >
            Sign in
          </Link>
        </div>
      </div>
    );
  }

  // "referredByVolunteer" is optional for a devotee (see form copy), but the
  // list is still useful if they want to credit whoever guided them — no
  // need to gate this page to devotee-only accounts.
  const volunteerOptions: VolunteerOption[] = (volunteersQ.data || []).map((v) => ({
    id: v._id,
    label: `${v.id} — ${v.name}`,
  }));

  return (
    <div className="min-h-screen bg-background px-4 py-10">
      <div className="mx-auto max-w-3xl">
        <DevoteeRegistrationForm
          mode="devotee"
          initial={{
            firstName: user?.full_name?.split(" ")[0] ?? "",
            email: user?.email ?? "",
          }}
          onLookupMobile={lookupDevoteeByMobile}
          volunteerOptions={volunteerOptions}
          onSubmit={async (payload) => {
            await registerDevotee(payload);
            toast.success("Your details have been saved. See you at the seva!");
          }}
        />
      </div>
    </div>
  );
}