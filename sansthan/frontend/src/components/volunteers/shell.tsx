import { Link, Outlet, useRouterState } from "@tanstack/react-router";
// import line — add ClipboardList
import {
  LayoutDashboard, ShieldAlert, Users, Sparkles, CalendarCheck, Heart,
  HandHeart, UserCheck, Boxes, CalendarDays, FileText, BarChart3,
  MessageSquare, Bot, Settings, Bell, Search, Download, Home, LayoutGrid, User, ClipboardList,
} from "lucide-react";
import { useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth-context";
import { NotificationBell } from "@/components/notification-bell";
import gsbLogo from "@/assests/gsb_seva.png";


function initials(name?: string) {
  if (!name) return "?";
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");
}

// Each nav item can optionally declare `hiddenFor`: the user_types that
// should NOT see it in the sidebar (nor in the mobile modules sheet).
// Admin, volunteer, and devotee all render from this single list — what's
// visible to each role is controlled entirely by `hiddenFor` below.
type NavItem = {
  to: string;
  label: string;
  icon: typeof LayoutDashboard;
  exact?: boolean;
  hiddenFor?: string[];
};

const NAV: { label: string; items: NavItem[] }[] = [
  {
    label: "Overview",
    items: [
      { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
      { to: "/admin/command", label: "Command Centre", icon: ShieldAlert, hiddenFor: ["devotee"] },
    ],
  },
  {
    label: "Operations",
    items: [
      { to: "/admin/devotees", label: "Devotees", icon: Users, hiddenFor: ["devotee"] },
      { to: "/admin/sevas", label: "Sevas & Services", icon: Sparkles },
      { to: "/admin/bookings", label: "Bookings", icon: CalendarCheck },
      { to: "/admin/donations", label: "Donations", icon: Heart },
      { to: "/admin/volunteer-approvals", label: "Volunteers", icon: HandHeart, hiddenFor: ["volunteer"] },
      { to: "/admin/visitors", label: "Visitors", icon: UserCheck },
      { to: "/admin/inventory", label: "Inventory & Prasad", icon: Boxes, hiddenFor: ["devotee"] },
      { to: "/admin/events", label: "Events", icon: CalendarDays, hiddenFor: ["admin", "volunteer", "devotee"] },
      { to: "/admin/tasks", label: "Tasks", icon: ClipboardList, hiddenFor: ["admin", "volunteer", "devotee"] },
      { to: "/admin/duties", label: "Duties", icon: ClipboardList, hiddenFor: ["devotee"] },
    ],
  },
  {
    label: "Content & Insight",
    items: [
      { to: "/admin/cms", label: "CMS", icon: FileText },
      { to: "/admin/reports", label: "Reports", icon: BarChart3 },
      { to: "/admin/communication", label: "Communication", icon: MessageSquare, hiddenFor: ["admin", "devotee"] },
      { to: "/admin/ai", label: "AI & Integrations", icon: Bot, hiddenFor: ["admin", "volunteer", "devotee"] },
    ],
  },
  {
    label: "Platform",
    items: [{ to: "/admin/platform", label: "Platform Admin", icon: Settings, hiddenFor: ["admin", "volunteer", "devotee"] }],
  },
];

/** Filters NAV down to the groups/items visible for a given user_type,
 * dropping any group left with zero items. */
function useVisibleNav() {
  const { user } = useAuth();
  const role = user?.user_type ?? "";
  return NAV
    .map((group) => ({
      ...group,
      items: group.items.filter((it) => !it.hiddenFor || !it.hiddenFor.includes(role)),
    }))
    .filter((group) => group.items.length > 0);
}

function Sidebar() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const visibleNav = useVisibleNav();
  return (
    <aside className="hidden md:flex fixed inset-y-0 left-0 z-30 w-64 flex-col border-r border-sidebar-border bg-sidebar">
      <div className="flex items-center gap-3 border-b border-sidebar-border px-5 py-5">
        <div className="grid h-16 w-16 shrink-0 place-items-center overflow-hidden rounded-2xl">
          <img
            src={gsbLogo}
            alt="GSB Seva Logo"
            className="h-full w-full object-contain"
          />
        </div>
        <div className="min-w-0">
          <p className="font-serif text-base font-semibold text-sidebar-foreground truncate">Divine Connect</p>
          {/* <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Enterprise Suite</p> */}
        </div>
      </div>
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        {visibleNav.map((group) => (
          <div key={group.label} className="mb-4">
            <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              {group.label}
            </p>
            <ul className="space-y-0.5">
              {group.items.map((it) => {
                const active = it.exact ? path === it.to : path === it.to || path.startsWith(it.to + "/");
                const Icon = it.icon;
                return (
                  <li key={it.to}>
                    <Link
                      to={it.to}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                        active
                          ? "bg-sidebar-accent text-sidebar-accent-foreground"
                          : "text-sidebar-foreground/80 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground",
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      <span className="truncate">{it.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
      <div className="border-t border-sidebar-border p-4">
        <SidebarUser />
      </div>
    </aside>
  );
}

function SidebarUser() {
  const { user, logout } = useAuth();
  return (
    <>
      <button onClick={logout} className="mb-3 block text-xs font-medium text-primary hover:underline">
        ← Log out
      </button>
      <div className="flex items-center gap-3">
        <div className="relative">
          <div className="grid h-10 w-10 place-items-center rounded-full bg-primary/15 text-primary font-semibold">
            {initials(user?.full_name)}
          </div>
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-sidebar-foreground truncate">{user?.full_name ?? "—"}</p>
          <p className="text-xs text-muted-foreground truncate capitalize">{user?.user_type ?? ""}</p>
        </div>
      </div>
    </>
  );
}

function Topbar() {
  return (
    <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-border bg-background/90 px-4 py-3 backdrop-blur md:px-8">
      <div className="flex-1 max-w-xl">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            placeholder="Search devotees, bookings, sevas..."
            className="w-full rounded-full border border-border bg-card py-2 pl-10 pr-4 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </div>
      <NotificationBell />
      <TopbarUser />
    </header>
  );
}

function TopbarUser() {
  const { user } = useAuth();
  return (
    <div className="hidden sm:flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5">
      <div className="grid h-8 w-8 place-items-center rounded-full bg-primary/15 text-primary text-xs font-semibold">
        {initials(user?.full_name)}
      </div>
      <div className="text-left leading-tight">
        <p className="text-sm font-semibold">{user?.full_name ?? "—"}</p>
        <p className="text-[11px] text-muted-foreground capitalize">{user?.user_type ?? ""}</p>
      </div>
    </div>
  );
}

function MobileNav() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const [modules, setModules] = useState(false);
  const visibleNav = useVisibleNav();
  const flatItems = visibleNav.flatMap((g) => g.items);
  const hasCommand = flatItems.some((it) => it.to === "/admin/command");
  const hasPlatform = flatItems.some((it) => it.to === "/admin/platform");
  return (
    <>
      <nav className="md:hidden fixed inset-x-0 bottom-0 z-30 grid grid-cols-5 border-t border-border bg-background/95 backdrop-blur">
        <Link to="/admin" className={cn("flex flex-col items-center gap-1 py-2 text-[10px] font-medium", path === "/admin" ? "text-primary" : "text-muted-foreground")}>
          <Home className="h-5 w-5" /> Home
        </Link>
        <button onClick={() => setModules(true)} className="flex flex-col items-center gap-1 py-2 text-[10px] font-medium text-muted-foreground">
          <LayoutGrid className="h-5 w-5" /> Modules
        </button>
        {hasCommand && (
          <Link to="/admin/command" className={cn("flex flex-col items-center gap-1 py-2 text-[10px] font-medium", path.startsWith("/admin/command") ? "text-primary" : "text-muted-foreground")}>
            <Bell className="h-5 w-5" /> Alerts
          </Link>
        )}
        {hasCommand && (
          <Link to="/admin/command" className="flex flex-col items-center gap-1 py-2 text-[10px] font-medium text-muted-foreground">
            <ShieldAlert className="h-5 w-5" /> Command
          </Link>
        )}
        {hasPlatform && (
          <Link to="/admin/platform" className="flex flex-col items-center gap-1 py-2 text-[10px] font-medium text-muted-foreground">
            <User className="h-5 w-5" /> Profile
          </Link>
        )}
      </nav>
      {modules && (
        <div className="md:hidden fixed inset-0 z-40 bg-black/50 p-4" onClick={() => setModules(false)}>
          <div className="mx-auto mt-20 max-w-md rounded-2xl bg-card p-4 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <p className="mb-3 text-sm font-semibold">Modules</p>
            <div className="grid grid-cols-3 gap-2">
              {flatItems.map((it) => {
                const Icon = it.icon;
                return (
                  <Link key={it.to} to={it.to} onClick={() => setModules(false)} className="flex flex-col items-center gap-1 rounded-xl border border-border p-3 text-center text-xs hover:bg-muted">
                    <Icon className="h-5 w-5 text-primary" />
                    {it.label}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export function AdminShell({ children }: { children?: ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Sidebar />
      <div className="md:pl-64">
        <Topbar />
        <main className="px-4 pb-24 pt-6 md:px-8 md:pb-10">{children ?? <Outlet />}</main>
      </div>
      <MobileNav />
    </div>
  );
}

export function LiveBadge() {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" /> Live
    </span>
  );
}

export function ExportButton() {
  return (
    <button className="inline-flex items-center gap-2 rounded-full bg-foreground px-4 py-2 text-xs font-semibold text-background hover:opacity-90">
      <Download className="h-3.5 w-3.5" /> Export
    </button>
  );
}