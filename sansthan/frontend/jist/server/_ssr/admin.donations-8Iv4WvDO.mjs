import { d as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { S as Repeat, U as Heart, i as Users, u as TrendingUp } from "../_libs/lucide-react.mjs";
import { n as PageHeader, t as ChartCard } from "./chart-card-Cwq4vD8L.mjs";
import { t as StatCard } from "./stat-card-Bp146Jdr.mjs";
import { h as getDonationTrend } from "./api-DLk44LQ3.mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { a as getRevenueMix } from "./dashboard-jXpg-CuC.mjs";
import { a as YAxis, c as Line, d as Pie, f as Cell, h as Legend, i as LineChart, l as CartesianGrid, m as Tooltip, n as PieChart, o as XAxis, p as ResponsiveContainer } from "../_libs/recharts+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.donations-8Iv4WvDO.js
var import_jsx_runtime = require_jsx_runtime();
var SplitComponent = () => {
	const trend = useQuery({
		queryKey: ["donationTrend"],
		queryFn: getDonationTrend
	});
	const mix = useQuery({
		queryKey: ["mix"],
		queryFn: getRevenueMix
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			eyebrow: "Fundraising",
			title: "Donation Management",
			subtitle: "Categories, campaigns, receipts and analytics across all donation channels."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid grid-cols-2 gap-4 lg:grid-cols-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
					label: "Received Today",
					value: "₹42.8L",
					icon: Heart,
					accent: "amber",
					trend: "flat"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
					label: "MTD",
					value: "₹8.4Cr",
					change: "+22%",
					icon: TrendingUp,
					accent: "emerald"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
					label: "Donors This Month",
					value: "18,420",
					icon: Users,
					accent: "sky",
					trend: "flat"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
					label: "Recurring",
					value: "4,210",
					icon: Repeat,
					accent: "amber",
					trend: "flat"
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-6 grid gap-4 lg:grid-cols-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "lg:col-span-2",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartCard, {
					title: "Donation trend",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-72",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
							width: "100%",
							height: "100%",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(LineChart, {
								data: trend.data || [],
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
										strokeDasharray: "3 3",
										stroke: "hsl(30 10% 90%)"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
										dataKey: "month",
										fontSize: 11,
										stroke: "hsl(30 10% 55%)"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
										fontSize: 11,
										stroke: "hsl(30 10% 55%)"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
										type: "monotone",
										dataKey: "amount",
										stroke: "hsl(35 90% 55%)",
										strokeWidth: 2.5,
										dot: { r: 3 }
									})
								]
							})
						})
					})
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartCard, {
				title: "Category mix",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "h-72",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
						width: "100%",
						height: "100%",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PieChart, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pie, {
							data: mix.data || [],
							dataKey: "value",
							nameKey: "name",
							innerRadius: 45,
							outerRadius: 90,
							children: (mix.data || []).map((e, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, { fill: e.color }, i))
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Legend, {
							verticalAlign: "bottom",
							iconType: "circle",
							wrapperStyle: { fontSize: 12 }
						})] })
					})
				})
			})]
		})
	] });
};
//#endregion
export { SplitComponent as component };
