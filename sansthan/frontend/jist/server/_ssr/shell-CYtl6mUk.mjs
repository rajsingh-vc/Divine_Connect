import { o as __toESM } from "../_runtime.mjs";
import { s as unwrap, t as api } from "./api-CK4IlaGP.mjs";
import { d as require_jsx_runtime, f as require_react } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { n as useAuth } from "./auth-context-CAyad5oA.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { f as Outlet, g as Link, l as useRouterState } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { $ as FileText, G as LayoutDashboard, J as House, K as Info, L as MessageSquare, S as Settings, T as Search, W as LayoutGrid, X as HandHeart, Y as Heart, _t as CalendarDays, a as User, bt as Bot, g as Sparkles, i as Users, it as Clock, lt as CircleCheck, mt as ChartColumn, nt as Download, o as UserPlus, ot as ClipboardList, s as UserCheck, u as TriangleAlert, vt as CalendarCheck, x as ShieldAlert, xt as Bell, yt as Boxes } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/shell-CYtl6mUk.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
async function getNotifications() {
	const { data } = await api.get("/volunteers/notifications/");
	return unwrap(data);
}
async function getUnreadCount() {
	const { data } = await api.get("/volunteers/notifications/unread-count/");
	return data;
}
async function markNotificationRead(id) {
	const { data } = await api.post(`/volunteers/notifications/${id}/read/`);
	return data;
}
function iconFor(type) {
	switch (type) {
		case "announcement_urgent": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "h-4 w-4 text-red-600" });
		case "announcement_important": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, { className: "h-4 w-4 text-amber-600" });
		case "status_update": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-4 w-4 text-emerald-600" });
		case "new_volunteer_application": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserPlus, { className: "h-4 w-4 text-blue-600" });
		default: return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "h-4 w-4 text-orange-600" });
	}
}
function timeAgo(iso) {
	const diffMs = Date.now() - new Date(iso).getTime();
	const mins = Math.floor(diffMs / 6e4);
	if (mins < 1) return "just now";
	if (mins < 60) return `${mins}m ago`;
	const hours = Math.floor(mins / 60);
	if (hours < 24) return `${hours}h ago`;
	return `${Math.floor(hours / 24)}d ago`;
}
function NotificationBell() {
	const [open, setOpen] = (0, import_react.useState)(false);
	const containerRef = (0, import_react.useRef)(null);
	const queryClient = useQueryClient();
	const unread = useQuery({
		queryKey: ["volunteerUnreadCount"],
		queryFn: getUnreadCount,
		refetchInterval: 3e4
	});
	const list = useQuery({
		queryKey: ["volunteerNotifications"],
		queryFn: getNotifications,
		enabled: open
	});
	const markRead = useMutation({
		mutationFn: markNotificationRead,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["volunteerNotifications"] });
			queryClient.invalidateQueries({ queryKey: ["volunteerUnreadCount"] });
		}
	});
	(0, import_react.useEffect)(() => {
		function handleClickOutside(e) {
			if (containerRef.current && !containerRef.current.contains(e.target)) setOpen(false);
		}
		if (open) document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, [open]);
	const count = unread.data?.count ?? 0;
	function handleItemClick(n) {
		if (!n.is_read) markRead.mutate(n.id);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative",
		ref: containerRef,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			onClick: () => setOpen((o) => !o),
			className: "relative rounded-full p-2 text-muted-foreground hover:bg-muted",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bell, { className: "h-5 w-5" }), count > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "absolute right-1 top-1 grid h-4 w-4 place-items-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground",
				children: count > 9 ? "9+" : count
			})]
		}), open && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "absolute right-0 top-full z-40 mt-2 w-80 rounded-2xl border border-border bg-background p-3 shadow-xl",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-2 flex items-center justify-between px-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm font-semibold",
					children: "Notifications"
				}), count > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "text-xs text-muted-foreground",
					children: [count, " unread"]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "max-h-96 space-y-1.5 overflow-y-auto",
				children: [
					list.isLoading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "px-1 py-4 text-center text-xs text-muted-foreground",
						children: "Loading…"
					}),
					!list.isLoading && list.data?.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "px-1 py-4 text-center text-xs text-muted-foreground",
						children: "No notifications yet."
					}),
					list.data?.map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => handleItemClick(n),
						className: `flex w-full items-start gap-2.5 rounded-xl border p-2.5 text-left text-sm transition-colors ${n.is_read ? "border-border bg-background" : "border-primary/20 bg-primary/5"} hover:bg-muted/60`,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "mt-0.5 shrink-0",
							children: iconFor(n.type)
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "min-w-0 flex-1",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "flex items-center gap-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "truncate font-medium",
										children: n.title
									}), !n.is_read && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-1.5 w-1.5 shrink-0 rounded-full bg-primary" })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "mt-0.5 block truncate text-xs text-muted-foreground",
									children: n.message
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "mt-1 block text-[11px] text-muted-foreground",
									children: timeAgo(n.created_at)
								})
							]
						})]
					}, n.id))
				]
			})]
		})]
	});
}
var gsb_seva_default = "/assets/gsb_seva-DTV4GEtZ.png";
function initials(name) {
	if (!name) return "?";
	return name.split(" ").filter(Boolean).slice(0, 2).map((p) => p[0]?.toUpperCase()).join("");
}
var NAV = [
	{
		label: "Overview",
		items: [{
			to: "/admin",
			label: "Dashboard",
			icon: LayoutDashboard,
			exact: true
		}, {
			to: "/admin/command",
			label: "Command Centre",
			icon: ShieldAlert
		}]
	},
	{
		label: "Operations",
		items: [
			{
				to: "/admin/devotees",
				label: "Devotees",
				icon: Users
			},
			{
				to: "/admin/sevas",
				label: "Sevas & Services",
				icon: Sparkles
			},
			{
				to: "/admin/bookings",
				label: "Bookings",
				icon: CalendarCheck
			},
			{
				to: "/admin/donations",
				label: "Donations",
				icon: Heart
			},
			{
				to: "/admin/volunteer-approvals",
				label: "Volunteers",
				icon: HandHeart
			},
			{
				to: "/admin/visitors",
				label: "Visitors",
				icon: UserCheck
			},
			{
				to: "/admin/inventory",
				label: "Inventory & Prasad",
				icon: Boxes
			},
			{
				to: "/admin/events",
				label: "Events",
				icon: CalendarDays
			},
			{
				to: "/admin/tasks",
				label: "Tasks",
				icon: ClipboardList
			}
		]
	},
	{
		label: "Content & Insight",
		items: [
			{
				to: "/admin/cms",
				label: "CMS",
				icon: FileText
			},
			{
				to: "/admin/reports",
				label: "Reports",
				icon: ChartColumn
			},
			{
				to: "/admin/communication",
				label: "Communication",
				icon: MessageSquare
			},
			{
				to: "/admin/ai",
				label: "AI & Integrations",
				icon: Bot
			}
		]
	},
	{
		label: "Platform",
		items: [{
			to: "/admin/platform",
			label: "Platform Admin",
			icon: Settings
		}]
	}
];
function Sidebar() {
	const path = useRouterState({ select: (s) => s.location.pathname });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
		className: "hidden md:flex fixed inset-y-0 left-0 z-30 w-64 flex-col border-r border-sidebar-border bg-sidebar",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-3 border-b border-sidebar-border px-5 py-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid h-16 w-16 shrink-0 place-items-center overflow-hidden rounded-2xl",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: gsb_seva_default,
						alt: "GSB Seva Logo",
						className: "h-full w-full object-contain"
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "min-w-0",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-serif text-base font-semibold text-sidebar-foreground truncate",
						children: "Divine Connect"
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
				className: "flex-1 overflow-y-auto px-3 py-4",
				children: NAV.map((group) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground",
						children: group.label
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "space-y-0.5",
						children: group.items.map((it) => {
							const active = it.exact ? path === it.to : path === it.to || path.startsWith(it.to + "/");
							const Icon = it.icon;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: it.to,
								className: cn("flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors", active ? "bg-sidebar-accent text-sidebar-accent-foreground" : "text-sidebar-foreground/80 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground"),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "truncate",
									children: it.label
								})]
							}) }, it.to);
						})
					})]
				}, group.label))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "border-t border-sidebar-border p-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SidebarUser, {})
			})
		]
	});
}
function SidebarUser() {
	const { user, logout } = useAuth();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		onClick: logout,
		className: "mb-3 block text-xs font-medium text-primary hover:underline",
		children: "← Log out"
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center gap-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "relative",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid h-10 w-10 place-items-center rounded-full bg-primary/15 text-primary font-semibold",
				children: initials(user?.full_name)
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "min-w-0",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm font-semibold text-sidebar-foreground truncate",
				children: user?.full_name ?? "—"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-muted-foreground truncate capitalize",
				children: user?.user_type ?? ""
			})]
		})]
	})] });
}
function Topbar() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
		className: "sticky top-0 z-20 flex items-center gap-3 border-b border-border bg-background/90 px-4 py-3 backdrop-blur md:px-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex-1 max-w-xl",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "search",
						placeholder: "Search devotees, bookings, sevas...",
						className: "w-full rounded-full border border-border bg-card py-2 pl-10 pr-4 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NotificationBell, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TopbarUser, {})
		]
	});
}
function TopbarUser() {
	const { user } = useAuth();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "hidden sm:flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid h-8 w-8 place-items-center rounded-full bg-primary/15 text-primary text-xs font-semibold",
			children: initials(user?.full_name)
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "text-left leading-tight",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm font-semibold",
				children: user?.full_name ?? "—"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-[11px] text-muted-foreground capitalize",
				children: user?.user_type ?? ""
			})]
		})]
	});
}
function MobileNav() {
	const path = useRouterState({ select: (s) => s.location.pathname });
	const [modules, setModules] = (0, import_react.useState)(false);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
		className: "md:hidden fixed inset-x-0 bottom-0 z-30 grid grid-cols-5 border-t border-border bg-background/95 backdrop-blur",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/admin",
				className: cn("flex flex-col items-center gap-1 py-2 text-[10px] font-medium", path === "/admin" ? "text-primary" : "text-muted-foreground"),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(House, { className: "h-5 w-5" }), " Home"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				onClick: () => setModules(true),
				className: "flex flex-col items-center gap-1 py-2 text-[10px] font-medium text-muted-foreground",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LayoutGrid, { className: "h-5 w-5" }), " Modules"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/admin/command",
				className: cn("flex flex-col items-center gap-1 py-2 text-[10px] font-medium", path.startsWith("/admin/command") ? "text-primary" : "text-muted-foreground"),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bell, { className: "h-5 w-5" }), " Alerts"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/admin/command",
				className: "flex flex-col items-center gap-1 py-2 text-[10px] font-medium text-muted-foreground",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldAlert, { className: "h-5 w-5" }), " Command"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/admin/platform",
				className: "flex flex-col items-center gap-1 py-2 text-[10px] font-medium text-muted-foreground",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, { className: "h-5 w-5" }), " Profile"]
			})
		]
	}), modules && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "md:hidden fixed inset-0 z-40 bg-black/50 p-4",
		onClick: () => setModules(false),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto mt-20 max-w-md rounded-2xl bg-card p-4 shadow-xl",
			onClick: (e) => e.stopPropagation(),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mb-3 text-sm font-semibold",
				children: "Modules"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-3 gap-2",
				children: NAV.flatMap((g) => g.items).map((it) => {
					const Icon = it.icon;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: it.to,
						onClick: () => setModules(false),
						className: "flex flex-col items-center gap-1 rounded-xl border border-border p-3 text-center text-xs hover:bg-muted",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-5 w-5 text-primary" }), it.label]
					}, it.to);
				})
			})]
		})
	})] });
}
function AdminShell({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background text-foreground",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sidebar, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "md:pl-64",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Topbar, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
					className: "px-4 pb-24 pt-6 md:px-8 md:pb-10",
					children: children ?? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MobileNav, {})
		]
	});
}
function LiveBadge() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: "inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" }), " Live"]
	});
}
function ExportButton() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		className: "inline-flex items-center gap-2 rounded-full bg-foreground px-4 py-2 text-xs font-semibold text-background hover:opacity-90",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "h-3.5 w-3.5" }), " Export"]
	});
}
//#endregion
export { ExportButton as n, LiveBadge as r, AdminShell as t };
