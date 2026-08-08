import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { AdminShell } from "@/components/admin/shell";
import { useAuth } from "@/lib/auth-context";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Sansthan Console" }] }),
  component: ProtectedAdmin,
});

/** Client-side auth guard: only checks that someone is logged in.
 * Admin, volunteer, and devotee all share the same console shell —
 * what each of them can *do* inside it is gated per-page/per-action,
 * not by blocking the route itself. */
function ProtectedAdmin() {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) {
      navigate({ to: "/login" });
    }
  }, [isLoading, isAuthenticated]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-sm text-muted-foreground">Loading your console…</p>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return <AdminShell />;
}