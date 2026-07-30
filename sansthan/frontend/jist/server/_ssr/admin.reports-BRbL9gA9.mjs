import { d as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { d as TrendingUp, et as FileDown, mt as ChartColumn, pt as ChartPie } from "../_libs/lucide-react.mjs";
import { n as PageHeader, t as ChartCard } from "./chart-card-Cwq4vD8L.mjs";
import { t as StatCard } from "./stat-card-Bp146Jdr.mjs";
import { a as YAxis, l as CartesianGrid, m as Tooltip, o as XAxis, p as ResponsiveContainer, r as BarChart, u as Bar } from "../_libs/recharts+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.reports-BRbL9gA9.js
var import_jsx_runtime = require_jsx_runtime();
var data = [
	{
		name: "Sevas",
		value: 4200
	},
	{
		name: "Donations",
		value: 3100
	},
	{
		name: "Prasad",
		value: 1800
	},
	{
		name: "Events",
		value: 2400
	},
	{
		name: "Merch",
		value: 900
	},
	{
		name: "Other",
		value: 500
	}
];
var SplitComponent = () => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
	/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
		eyebrow: "Analytics",
		title: "Reports & Insights",
		subtitle: "Download board-ready reports on revenue, footfall, sevas and donor retention."
	}),
	/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid grid-cols-2 gap-4 lg:grid-cols-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
				label: "Saved Reports",
				value: "38",
				icon: ChartColumn,
				accent: "amber",
				trend: "flat"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
				label: "Scheduled",
				value: "12",
				icon: ChartPie,
				accent: "sky",
				trend: "flat"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
				label: "Downloads MTD",
				value: "482",
				change: "+24%",
				icon: FileDown,
				accent: "emerald"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
				label: "Data Freshness",
				value: "Live",
				icon: TrendingUp,
				accent: "amber",
				trend: "flat"
			})
		]
	}),
	/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mt-6",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartCard, {
			title: "Revenue by category · MTD",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "h-72",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
					width: "100%",
					height: "100%",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
						data,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
								strokeDasharray: "3 3",
								stroke: "hsl(30 10% 90%)"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
								dataKey: "name",
								fontSize: 11,
								stroke: "hsl(30 10% 55%)"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
								fontSize: 11,
								stroke: "hsl(30 10% 55%)"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
								dataKey: "value",
								fill: "hsl(35 90% 55%)",
								radius: [
									6,
									6,
									0,
									0
								]
							})
						]
					})
				})
			})
		})
	})
] });
//#endregion
export { SplitComponent as component };
