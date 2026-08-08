import type { AuthUser } from "@/lib/auth-context";

/**
 * Where a user should land right after login (or if they try to open a
 * route that isn't theirs). One place to change this mapping later.
 */
export function getHomeRouteFor(user: Pick<AuthUser, "user_type">): string {
  switch (user.user_type) {
    case "admin":
      return "/admin";
    case "volunteer":
      return "/volunteer";
    case "devotee":
      return "/my-qr-code";
    default:
      return "/login";
  }
}