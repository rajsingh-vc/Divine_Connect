import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  beforeLoad: () => {
    // Everyone lands in the shared console now — role no longer decides
    // the destination, only auth state does.
    throw redirect({ to: "/admin" });
  },
  component: () => null,
});