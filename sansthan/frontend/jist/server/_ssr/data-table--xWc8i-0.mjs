import { d as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/data-table--xWc8i-0.js
var import_jsx_runtime = require_jsx_runtime();
function DataTable({ columns, rows, empty = "No records", loading = false }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "overflow-x-auto",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
			className: "w-full min-w-[640px] text-sm",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", {
				className: "border-b border-border",
				children: columns.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
					className: "px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground",
					children: c.header
				}, c.key))
			}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
				colSpan: columns.length,
				className: "px-4 py-8 text-center text-muted-foreground",
				children: "Loading..."
			}) }) : rows.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
				colSpan: columns.length,
				className: "px-4 py-8 text-center text-muted-foreground",
				children: empty
			}) }) : rows.map((row, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", {
				className: "border-b border-border/60 last:border-0 hover:bg-muted/40",
				children: columns.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
					className: "px-4 py-3 text-foreground",
					children: c.render ? c.render(row) : row[c.key]
				}, c.key))
			}, i)) })]
		})
	});
}
//#endregion
export { DataTable as t };
