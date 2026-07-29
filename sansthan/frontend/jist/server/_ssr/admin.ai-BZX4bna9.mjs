import { d as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { E as Plug, X as Cpu, ft as Bot, p as Sparkles } from "../_libs/lucide-react.mjs";
import { n as PageHeader } from "./chart-card-Cwq4vD8L.mjs";
import { t as StatCard } from "./stat-card-Bp146Jdr.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.ai-BZX4bna9.js
var import_jsx_runtime = require_jsx_runtime();
var integrations = [
	{
		name: "Razorpay Payments",
		category: "Payments",
		status: "Connected"
	},
	{
		name: "Twilio WhatsApp",
		category: "Messaging",
		status: "Connected"
	},
	{
		name: "Google Analytics",
		category: "Analytics",
		status: "Connected"
	},
	{
		name: "Zoho Books",
		category: "Accounting",
		status: "Not connected"
	},
	{
		name: "OpenAI GPT-5",
		category: "AI Model",
		status: "Connected"
	},
	{
		name: "Live Darshan CDN",
		category: "Streaming",
		status: "Connected"
	}
];
var SplitComponent = () => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
	/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
		eyebrow: "Automation",
		title: "AI & Integrations",
		subtitle: "Connect models, third-party services and automations that power the platform."
	}),
	/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid grid-cols-2 gap-4 lg:grid-cols-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
				label: "Active AI Agents",
				value: "6",
				icon: Bot,
				accent: "amber",
				trend: "flat"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
				label: "Integrations",
				value: "18",
				change: "+3",
				icon: Plug,
				accent: "sky"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
				label: "Automations Run",
				value: "14,820",
				icon: Sparkles,
				accent: "emerald",
				trend: "flat"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
				label: "Compute Used",
				value: "82%",
				change: "of quota",
				icon: Cpu,
				accent: "amber",
				trend: "flat"
			})
		]
	}),
	/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3",
		children: integrations.map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "rounded-2xl border border-border bg-card p-5 shadow-sm",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[10px] font-semibold uppercase tracking-wider text-muted-foreground",
					children: i.category
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "mt-2 font-serif text-lg font-semibold",
					children: i.name
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 flex items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: `text-xs font-semibold ${i.status === "Connected" ? "text-emerald-600" : "text-muted-foreground"}`,
						children: i.status === "Connected" ? "● Connected" : "○ Not connected"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: "rounded-full border border-border px-3 py-1 text-xs font-medium hover:bg-muted",
						children: i.status === "Connected" ? "Manage" : "Connect"
					})]
				})
			]
		}, i.name))
	})
] });
//#endregion
export { SplitComponent as component };
