import { d as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { _ as Siren, i as Users, k as Radio, x as ShieldAlert } from "../_libs/lucide-react.mjs";
import { n as ExportButton, r as LiveBadge } from "./shell-CYtl6mUk.mjs";
import { n as PageHeader, t as ChartCard } from "./chart-card-Cwq4vD8L.mjs";
import { t as StatCard } from "./stat-card-Bp146Jdr.mjs";
import { t as SeverityBadge } from "./badges-D8YuufmK.mjs";
import { n as getAlerts } from "./dashboard-Byf2cyVT.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.command-0Wdo79lK.js
var import_jsx_runtime = require_jsx_runtime();
var SplitComponent = () => {
	const alerts = useQuery({
		queryKey: ["alerts"],
		queryFn: getAlerts
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			eyebrow: "Operations",
			title: "Command Centre",
			subtitle: "War-room view of every active incident, zone status and field response.",
			actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LiveBadge, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExportButton, {})] })
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid grid-cols-2 gap-4 lg:grid-cols-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
					label: "Active Alerts",
					value: "7",
					change: "2 new",
					icon: Siren,
					accent: "rose"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
					label: "Zones Green",
					value: "12 / 14",
					change: "86%",
					icon: ShieldAlert,
					accent: "emerald"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
					label: "Field Teams",
					value: "24",
					change: "on-ground",
					icon: Users,
					accent: "amber",
					trend: "flat"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
					label: "Radio Channels",
					value: "6",
					change: "clear",
					icon: Radio,
					accent: "sky",
					trend: "flat"
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-6",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartCard, {
				title: "Incident log",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "space-y-2",
					children: (alerts.data || []).map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start gap-3 rounded-xl border border-border p-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SeverityBadge, { severity: a.severity }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
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
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: "rounded-full border border-border px-3 py-1 text-xs font-medium hover:bg-muted",
								children: "Assign"
							})
						]
					}, a.id))
				})
			})
		})
	] });
};
//#endregion
export { SplitComponent as component };
