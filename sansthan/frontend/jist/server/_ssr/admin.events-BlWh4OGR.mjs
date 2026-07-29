import { d as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { T as Plus, i as Users, lt as CalendarDays, p as Sparkles } from "../_libs/lucide-react.mjs";
import { n as PageHeader, t as ChartCard } from "./chart-card-Cwq4vD8L.mjs";
import { t as StatCard } from "./stat-card-Bp146Jdr.mjs";
import { t as DataTable } from "./data-table--xWc8i-0.mjs";
import { n as StatusBadge } from "./badges-D8YuufmK.mjs";
import { g as getEvents } from "./api-DLk44LQ3.mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.events-BlWh4OGR.js
var import_jsx_runtime = require_jsx_runtime();
var SplitComponent = () => {
	const q = useQuery({
		queryKey: ["events"],
		queryFn: getEvents
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			eyebrow: "Festivals",
			title: "Event Management",
			subtitle: "Plan, staff and run every festival and special utsav from one place.",
			actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				className: "inline-flex items-center gap-2 rounded-full bg-foreground px-4 py-2 text-xs font-semibold text-background",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-3.5 w-3.5" }), " New event"]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid grid-cols-2 gap-4 lg:grid-cols-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
					label: "Upcoming",
					value: "14",
					icon: CalendarDays,
					accent: "amber",
					trend: "flat"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
					label: "This Year",
					value: "42",
					icon: Sparkles,
					accent: "sky",
					trend: "flat"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
					label: "Expected Footfall",
					value: "14L",
					change: "peak",
					icon: Users,
					accent: "emerald",
					trend: "flat"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
					label: "Draft",
					value: "6",
					icon: CalendarDays,
					accent: "rose",
					trend: "flat"
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-6",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartCard, {
				title: "Event calendar",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DataTable, {
					rows: q.data || [],
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
							key: "name",
							header: "Event"
						},
						{
							key: "date",
							header: "Date"
						},
						{
							key: "visitors",
							header: "Expected"
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
};
//#endregion
export { SplitComponent as component };
