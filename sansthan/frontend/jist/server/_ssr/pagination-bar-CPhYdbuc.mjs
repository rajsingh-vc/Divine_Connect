import { d as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { dt as ChevronLeft, ut as ChevronRight } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/pagination-bar-CPhYdbuc.js
var import_jsx_runtime = require_jsx_runtime();
/** Simple prev/next pager driven by DRF's {count, page_size} pagination. */
function PaginationBar({ page, pageSize, count, onPageChange }) {
	const totalPages = Math.max(1, Math.ceil(count / pageSize));
	if (count === 0) return null;
	const start = (page - 1) * pageSize + 1;
	const end = Math.min(page * pageSize, count);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4 text-sm",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "text-muted-foreground",
			children: [
				"Showing ",
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-medium text-foreground",
					children: start
				}),
				"–",
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-medium text-foreground",
					children: end
				}),
				" of",
				" ",
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-medium text-foreground",
					children: count
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					disabled: page <= 1,
					onClick: () => onPageChange(page - 1),
					className: "inline-flex items-center gap-1 rounded-full border border-border px-3 py-1.5 text-xs font-medium hover:bg-muted disabled:opacity-40 disabled:hover:bg-transparent",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "h-3.5 w-3.5" }), " Prev"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "text-xs text-muted-foreground",
					children: [
						"Page ",
						page,
						" of ",
						totalPages
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					disabled: page >= totalPages,
					onClick: () => onPageChange(page + 1),
					className: "inline-flex items-center gap-1 rounded-full border border-border px-3 py-1.5 text-xs font-medium hover:bg-muted disabled:opacity-40 disabled:hover:bg-transparent",
					children: ["Next ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-3.5 w-3.5" })]
				})
			]
		})]
	});
}
//#endregion
export { PaginationBar as t };
