import { d as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { F as LogIn, P as LogOut, i as Users, o as UserCheck } from "../_libs/lucide-react.mjs";
import { n as PageHeader, t as ChartCard } from "./chart-card-Cwq4vD8L.mjs";
import { t as StatCard } from "./stat-card-Bp146Jdr.mjs";
import { t as DataTable } from "./data-table--xWc8i-0.mjs";
import { n as StatusBadge } from "./badges-D8YuufmK.mjs";
import { b as getVisitors } from "./api-DLk44LQ3.mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.visitors-DJF_9cH_.js
var import_jsx_runtime = require_jsx_runtime();
var SplitComponent = () => {
	const q = useQuery({
		queryKey: ["visitors"],
		queryFn: getVisitors
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			eyebrow: "Live",
			title: "Visitor Flow",
			subtitle: "Realtime check-ins, zone occupancy and exits across the campus."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid grid-cols-2 gap-4 lg:grid-cols-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
					label: "Inside Now",
					value: "18,432",
					change: "+12%",
					icon: UserCheck,
					accent: "emerald"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
					label: "Check-ins Today",
					value: "42,180",
					icon: LogIn,
					accent: "amber",
					trend: "flat"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
					label: "Exits Today",
					value: "24,050",
					icon: LogOut,
					accent: "sky",
					trend: "flat"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
					label: "Peak Concurrent",
					value: "21.4K",
					change: "6:30 PM",
					icon: Users,
					accent: "amber",
					trend: "flat"
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-6",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartCard, {
				title: "Recent check-ins",
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
							header: "Name"
						},
						{
							key: "checkIn",
							header: "Check In"
						},
						{
							key: "zone",
							header: "Zone"
						},
						{
							key: "party",
							header: "Party"
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
