import { useEffect, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { Bell, AlertTriangle, Info, CheckCircle2, UserPlus, Clock, Siren, MessageSquareText } from "lucide-react";
import {
  getNotifications,
  getUnreadCount,
  markNotificationRead,
  type NotificationType,
  type VolunteerNotification,
} from "@/api/notifications";

function iconFor(type: NotificationType) {
  switch (type) {
    case "announcement_urgent":
      return <AlertTriangle className="h-4 w-4 text-red-600" />;
    case "announcement_important":
      return <Info className="h-4 w-4 text-amber-600" />;
    case "status_update":
      return <CheckCircle2 className="h-4 w-4 text-emerald-600" />;
    case "new_volunteer_application":
      return <UserPlus className="h-4 w-4 text-blue-600" />;
    case "incident_reported":
      return <Siren className="h-4 w-4 text-rose-600" />;
    case "incident_response":
      return <MessageSquareText className="h-4 w-4 text-emerald-600" />;
    case "volunteer_approval_required":
    default:
      return <Clock className="h-4 w-4 text-orange-600" />;
  }
}

function timeAgo(iso: string) {
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export function NotificationBell() {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const unread = useQuery({
    queryKey: ["volunteerUnreadCount"],
    queryFn: getUnreadCount,
    refetchInterval: 30000,
  });

  const list = useQuery({
    queryKey: ["volunteerNotifications"],
    queryFn: getNotifications,
    enabled: open,
  });

  const markRead = useMutation({
    mutationFn: markNotificationRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["volunteerNotifications"] });
      queryClient.invalidateQueries({ queryKey: ["volunteerUnreadCount"] });
    },
  });

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const count = unread.data?.count ?? 0;

  function handleItemClick(n: VolunteerNotification) {
    if (!n.is_read) markRead.mutate(n.id);
    if (n.type === "incident_reported" || n.type === "incident_response") {
      setOpen(false);
      navigate({ to: "/admin/command" });
    }
  }

  return (
    <div className="relative" ref={containerRef}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="relative rounded-full p-2 text-muted-foreground hover:bg-muted"
      >
        <Bell className="h-5 w-5" />
        {count > 0 && (
          <span className="absolute right-1 top-1 grid h-4 w-4 place-items-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
            {count > 9 ? "9+" : count}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full z-40 mt-2 w-80 rounded-2xl border border-border bg-background p-3 shadow-xl">
          <div className="mb-2 flex items-center justify-between px-1">
            <p className="text-sm font-semibold">Notifications</p>
            {count > 0 && <span className="text-xs text-muted-foreground">{count} unread</span>}
          </div>

          <div className="max-h-96 space-y-1.5 overflow-y-auto">
            {list.isLoading && <p className="px-1 py-4 text-center text-xs text-muted-foreground">Loading…</p>}

            {!list.isLoading && list.data?.length === 0 && (
              <p className="px-1 py-4 text-center text-xs text-muted-foreground">No notifications yet.</p>
            )}

            {list.data?.map((n) => (
              <button
                key={n.id}
                onClick={() => handleItemClick(n)}
                className={`flex w-full items-start gap-2.5 rounded-xl border p-2.5 text-left text-sm transition-colors ${
                  n.is_read ? "border-border bg-background" : "border-primary/20 bg-primary/5"
                } hover:bg-muted/60`}
              >
                <span className="mt-0.5 shrink-0">{iconFor(n.type)}</span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-1.5">
                    <span className="truncate font-medium">{n.title}</span>
                    {!n.is_read && <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />}
                  </span>
                  <span className="mt-0.5 block truncate text-xs text-muted-foreground">{n.message}</span>
                  <span className="mt-1 block text-[11px] text-muted-foreground">{timeAgo(n.created_at)}</span>
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}