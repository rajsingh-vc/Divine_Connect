import { createFileRoute, redirect } from "@tanstack/react-router";
import { QRCodeCard } from "@/components/devotee/qr-code-card";
import { getStoredUser } from "@/lib/api";
import type { AuthUser } from "@/lib/auth-context";
import { getHomeRouteFor } from "@/lib/role-redirect";

export const Route = createFileRoute("/MyQRCode")({
  beforeLoad: () => {
    const user = getStoredUser<AuthUser>();
    if (!user) {
      throw redirect({ to: "/login" });
    }
    if (user.user_type !== "devotee") {
      // Admins/volunteers shouldn't see this page — send them home instead.
      throw redirect({ to: getHomeRouteFor(user) });
    }
  },
  head: () => ({
    meta: [{ title: "My QR Code — Sansthan Console" }],
  }),
  component: QRCodeCard,
});