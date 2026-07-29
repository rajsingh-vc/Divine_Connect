import { d as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { U as Heart, W as HandHeart, dt as Boxes, h as ShoppingBag, i as Users, lt as CalendarDays, u as TrendingUp } from "../_libs/lucide-react.mjs";
import { n as ExportButton, r as LiveBadge } from "./shell-D4WxgETf.mjs";
import { n as PageHeader, t as ChartCard } from "./chart-card-Cwq4vD8L.mjs";
import { t as StatCard } from "./stat-card-Bp146Jdr.mjs";
import { t as DataTable } from "./data-table--xWc8i-0.mjs";
import { n as StatusBadge, t as SeverityBadge } from "./badges-D8YuufmK.mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { a as getRevenueMix, i as getRecentBookings, n as getAlerts, o as getVisitorFlow, r as getDashboardStats, t as getAiInsights } from "./dashboard-jXpg-CuC.mjs";
import { a as YAxis, d as Pie, f as Cell, h as Legend, l as CartesianGrid, m as Tooltip, n as PieChart, o as XAxis, p as ResponsiveContainer, s as Area, t as AreaChart } from "../_libs/recharts+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.index-Bk9UqVf_.js
var import_jsx_runtime = require_jsx_runtime();
function Dashboard() {
	const stats = useQuery({
		queryKey: ["stats"],
		queryFn: getDashboardStats
	});
	const flow = useQuery({
		queryKey: ["flow"],
		queryFn: getVisitorFlow
	});
	const insights = useQuery({
		queryKey: ["insights"],
		queryFn: getAiInsights
	});
	const mix = useQuery({
		queryKey: ["mix"],
		queryFn: getRevenueMix
	});
	const alerts = useQuery({
		queryKey: ["alerts"],
		queryFn: getAlerts
	});
	const bookings = useQuery({
		queryKey: ["recentBookings"],
		queryFn: getRecentBookings
	});
	const s = stats.data;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			eyebrow: "Live Overview",
			title: "Command Dashboard",
			subtitle: "Realtime visibility into visitors, bookings, donations and operational alerts across all zones.",
			actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LiveBadge, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExportButton, {})] })
		}),
		stats.isLoading || !s ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid grid-cols-2 gap-4 lg:grid-cols-4",
			children: Array.from({ length: 8 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-32 animate-pulse rounded-2xl bg-muted" }, i))
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid grid-cols-2 gap-4 lg:grid-cols-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
					label: "Live Visitors",
					value: s.liveVisitors.value,
					icon: Users,
					accent: "amber",
					trend: "flat"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
					label: "Today's Bookings",
					value: s.todaysBookings.value,
					icon: ShoppingBag,
					accent: "sky",
					trend: "flat"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
					label: "Today's Donations",
					value: s.todaysDonations.value,
					icon: Heart,
					accent: "emerald",
					trend: "flat"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
					label: "Volunteers On Duty",
					value: s.volunteersOnDuty.value,
					icon: HandHeart,
					accent: "amber",
					trend: "flat"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
					label: "Total Devotees",
					value: s.totalDevotees.value,
					icon: Users,
					accent: "sky",
					trend: "flat"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
					label: "Total Events",
					value: s.totalEvents.value,
					icon: CalendarDays,
					accent: "amber",
					trend: "flat"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
					label: "Inventory Alerts",
					value: s.inventoryAlerts.value,
					icon: Boxes,
					accent: "rose",
					trend: "flat"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
					label: "Revenue MTD",
					value: s.revenueMTD.value,
					icon: TrendingUp,
					accent: "emerald",
					trend: "flat"
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-6 grid gap-4 lg:grid-cols-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "lg:col-span-2",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartCard, {
					title: "Visitor & booking flow · today",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-72",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
							width: "100%",
							height: "100%",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AreaChart, {
								data: flow.data || [],
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("defs", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("linearGradient", {
										id: "gVis",
										x1: "0",
										y1: "0",
										x2: "0",
										y2: "1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
											offset: "0%",
											stopColor: "hsl(35 90% 55%)",
											stopOpacity: .5
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
											offset: "100%",
											stopColor: "hsl(35 90% 55%)",
											stopOpacity: 0
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("linearGradient", {
										id: "gBook",
										x1: "0",
										y1: "0",
										x2: "0",
										y2: "1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
											offset: "0%",
											stopColor: "hsl(210 70% 50%)",
											stopOpacity: .4
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
											offset: "100%",
											stopColor: "hsl(210 70% 50%)",
											stopOpacity: 0
										})]
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
										strokeDasharray: "3 3",
										stroke: "hsl(30 10% 90%)"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
										dataKey: "hour",
										fontSize: 11,
										stroke: "hsl(30 10% 55%)"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
										fontSize: 11,
										stroke: "hsl(30 10% 55%)"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Area, {
										type: "monotone",
										dataKey: "visitors",
										stroke: "hsl(35 90% 55%)",
										fill: "url(#gVis)",
										strokeWidth: 2
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Area, {
										type: "monotone",
										dataKey: "bookings",
										stroke: "hsl(210 70% 50%)",
										fill: "url(#gBook)",
										strokeWidth: 2
									})
								]
							})
						})
					})
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartCard, {
				title: "AI insights",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "space-y-3",
					children: (insights.data || []).map((i, k) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl border border-border bg-background p-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm font-semibold text-foreground",
							children: i.title
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-xs text-muted-foreground",
							children: i.detail
						})]
					}, k))
				})
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-6 grid gap-4 lg:grid-cols-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartCard, {
				title: "Revenue mix · 12 months",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "h-64",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
						width: "100%",
						height: "100%",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PieChart, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pie, {
							data: mix.data || [],
							dataKey: "value",
							nameKey: "name",
							innerRadius: 50,
							outerRadius: 90,
							paddingAngle: 2,
							children: (mix.data || []).map((e, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, { fill: e.color }, i))
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Legend, {
							verticalAlign: "bottom",
							iconType: "circle",
							wrapperStyle: { fontSize: 12 }
						})] })
					})
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "lg:col-span-2",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartCard, {
					title: "Active alerts",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "space-y-2",
						children: (alerts.data || []).map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start gap-3 rounded-xl border border-border p-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SeverityBadge, { severity: a.severity }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0 flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-sm font-medium text-foreground",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-xs uppercase tracking-wider text-muted-foreground",
											children: a.category
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "mx-2 text-muted-foreground",
											children: "·"
										}),
										a.desc
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-0.5 text-xs text-muted-foreground",
									children: [
										a.id,
										" · ",
										a.time
									]
								})]
							})]
						}, a.id))
					})
				})
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-6",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartCard, {
				title: "Recent bookings",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DataTable, {
					rows: bookings.data || [],
					columns: [
						{
							key: "id",
							header: "ID",
							render: (r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-mono text-xs text-muted-foreground",
								children: r.id
							})
						},
						{
							key: "devotee",
							header: "Devotee"
						},
						{
							key: "seva",
							header: "Seva"
						},
						{
							key: "date",
							header: "Date"
						},
						{
							key: "slot",
							header: "Slot"
						},
						{
							key: "amount",
							header: "Amount",
							render: (r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-semibold",
								children: r.amount
							})
						},
						{
							key: "status",
							header: "Status",
							render: (r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { status: r.status })
						}
					]
				})
			})
		})
	] });
}
//#endregion
export { Dashboard as component };
