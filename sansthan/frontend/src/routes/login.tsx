import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth-context";
// 👇 import the logo
import gsbLogo from "@/assests/gsb_seva.png";

const searchSchema = z.object({
  registered: z.string().optional(),
});

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Sign in — Divine Connect" }] }),
  validateSearch: searchSchema,
  component: LoginPage,
});

function LoginPage() {
  const nav = useNavigate();
  const { registered } = Route.useSearch();
  const { login } = useAuth();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [wantsVip, setWantsVip] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const loggedInUser = await login(identifier, password);

      if (wantsVip) {
        if (loggedInUser.user_type === "volunteer") {
          nav({ to: "/volunteer/vip-registration" });
          return;
        }
        // Devotee or admin ticked the VIP checkbox — that flow isn't for
        // them. Don't block their login, just fall through to their
        // normal landing page below, with a heads-up toast.
        toast.error("VIP registration is only available to volunteers.");
      }

      if (loggedInUser.user_type === "volunteer") {
        nav({ to: "/volunteer/duties" });
      } else if (loggedInUser.user_type === "admin") {
        nav({ to: "/admin" });
      } else {
        nav({ to: "/" });
      }
    } catch (err: any) {
      setError(err?.response?.data?.detail || "Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen grid place-items-center bg-background px-4">
      <div className="w-full max-w-md rounded-3xl border border-border bg-card p-8 shadow-lg">
        {/* 👇 logo area – same size as shell, with object-contain */}
        <div className="mb-6 flex items-center gap-3">
          <div className="grid h-16 w-16 shrink-0 place-items-center overflow-hidden rounded-2xl">
            <img
              src={gsbLogo}
              alt="GSB Seva Logo"
              className="h-full w-full object-contain"
            />
          </div>
          <div>
            <p className="font-serif text-xl font-semibold">Divine Connect</p>
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              
            </p>
          </div>
        </div>

        <h1 className="font-serif text-2xl font-semibold">Sign in</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Access the operations console for your sansthan.
        </p>

        {registered && (
          <p className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-700">
            Account created successfully. Please sign in to continue.
          </p>
        )}

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Email or Phone Number
            </label>
            <input
              required
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="you@example.com or phone number"
              className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
            />
          </div>
          <div>
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Password
              </label>
              <Link
                to="/forgot-password"
                className="text-xs font-medium text-primary hover:underline"
              >
                Forgot password?
              </Link>
            </div>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
            />
          </div>

          <label className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
            <input
              type="checkbox"
              checked={wantsVip}
              onChange={(e) => setWantsVip(e.target.checked)}
            />
            I'm a volunteer registering a VIP devotee
          </label>

          {error && <p className="text-sm text-rose-600">{error}</p>}
          <button
            disabled={loading}
            className="w-full rounded-lg bg-primary py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p className="mt-4 text-center text-xs text-muted-foreground">
          New here?{" "}
          <Link to="/signup" className="font-medium text-primary hover:underline">
            Create an account
          </Link>
        </p>
        <p className="mt-2 text-center text-xs text-muted-foreground">
          Approved as a volunteer already?{" "}
          <Link
            to="/volunteer-signup"
            className="font-medium text-primary hover:underline"
          >
            Finish your volunteer sign up
          </Link>
        </p>
      </div>
    </div>
  );
}