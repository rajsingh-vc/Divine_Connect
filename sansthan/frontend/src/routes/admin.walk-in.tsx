import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { PageHeader } from "@/components/admin/chart-card";
import { useAuth } from "@/lib/auth-context";
import { DevoteeRegistrationForm, type VolunteerOption } from "@/components/admin/devotee-registration-form";
import { getVolunteers, lookupDevoteeByMobile, registerDevotee } from "@/api";

// Front-desk walk-in entry — same form as the public /book page, mounted
// inside the console for a volunteer (or admin) registering a devotee who's
// here in person. Auth is already enforced by the parent /admin route
// (admin.tsx), so no extra sign-in gate is needed here.
export const Route = createFileRoute("/admin/walk-in")({
  head: () => ({ meta: [{ title: "Walk-in Devotee Entry — Sansthan Console" }] }),
  component: WalkInPage,
});

function WalkInPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const volunteersQ = useQuery({
    queryKey: ["volunteers", "active"],
    queryFn: () => getVolunteers({ status: "active" }),
  });

  const volunteerOptions: VolunteerOption[] = (volunteersQ.data || []).map((v) => ({
    id: v._id,
    label: `${v.id} — ${v.name}`,
  }));

  // The logged-in volunteer's own Volunteer id, straight from their session —
  // pre-fills "Referred by Volunteer" below, still editable. null for admins
  // (or a volunteer account with no linked Volunteer row), so the field just
  // starts blank for them.
  const currentVolunteerId = user?.volunteer_id ?? null;

  return (
    <>
      <PageHeader
        eyebrow="Front Desk"
        title="Walk-in Devotee Entry"
        subtitle="Register a devotee who's here in person — same form as the online booking page."
      />
      <div className="mt-6 max-w-3xl">
        <DevoteeRegistrationForm
          mode="volunteer"
          onLookupMobile={lookupDevoteeByMobile}
          volunteerOptions={volunteerOptions}
          currentVolunteerId={currentVolunteerId}
          onSubmit={async (payload) => {
            await registerDevotee(payload);
            toast.success("Devotee registered.");
          }}
          onClose={() => navigate({ to: "/admin/devotees" })}
        />
      </div>
    </>
  );
}