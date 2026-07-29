import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { useAuth } from "@/lib/auth-context";

export const Route = createFileRoute("/signup")({
  head: () => ({ meta: [{ title: "Create account — Sansthan Console" }] }),
  component: SignupPage,
});

function SignupPage() {
  const nav = useNavigate();
  const { signup, login } = useAuth();

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [applyAsVolunteer, setApplyAsVolunteer] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        full_name: fullName,
        phone,
        email,
        password,
        confirm_password: confirmPassword,
      };
      // This always creates a Devotee account only — ticking the box below
      // never creates a volunteer login by itself (Signup Restriction).
      await signup(payload);

      if (applyAsVolunteer) {
        // Sign them in so the Volunteer Verification page (which requires
        // an authenticated devotee) can be shown immediately, then redirect
        // straight there to fill out and submit the application.
        await login(email, password);
        nav({ to: "/apply-volunteer" });
        return;
      }

      // Account created — send the user to the login page to sign in
      // explicitly, rather than auto-logging them in.
      nav({ to: "/login", search: { registered: "1" } });
    } catch (err: any) {
      const data = err?.response?.data;
      const firstError = data && typeof data === "object" ? Object.values(data)[0] : null;
      setError(Array.isArray(firstError) ? firstError[0] : firstError || "Could not create your account.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen grid place-items-center bg-background px-4 py-10">
      <div className="w-full max-w-md rounded-3xl border border-border bg-card p-8 shadow-lg">
        <div className="mb-6 flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-primary text-primary-foreground font-serif text-2xl">ॐ</div>
          <div>
            <p className="font-serif text-xl font-semibold">Sansthan Console</p>
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Enterprise Suite</p>
          </div>
        </div>
        <h1 className="font-serif text-2xl font-semibold">Create your account</h1>
        <p className="mt-1 text-sm text-muted-foreground">Sign up to get started.</p>

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <Field label="Full Name">
            <input required value={fullName} onChange={(e) => setFullName(e.target.value)} className={inputCls} />
          </Field>
          <Field label="Email">
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className={inputCls} />
          </Field>
          <Field label="Phone Number">
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className={inputCls}
            />
          </Field>
          <Field label="Password">
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className={inputCls} />
          </Field>
          <Field label="Confirm Password">
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={inputCls}
            />
          </Field>

          <label className="flex items-start gap-2 rounded-lg border border-border bg-background px-3 py-2.5">
            <input
              type="checkbox"
              checked={applyAsVolunteer}
              onChange={(e) => setApplyAsVolunteer(e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-border"
            />
            <span className="text-sm">
              <span className="font-medium">I want to apply as a volunteer</span>
              <span className="block text-xs text-muted-foreground">
                After creating your account, you'll be taken straight to the Volunteer Verification
                page to fill in your details and submit for admin review. This does not create a
                volunteer login by itself — that only happens after your application is approved.
              </span>
            </span>
          </label>

          {error && <p className="text-sm text-rose-600">{error}</p>}
          <button
            disabled={loading}
            className="w-full rounded-lg bg-primary py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-60"
          >
            {loading ? "Creating account..." : applyAsVolunteer ? "Continue to Volunteer Verification" : "Sign up"}
          </button>
        </form>

        <p className="mt-4 text-center text-xs text-muted-foreground">
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-primary hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

const inputCls =
  "mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</label>
      {children}
    </div>
  );
}