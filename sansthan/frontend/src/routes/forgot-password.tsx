import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { api } from "@/lib/api";
import gsbLogo from "@/assests/gsb_seva.png";

export const Route = createFileRoute("/forgot-password")({
  head: () => ({ meta: [{ title: "Reset password — Divine Connect" }] }),
  component: ForgotPasswordPage,
});

type Step = "email" | "otp" | "reset" | "done";

const RESEND_COOLDOWN_SECONDS = 30;
const OTP_LENGTH = 6;

function getErrorMessage(err: any, fallback: string) {
  const data = err?.response?.data;
  if (!data) return fallback;
  if (typeof data.detail === "string") return data.detail;
  if (typeof data === "object") {
    const firstError = Object.values(data)[0];
    if (Array.isArray(firstError)) return String(firstError[0]);
    if (typeof firstError === "string") return firstError;
  }
  return fallback;
}

function ForgotPasswordPage() {
  const nav = useNavigate();
  const [step, setStep] = useState<Step>("email");

  const [email, setEmail] = useState("");
  const [otpDigits, setOtpDigits] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [shake, setShake] = useState(false);
  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [cooldown, setCooldown] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Auto-focus the first OTP box as soon as we land on the OTP step.
  useEffect(() => {
    if (step === "otp") {
      const t = setTimeout(() => otpInputRefs.current[0]?.focus(), 50);
      return () => clearTimeout(t);
    }
  }, [step]);

  // Auto-submit the instant all 6 digits are filled (typed, pasted, or autofilled).
  useEffect(() => {
    const code = otpDigits.join("");
    if (step === "otp" && code.length === OTP_LENGTH && !loading) {
      submitOtp(code);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [otpDigits, step]);

  function startCooldown() {
    setCooldown(RESEND_COOLDOWN_SECONDS);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }

  async function sendOtp(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await api.post("/auth/forgot-password/send-otp/", { email });
      setOtpDigits(Array(OTP_LENGTH).fill(""));
      setStep("otp");
      startCooldown();
    } catch (err: any) {
      setError(getErrorMessage(err, "Could not send OTP. Please try again."));
    } finally {
      setLoading(false);
    }
  }

  async function resendOtp() {
    if (cooldown > 0 || loading) return;
    setLoading(true);
    setError(null);
    try {
      await api.post("/auth/forgot-password/send-otp/", { email });
      setOtpDigits(Array(OTP_LENGTH).fill(""));
      otpInputRefs.current[0]?.focus();
      startCooldown();
    } catch (err: any) {
      setError(getErrorMessage(err, "Could not resend OTP. Please try again."));
    } finally {
      setLoading(false);
    }
  }

  function handleOtpChange(index: number, rawValue: string) {
    const digitsOnly = rawValue.replace(/\D/g, "");

    if (!digitsOnly) {
      setOtpDigits((prev) => {
        const next = [...prev];
        next[index] = "";
        return next;
      });
      return;
    }

    if (digitsOnly.length > 1) {
      // Multiple characters landed in one box — iOS SMS autofill does this.
      const chars = digitsOnly.slice(0, OTP_LENGTH - index).split("");
      setOtpDigits((prev) => {
        const next = [...prev];
        chars.forEach((c, i) => {
          if (index + i < OTP_LENGTH) next[index + i] = c;
        });
        return next;
      });
      const nextIndex = Math.min(index + chars.length, OTP_LENGTH - 1);
      otpInputRefs.current[nextIndex]?.focus();
      return;
    }

    setOtpDigits((prev) => {
      const next = [...prev];
      next[index] = digitsOnly;
      return next;
    });

    if (index < OTP_LENGTH - 1) {
      otpInputRefs.current[index + 1]?.focus();
    } else {
      otpInputRefs.current[index]?.blur();
    }
  }

  function handleOtpKeyDown(index: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace") {
      if (otpDigits[index]) {
        setOtpDigits((prev) => {
          const next = [...prev];
          next[index] = "";
          return next;
        });
      } else if (index > 0) {
        setOtpDigits((prev) => {
          const next = [...prev];
          next[index - 1] = "";
          return next;
        });
        otpInputRefs.current[index - 1]?.focus();
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      e.preventDefault();
      otpInputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < OTP_LENGTH - 1) {
      e.preventDefault();
      otpInputRefs.current[index + 1]?.focus();
    }
  }

  function handleOtpPaste(e: React.ClipboardEvent<HTMLInputElement>) {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);
    if (!pasted) return;
    const chars = pasted.split("");
    setOtpDigits((prev) => {
      const next = [...prev];
      chars.forEach((c, i) => {
        next[i] = c;
      });
      return next;
    });
    const nextIndex = Math.min(chars.length, OTP_LENGTH - 1);
    otpInputRefs.current[nextIndex]?.focus();
  }

  async function submitOtp(code: string) {
    if (code.length !== OTP_LENGTH || loading) return;
    setLoading(true);
    setError(null);
    try {
      const res = await api.post("/auth/forgot-password/verify-otp/", { email, otp: code });
      setResetToken(res.data.reset_token);
      setStep("reset");
    } catch (err: any) {
      setError(getErrorMessage(err, "Invalid OTP. Please try again."));
      setShake(true);
      setOtpDigits(Array(OTP_LENGTH).fill(""));
      otpInputRefs.current[0]?.focus();
      setTimeout(() => setShake(false), 450);
    } finally {
      setLoading(false);
    }
  }

  async function resetPassword(e: FormEvent) {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await api.post("/auth/forgot-password/reset-password/", {
        email,
        reset_token: resetToken,
        new_password: newPassword,
        confirm_password: confirmPassword,
      });
      setStep("done");
      setTimeout(() => {
        nav({ to: "/login", search: { resetSuccess: "1" } as any });
      }, 1800);
    } catch (err: any) {
      setError(getErrorMessage(err, "Could not reset your password."));
    } finally {
      setLoading(false);
    }
  }

  const otpValue = otpDigits.join("");

  return (
    <>
      <style>{`
        @keyframes otpShake {
          10%, 90% { transform: translateX(-1px); }
          20%, 80% { transform: translateX(2px); }
          30%, 50%, 70% { transform: translateX(-4px); }
          40%, 60% { transform: translateX(4px); }
        }
        @keyframes otpFadeIn {
          from { opacity: 0; transform: translateY(-2px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .otp-shake { animation: otpShake 0.45s cubic-bezier(.36,.07,.19,.97) both; }
        .otp-fade-in { animation: otpFadeIn 0.2s ease-out; }
      `}</style>

      <div className="min-h-screen grid place-items-center bg-background px-4">
        <div className="w-full max-w-md rounded-3xl border border-border bg-card p-8 shadow-lg">
          <div className="mb-6 flex items-center gap-3">
            <div className="grid h-16 w-16 shrink-0 place-items-center overflow-hidden rounded-2xl">
              <img src={gsbLogo} alt="GSB Seva Logo" className="h-full w-full object-contain" />
            </div>
            <div>
              <p className="font-serif text-xl font-semibold">Divine Connect</p>
            </div>
          </div>

          {step === "email" && (
            <>
              <h1 className="font-serif text-2xl font-semibold">Forgot password</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Enter the email on your account and we'll send you a one-time code.
              </p>
              <form onSubmit={sendOtp} className="mt-6 space-y-4">
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
                <button
                  disabled={loading}
                  className="w-full rounded-lg bg-primary py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-60"
                >
                  {loading ? "Sending..." : "Send OTP"}
                </button>
              </form>
            </>
          )}

          {step === "otp" && (
            <>
              <div className="mb-5 flex justify-center">
                <div className="relative grid h-14 w-14 place-items-center rounded-full bg-primary/10">
                  <span
                    className="absolute inset-0 animate-ping rounded-full bg-primary/20"
                    style={{ animationDuration: "2.5s" }}
                  />
                  <svg viewBox="0 0 24 24" fill="none" className="relative h-6 w-6 text-primary">
                    <rect x="3" y="5" width="18" height="14" rx="2.5" stroke="currentColor" strokeWidth="1.75" />
                    <path
                      d="M3 8l7.89 5.26a2 2 0 0 0 2.22 0L21 8"
                      stroke="currentColor"
                      strokeWidth="1.75"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>

              <h1 className="text-center font-serif text-2xl font-semibold">Enter the code</h1>
              <p className="mt-1 text-center text-sm text-muted-foreground">
                We sent a 6-digit code to <span className="font-medium text-foreground">{email}</span>
              </p>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  submitOtp(otpValue);
                }}
                className="mt-7 space-y-5"
              >
                <div className={`flex justify-center gap-1.5 sm:gap-2.5 ${shake ? "otp-shake" : ""}`}>
                  {otpDigits.map((digit, i) => (
                    <input
                      key={i}
                      ref={(el) => {
                        otpInputRefs.current[i] = el;
                      }}
                      type="text"
                      inputMode="numeric"
                      autoComplete={i === 0 ? "one-time-code" : "off"}
                      maxLength={i === 0 ? OTP_LENGTH : 1}
                      value={digit}
                      onChange={(e) => handleOtpChange(i, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(i, e)}
                      onPaste={handleOtpPaste}
                      className={`h-12 w-9 rounded-xl border text-center font-serif text-lg font-semibold outline-none transition-all duration-150 sm:h-14 sm:w-11 sm:text-2xl
                        focus:scale-105 focus:border-primary focus:ring-2 focus:ring-primary/25
                        ${digit ? "border-primary/70 bg-primary/5 text-foreground" : "border-border bg-background text-foreground"}`}
                    />
                  ))}
                </div>

                {error && <p className="otp-fade-in text-center text-sm text-rose-600">{error}</p>}

                <button
                  disabled={loading || otpValue.length !== OTP_LENGTH}
                  className="w-full rounded-lg bg-primary py-2.5 text-sm font-semibold text-primary-foreground transition-opacity disabled:opacity-60"
                >
                  {loading ? (
                    <span className="inline-flex items-center justify-center gap-2">
                      <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-primary-foreground/40 border-t-primary-foreground" />
                      Verifying...
                    </span>
                  ) : (
                    "Verify OTP"
                  )}
                </button>

                <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
                  {cooldown > 0 ? (
                    <span>
                      Resend code in <span className="font-medium tabular-nums text-foreground">{cooldown}s</span>
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={resendOtp}
                      disabled={loading}
                      className="font-semibold text-primary hover:underline disabled:opacity-50"
                    >
                      Resend code
                    </button>
                  )}
                </div>
              </form>

              <button
                type="button"
                onClick={() => {
                  setStep("email");
                  setError(null);
                }}
                className="mt-4 w-full text-center text-xs text-muted-foreground hover:underline"
              >
                Use a different email
              </button>
            </>
          )}

          {step === "reset" && (
            <>
              <h1 className="font-serif text-2xl font-semibold">Set a new password</h1>
              <p className="mt-1 text-sm text-muted-foreground">Code verified — choose a new password for {email}.</p>
              <form onSubmit={resetPassword} className="mt-6 space-y-4">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">New Password</label>
                  <input
                    type="password"
                    required
                    minLength={8}
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
                    minLength={8}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                  />
                </div>
                {error && <p className="text-sm text-rose-600">{error}</p>}
                <button
                  disabled={loading}
                  className="w-full rounded-lg bg-primary py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-60"
                >
                  {loading ? "Updating..." : "Reset password"}
                </button>
              </form>
            </>
          )}

          {step === "done" && (
            <>
              <h1 className="font-serif text-2xl font-semibold">Password reset successful</h1>
              <p className="mt-2 text-sm text-muted-foreground">Please login with your new password. Redirecting…</p>
            </>
          )}

          {step !== "done" && (
            <p className="mt-4 text-center text-xs text-muted-foreground">
              Remembered it?{" "}
              <Link to="/login" className="font-medium text-primary hover:underline">
                Back to sign in
              </Link>
            </p>
          )}
        </div>
      </div>
    </>
  );
}