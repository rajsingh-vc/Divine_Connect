import { d as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/badges-D8YuufmK.js
var import_jsx_runtime = require_jsx_runtime();
function StatusBadge({ status }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn("inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium", {
			Confirmed: "bg-emerald-100 text-emerald-700 border-emerald-200",
			Completed: "bg-emerald-100 text-emerald-700 border-emerald-200",
			Pending: "bg-amber-100 text-amber-700 border-amber-200",
			Cancelled: "bg-rose-100 text-rose-700 border-rose-200",
			"On duty": "bg-emerald-100 text-emerald-700 border-emerald-200",
			"Off duty": "bg-muted text-muted-foreground border-border",
			Inside: "bg-emerald-100 text-emerald-700 border-emerald-200",
			Exited: "bg-muted text-muted-foreground border-border",
			OK: "bg-emerald-100 text-emerald-700 border-emerald-200",
			Low: "bg-amber-100 text-amber-700 border-amber-200",
			Critical: "bg-rose-100 text-rose-700 border-rose-200",
			Upcoming: "bg-sky-100 text-sky-700 border-sky-200",
			Planning: "bg-violet-100 text-violet-700 border-violet-200",
			VIP: "bg-primary/15 text-primary border-primary/30",
			Member: "bg-muted text-muted-foreground border-border",
			"In Progress": "bg-sky-100 text-sky-700 border-sky-200",
			Blocked: "bg-rose-100 text-rose-700 border-rose-200"
		}[status] || "bg-muted text-muted-foreground border-border"),
		children: status
	});
}
function SeverityBadge({ severity }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn("inline-flex items-center rounded-md border px-2 py-0.5 text-[11px] font-semibold uppercase", {
			high: "bg-rose-100 text-rose-700 border-rose-200",
			medium: "bg-amber-100 text-amber-700 border-amber-200",
			low: "bg-muted text-muted-foreground border-border"
		}[severity]),
		children: severity
	});
}
//#endregion
export { StatusBadge as n, SeverityBadge as t };
