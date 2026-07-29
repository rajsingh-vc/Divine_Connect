import { d as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { A as PackageCheck, c as Truck, dt as Boxes, l as TriangleAlert } from "../_libs/lucide-react.mjs";
import { n as PageHeader, t as ChartCard } from "./chart-card-Cwq4vD8L.mjs";
import { t as StatCard } from "./stat-card-Bp146Jdr.mjs";
import { t as DataTable } from "./data-table--xWc8i-0.mjs";
import { n as StatusBadge } from "./badges-D8YuufmK.mjs";
import { _ as getInventory } from "./api-DLk44LQ3.mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.inventory-dOnS-Bwy.js
var import_jsx_runtime = require_jsx_runtime();
var SplitComponent = () => {
	const q = useQuery({
		queryKey: ["inventory"],
		queryFn: getInventory
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			eyebrow: "Supply",
			title: "Inventory & Prasad",
			subtitle: "Stock levels, replenishment schedules and prasad distribution tracking."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid grid-cols-2 gap-4 lg:grid-cols-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
					label: "Total SKUs",
					value: "128",
					icon: Boxes,
					accent: "amber",
					trend: "flat"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
					label: "Low Stock",
					value: "9",
					change: "review",
					icon: TriangleAlert,
					accent: "rose",
					trend: "flat"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
					label: "Dispatched Today",
					value: "4,240",
					icon: PackageCheck,
					accent: "emerald"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
					label: "Purchase Orders",
					value: "12",
					change: "open",
					icon: Truck,
					accent: "sky",
					trend: "flat"
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-6",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartCard, {
				title: "Stock levels",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DataTable, {
					rows: q.data || [],
					columns: [
						{
							key: "sku",
							header: "SKU",
							render: (r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-mono text-xs text-muted-foreground",
								children: r.sku
							})
						},
						{
							key: "item",
							header: "Item"
						},
						{
							key: "stock",
							header: "Stock"
						},
						{
							key: "min",
							header: "Min"
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
