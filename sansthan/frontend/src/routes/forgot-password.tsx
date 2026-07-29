import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { api } from "@/lib/api";

export const Route = createFileRoute("/forgot-password")({
  head: () => ({ meta: [{ title: "Reset password — Sansthan Console" }] }),
  component: ForgotPasswordPage,
});

type Step = "email" | "reset" | "done";

function ForgotPasswordPage() {
  const nav = useNavigate();
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function checkEmail(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await api.post("/auth/forgot-password/", { email });
      setStep("reset");
    } catch (err: any) {
      setError(err?.response?.data?.detail || "Email not found");
    } finally {
      setLoading(false);
    }
  }

  async function resetPassword(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await api.post("/auth/reset-password/", { email, new_password: newPassword, confirm_password: confirmPassword });
      setStep("done");
      // Redirect automatically to the login page once the password is updated.
      setTimeout(() => nav({ to: "/login" }), 1500);
    } catch (err: any) {
      const data = err?.response?.data;
      const firstError = data && typeof data === "object" ? Object.values(data)[0] : null;
      setError(Array.isArray(firstError) ? firstError[0] : firstError || "Could not reset your password.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen grid place-items-center bg-background px-4">
      <div className="w-full max-w-md rounded-3xl border border-border bg-card p-8 shadow-lg">
        <div className="mb-6 flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-primary text-primary-foreground font-serif text-2xl">ॐ</div>
          <div>
            <p className="font-serif text-xl font-semibold">Sansthan Console</p>
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Enterprise Suite</p>
          </div>
        </div>

        {step === "email" && (
          <>
            <h1 className="font-serif text-2xl font-semibold">Forgot password</h1>
            <p className="mt-1 text-sm text-muted-foreground">Enter the email on your account and we'll check it exists.</p>
            <form onSubmit={checkEmail} className="mt-6 space-y-4">
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                />
              </div>
              {error && <p className="text-sm text-rose-600">{error}</p>}
              <button disabled={loading} className="w-full rounded-lg bg-primary py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-60">
                {loading ? "Checking..." : "Continue"}
              </button>
            </form>
          </>
        )}

        {step === "reset" && (
          <>
            <h1 className="font-serif text-2xl font-semibold">Set a new password</h1>
            <p className="mt-1 text-sm text-muted-foreground">Email verified — choose a new password for {email}.</p>
            <form onSubmit={resetPassword} className="mt-6 space-y-4">
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">New Password</label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Confirm Password</label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                />
              </div>
              {error && <p className="text-sm text-rose-600">{error}</p>}
              <button disabled={loading} className="w-full rounded-lg bg-primary py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-60">
                {loading ? "Updating..." : "Update password"}
              </button>
            </form>
          </>
        )}

        {step === "done" && (
          <>
            <h1 className="font-serif text-2xl font-semibold">Password updated</h1>
            <p className="mt-2 text-sm text-muted-foreground">Redirecting you to sign in…</p>
          </>
        )}

        <p className="mt-4 text-center text-xs text-muted-foreground">
          Remembered it?{" "}
          <Link to="/login" className="font-medium text-primary hover:underline">
            Back to sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
