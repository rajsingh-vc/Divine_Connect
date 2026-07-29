import { d as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { M as MessageSquare, N as Mail, O as Phone, T as Plus, b as Send } from "../_libs/lucide-react.mjs";
import { n as PageHeader, t as ChartCard } from "./chart-card-Cwq4vD8L.mjs";
import { t as StatCard } from "./stat-card-Bp146Jdr.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.communication-D69Q-GrZ.js
var import_jsx_runtime = require_jsx_runtime();
var campaigns = [
	{
		name: "Ekadashi Reminder",
		channel: "WhatsApp",
		sent: 42010,
		opened: "78%",
		status: "Sent"
	},
	{
		name: "Diwali Seva Drive",
		channel: "Email",
		sent: 18200,
		opened: "42%",
		status: "Sent"
	},
	{
		name: "Volunteer Callout",
		channel: "SMS",
		sent: 6400,
		opened: "91%",
		status: "Scheduled"
	},
	{
		name: "Donor Thank You",
		channel: "Email",
		sent: 12040,
		opened: "64%",
		status: "Draft"
	}
];
var SplitComponent = () => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
	/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
		eyebrow: "Outreach",
		title: "Communication Studio",
		subtitle: "Broadcast to devotees over WhatsApp, SMS, Email and Push — with templates and analytics.",
		actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			className: "inline-flex items-center gap-2 rounded-full bg-foreground px-4 py-2 text-xs font-semibold text-background",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-3.5 w-3.5" }), " New campaign"]
		})
	}),
	/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid grid-cols-2 gap-4 lg:grid-cols-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
				label: "Messages Sent MTD",
				value: "4.2L",
				change: "+31%",
				icon: Send,
				accent: "amber"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
				label: "WhatsApp",
				value: "72%",
				change: "channel share",
				icon: MessageSquare,
				accent: "emerald",
				trend: "flat"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
				label: "Email Open Rate",
				value: "48%",
				change: "+6%",
				icon: Mail,
				accent: "sky"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
				label: "Voice Calls",
				value: "1,240",
				icon: Phone,
				accent: "amber",
				trend: "flat"
			})
		]
	}),
	/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mt-6",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartCard, {
			title: "Recent campaigns",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "divide-y divide-border",
				children: campaigns.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between gap-4 py-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-semibold text-foreground",
						children: c.name
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs text-muted-foreground",
						children: [
							c.channel,
							" · ",
							c.sent.toLocaleString(),
							" sent · ",
							c.opened,
							" opened"
						]
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "rounded-md border border-border bg-muted px-2 py-0.5 text-xs",
						children: c.status
					})]
				}, c.name))
			})
		})
	})
] });
//#endregion
export { SplitComponent as component };
