import { d as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/stat-card-Bp146Jdr.js
var import_jsx_runtime = require_jsx_runtime();
function StatCard({ label, value, change, trend = "up", icon: Icon, accent = "amber" }) {
	const accents = {
		amber: "bg-amber-100 text-amber-700",
		sky: "bg-sky-100 text-sky-700",
		emerald: "bg-emerald-100 text-emerald-700",
		rose: "bg-rose-100 text-rose-700"
	};
	const trendColor = trend === "up" ? "text-emerald-600" : trend === "down" ? "text-amber-600" : "text-rose-600";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-2xl border border-border bg-card p-5 shadow-sm",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-start justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[11px] font-semibold uppercase tracking-wider text-muted-foreground truncate",
					children: label
				}), Icon && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: cn("grid h-9 w-9 shrink-0 place-items-center rounded-full", accents[accent]),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-4 w-4" })
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 font-serif text-3xl font-semibold text-foreground",
				children: value
			}),
			change && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: cn("mt-1 text-xs font-medium", trendColor),
				children: change
			})
		]
	});
}
//#endregion
export { StatCard as t };
