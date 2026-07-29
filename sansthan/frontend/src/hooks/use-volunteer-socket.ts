import { useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { getAccessToken } from "@/lib/api";

/**
 * Opens a WebSocket to the Django Channels backend and keeps notification /
 * volunteer-approval react-query caches fresh in real time, no page refresh
 * needed. Reconnects automatically with backoff if the connection drops.
 */
export function useVolunteerSocket() {
  const queryClient = useQueryClient();
  const retryRef = useRef(0);

  useEffect(() => {
    let socket: WebSocket | null = null;
    let closedByCleanup = false;
    let retryTimeout: ReturnType<typeof setTimeout>;

    function connect() {
      const token = getAccessToken();
      if (!token) return;

      const base = (import.meta.env.VITE_API_URL || "http://localhost:8000/api").replace(/\/api\/?$/, "");
      const wsBase = base.replace(/^http/, "ws");
      socket = new WebSocket(`${wsBase}/ws/volunteers/notifications/?token=${token}`);

      socket.onopen = () => {
        retryRef.current = 0;
      };

      socket.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data);
          queryClient.invalidateQueries({ queryKey: ["volunteerNotifications"] });
          queryClient.invalidateQueries({ queryKey: ["volunteerUnreadCount"] });
          if (payload.volunteer_id) {
            queryClient.invalidateQueries({ queryKey: ["volunteerApprovalsPage"] });
            queryClient.invalidateQueries({ queryKey: ["volunteerDetail", payload.volunteer_id] });
          }
        } catch {
          // ignore malformed frames
        }
      };

      socket.onclose = () => {
        if (closedByCleanup) return;
        const delay = Math.min(1000 * 2 ** retryRef.current, 15000);
        retryRef.current += 1;
        retryTimeout = setTimeout(connect, delay);
      };
    }

    connect();

    return () => {
      closedByCleanup = true;
      clearTimeout(retryTimeout);
      socket?.close();
    };
  }, [queryClient]);
}