import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Bell } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import {
  getNotifications,
  getUnreadNotificationCount,
  markNotificationRead,
  type NotificationItem,
} from "@/api/volunteer-verification";
import { cn } from "@/lib/utils";
import { useVolunteerSocket } from "@/hooks/use-volunteer-socket";

export function NotificationBell() {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  // Keeps unread count / list live without polling or manual refresh.
  useVolunteerSocket();

  const unread = useQuery({
    queryKey: ["volunteerUnreadCount"],
    queryFn: getUnreadNotificationCount,
    refetchInterval: 30_000, // fallback in case the socket drops
  });

  const list = useQuery({
    queryKey: ["volunteerNotifications"],
    queryFn: getNotifications,
    enabled: open,
  });

  async function handleClick(n: NotificationItem) {
    if (!n.is_read) {
      await markNotificationRead(n.id);
      queryClient.invalidateQueries({ queryKey: ["volunteerNotifications"] });
      queryClient.invalidateQueries({ queryKey: ["volunteerUnreadCount"] });
    }
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="relative flex h-9 w-9 items-center justify-center rounded-full hover:bg-muted"
        aria-label="Notifications"
      >
        <Bell className="h-5 w-5" />
        {!!unread.data && unread.data > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold text-white">
            {unread.data > 9 ? "9+" : unread.data}
          </span>
        )}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 z-50 mt-2 w-80 rounded-lg border bg-background shadow-lg">
            <div className="border-b px-4 py-2 text-sm font-semibold">Notifications</div>
            <div className="max-h-96 overflow-y-auto">
              {list.isLoading && <div className="p-4 text-sm text-muted-foreground">Loading…</div>}
              {list.data?.length === 0 && (
                <div className="p-4 text-sm text-muted-foreground">No notifications yet.</div>
              )}
              {list.data?.map((n) => (
                <button
                  key={n.id}
                  onClick={() => handleClick(n)}
                  className={cn(
                    "block w-full border-b px-4 py-3 text-left text-sm last:border-0 hover:bg-muted/60",
                    !n.is_read && "bg-primary/5",
                  )}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-medium">{n.title}</span>
                    {!n.is_read && <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary" />}
                  </div>
                  <p className="mt-0.5 text-muted-foreground">{n.message}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(n.created_at), { addSuffix: true })}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}