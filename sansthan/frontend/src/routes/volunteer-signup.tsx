import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { useAuth } from "@/lib/auth-context";

// Sign-up page for volunteers whose application has already been Admin
// Approved. The backend (VolunteerSignupSerializer) is the source of truth
// for the gate: it 400s with a descriptive message if there's no approved
// application on file yet, if it's still pending, or if it was rejected —
// this page just surfaces that message.
export const Route = createFileRoute("/volunteer-signup")({
  head: () => ({ meta: [{ title: "Volunteer Sign Up — Sansthan Console" }] }),
  component: VolunteerSignupPage,
});

function VolunteerSignupPage() {
  const nav = useNavigate();
  const { signupAsVolunteer } = useAuth();

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
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
      await signupAsVolunteer({
        full_name: fullName,
        phone,
        email,
        password,
        confirm_password: confirmPassword,
      });
      nav({ to: "/login", search: { registered: "1" } });
    } catch (err: any) {
      const data = err?.response?.data;
      const detail = data?.detail;
      const firstError = data && typeof data === "object" ? Object.values(data)[0] : null;
      setError(detail || (Array.isArray(firstError) ? firstError[0] : firstError) || "Could not create your account.");
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
        <h1 className="font-serif text-2xl font-semibold">Volunteer sign up</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          For applicants whose volunteer application has already been approved by an admin. Use the
          same email or phone number you applied with.
        </p>

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <Field label="Full Name">
            <input required value={fullName} onChange={(e) => setFullName(e.target.value)} className={inputCls} />
          </Field>
          <Field label="Email">
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className={inputCls} />
          </Field>
          <Field label="Phone Number">
            <input type="tel" required value={phone} onChange={(e) => setPhone(e.target.value)} className={inputCls} />
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

          {error && <p className="text-sm text-rose-600">{error}</p>}
          <button
            disabled={loading}
            className="w-full rounded-lg bg-primary py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-60"
          >
            {loading ? "Creating account..." : "Sign up as volunteer"}
          </button>
        </form>

        <p className="mt-4 text-center text-xs text-muted-foreground">
          Haven't applied yet?{" "}
          <Link to="/apply-volunteer" className="font-medium text-primary hover:underline">
            Apply as a volunteer
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