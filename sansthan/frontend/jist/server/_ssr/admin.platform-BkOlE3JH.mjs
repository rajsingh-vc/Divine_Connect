import { d as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { C as Server, S as Settings, i as Users, y as Shield } from "../_libs/lucide-react.mjs";
import { n as PageHeader, t as ChartCard } from "./chart-card-Cwq4vD8L.mjs";
import { t as StatCard } from "./stat-card-Bp146Jdr.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.platform-BkOlE3JH.js
var import_jsx_runtime = require_jsx_runtime();
var SplitComponent = () => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
	/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
		eyebrow: "Governance",
		title: "Platform Administration",
		subtitle: "Tenants, users, roles, security policies and system health for the entire Sansthan platform."
	}),
	/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid grid-cols-2 gap-4 lg:grid-cols-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
				label: "Tenants",
				value: "42",
				icon: Server,
				accent: "amber",
				trend: "flat"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
				label: "Admin Users",
				value: "128",
				icon: Users,
				accent: "sky",
				trend: "flat"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
				label: "Roles",
				value: "14",
				icon: Shield,
				accent: "emerald",
				trend: "flat"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
				label: "System Health",
				value: "99.98%",
				change: "30d uptime",
				icon: Settings,
				accent: "emerald"
			})
		]
	}),
	/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-6 grid gap-4 lg:grid-cols-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartCard, {
			title: "Recent audit events",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
				className: "space-y-3 text-sm",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex justify-between border-b border-border pb-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Role \"Priest Manager\" updated" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs text-muted-foreground",
							children: "2h ago"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex justify-between border-b border-border pb-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "New tenant \"Shirdi Sansthan\" onboarded" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs text-muted-foreground",
							children: "6h ago"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex justify-between border-b border-border pb-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "2FA enforced org-wide" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs text-muted-foreground",
							children: "1d ago"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "API key rotated · payments" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs text-muted-foreground",
							children: "3d ago"
						})]
					})
				]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartCard, {
			title: "Security posture",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
				className: "space-y-3 text-sm",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "SSO enabled" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-emerald-600 font-semibold",
							children: "Yes"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Audit log retention" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-semibold",
							children: "2 years"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Encryption at rest" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-emerald-600 font-semibold",
							children: "AES-256"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Backup frequency" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-semibold",
							children: "Every 6h"
						})]
					})
				]
			})
		})]
	})
] });
//#endregion
export { SplitComponent as component };
