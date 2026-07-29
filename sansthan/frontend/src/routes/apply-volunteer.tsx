import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { VolunteerVerificationForm } from "@/components/volunteers/verification-form";

// Dedicated "Volunteer Verification" page.
//
// A devotee who selects "I want to apply as a Volunteer" is redirected here
// instead of being turned into a volunteer immediately. Submitting this form
// only creates a Volunteer Application (status: Pending Admin Approval, and
// Pending Volunteer Approval too if a reference was picked) — it does NOT
// create a login account. The person can sign up/login as a volunteer only
// after an admin approves the application (see accounts/serializers.py:
// VolunteerSignupSerializer).
export const Route = createFileRoute("/apply-volunteer")({
  head: () => ({ meta: [{ title: "Volunteer Verification — Sansthan Console" }] }),
  component: ApplyVolunteerPage,
});

function ApplyVolunteerPage() {
  const nav = useNavigate();
  const { user, isAuthenticated, isLoading } = useAuth();
  const [submitted, setSubmitted] = useState(false);

  if (isLoading) {
    return <div className="grid min-h-screen place-items-center text-sm text-muted-foreground">Loading…</div>;
  }

  if (!isAuthenticated) {
    return (
      <div className="grid min-h-screen place-items-center bg-background px-4">
        <div className="w-full max-w-md rounded-3xl border border-border bg-card p-8 text-center shadow-lg">
          <h1 className="font-serif text-xl font-semibold">Sign in required</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Please sign in with your devotee account to apply as a volunteer.
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

  if (user?.user_type !== "devotee") {
    return (
      <div className="grid min-h-screen place-items-center bg-background px-4">
        <div className="w-full max-w-md rounded-3xl border border-border bg-card p-8 text-center shadow-lg">
          <h1 className="font-serif text-xl font-semibold">Not available</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Volunteer applications can only be submitted from a devotee account.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background px-4 py-10">
      <div className="mx-auto max-w-xl">
        <div className="mb-6 text-center">
          <h1 className="font-serif text-2xl font-semibold">Volunteer Verification</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Complete the steps below to submit your volunteer application.
          </p>
        </div>

        {submitted ? (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-center">
            <h2 className="font-serif text-lg font-semibold text-emerald-800">Application submitted</h2>
            <p className="mt-2 text-sm text-emerald-700">
              Your volunteer application is pending admin approval
              {" "}(and reference approval, if you selected a reference volunteer). You'll get a
              notification once a decision is made, and you'll be able to sign up as a volunteer
              only after it's approved.
            </p>
            <button
              onClick={() => nav({ to: "/admin" })}
              className="mt-4 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
            >
              Back to dashboard
            </button>
          </div>
        ) : (
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <VolunteerVerificationForm mode="apply" onSuccess={() => setSubmitted(true)} />
          </div>
        )}
      </div>
    </div>
  );
}