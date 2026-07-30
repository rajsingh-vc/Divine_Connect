import { o as __toESM } from "../_runtime.mjs";
import { d as require_jsx_runtime, f as require_react } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { t as AuthProvider } from "./auth-context-CAyad5oA.mjs";
import { A as redirect, c as HeadContent, d as createRouter, f as Outlet, g as Link, h as createRootRouteWithContext, m as createFileRoute, p as lazyRouteComponent, s as Scripts, v as useRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { r as QueryClientProvider } from "../_libs/tanstack__react-query.mjs";
import { t as Toaster } from "../_libs/sonner.mjs";
import { t as Route$24 } from "./login-BzLPQlpz.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-CREJchnq.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var styles_default = "/assets/styles-BhSPPaHs.css";
function reportLovableError(error, context = {}) {
	if (typeof window === "undefined") return;
	window.__lovableEvents?.captureException?.(error, {
		source: "react_error_boundary",
		route: window.location.pathname,
		...context
	}, {
		mechanism: "react_error_boundary",
		handled: false,
		severity: "error"
	});
	const message = error instanceof Response ? `Response ${error.status}${error.url ? ` at ${error.url}` : ""}` : error instanceof Error ? error.message : String(error);
	window.__lovableReportRuntimeError?.({
		message,
		stack: error instanceof Error ? error.stack : void 0,
		filename: window.location.pathname
	});
}
var Toaster$1 = ({ ...props }) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, {
		className: "toaster group",
		toastOptions: { classNames: {
			toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
			description: "group-[.toast]:text-muted-foreground",
			actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
			cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground"
		} },
		...props
	});
};
function NotFoundComponent() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-7xl font-bold text-foreground",
					children: "404"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-4 text-xl font-semibold text-foreground",
					children: "Page not found"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "The page you're looking for doesn't exist or has been moved."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Go home"
					})
				})
			]
		})
	});
}
function ErrorComponent({ error, reset }) {
	console.error(error);
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		reportLovableError(error, { boundary: "tanstack_root_error_component" });
	}, [error]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-xl font-semibold tracking-tight text-foreground",
					children: "This page didn't load"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Something went wrong on our end. You can try refreshing or head back home."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex flex-wrap justify-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							router.invalidate();
							reset();
						},
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Try again"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "/",
						className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
						children: "Go home"
					})]
				})
			]
		})
	});
}
var Route$23 = createRootRouteWithContext()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: "Lovable App" },
			{
				name: "description",
				content: "Lovable Generated Project"
			},
			{
				name: "author",
				content: "Lovable"
			},
			{
				property: "og:title",
				content: "Lovable App"
			},
			{
				property: "og:description",
				content: "Lovable Generated Project"
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				name: "twitter:card",
				content: "summary_large_image"
			},
			{
				name: "twitter:site",
				content: "@Lovable"
			}
		],
		links: [{
			rel: "stylesheet",
			href: styles_default
		}, {
			rel: "icon",
			href: "/favicon.ico",
			type: "image/x-icon"
		}]
	}),
	shellComponent: RootShell,
	component: RootComponent,
	notFoundComponent: NotFoundComponent,
	errorComponent: ErrorComponent
});
function RootShell({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})] })]
	});
}
function RootComponent() {
	const { queryClient } = Route$23.useRouteContext();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QueryClientProvider, {
		client: queryClient,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AuthProvider, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster$1, {
			position: "top-right",
			richColors: true,
			closeButton: true
		})] })
	});
}
var $$splitComponentImporter$22 = () => import("./routes-DTEZEvkE.mjs");
var Route$22 = createFileRoute("/")({
	beforeLoad: () => {
		throw redirect({ to: "/admin" });
	},
	component: lazyRouteComponent($$splitComponentImporter$22, "component")
});
var $$splitComponentImporter$21 = () => import("./admin-4xKS5Rf_.mjs");
var Route$21 = createFileRoute("/admin")({
	head: () => ({ meta: [{ title: "Sansthan Console — Admin" }] }),
	component: lazyRouteComponent($$splitComponentImporter$21, "component")
});
/** Client-side auth guard: redirects to /login if there's no valid session. */
var $$splitComponentImporter$20 = () => import("./apply-volunteer-C52u3GqJ.mjs");
var Route$20 = createFileRoute("/apply-volunteer")({
	head: () => ({ meta: [{ title: "Volunteer Verification — Sansthan Console" }] }),
	component: lazyRouteComponent($$splitComponentImporter$20, "component")
});
var $$splitComponentImporter$19 = () => import("./forgot-password-zy0z2OeY.mjs");
var Route$19 = createFileRoute("/forgot-password")({
	head: () => ({ meta: [{ title: "Reset password — Sansthan Console" }] }),
	component: lazyRouteComponent($$splitComponentImporter$19, "component")
});
var $$splitComponentImporter$18 = () => import("./signup-B_wRPg9d.mjs");
var Route$18 = createFileRoute("/signup")({
	head: () => ({ meta: [{ title: "Create account — Sansthan Console" }] }),
	component: lazyRouteComponent($$splitComponentImporter$18, "component")
});
var $$splitComponentImporter$17 = () => import("./volunteer-signup-CHZOuODy.mjs");
var Route$17 = createFileRoute("/volunteer-signup")({
	head: () => ({ meta: [{ title: "Volunteer Sign Up — Sansthan Console" }] }),
	component: lazyRouteComponent($$splitComponentImporter$17, "component")
});
var $$splitComponentImporter$16 = () => import("./admin.index-C76nw6Ho.mjs");
var Route$16 = createFileRoute("/admin/")({
	head: () => ({ meta: [{ title: "Command Dashboard — Sansthan Console" }, {
		name: "description",
		content: "Realtime operations dashboard for temples and sansthans."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$16, "component")
});
var $$splitComponentImporter$15 = () => import("./admin.ai-BZX4bna9.mjs");
var Route$15 = createFileRoute("/admin/ai")({
	head: () => ({ meta: [{ title: "AI & Integrations — Sansthan Console" }] }),
	component: lazyRouteComponent($$splitComponentImporter$15, "component")
});
var $$splitComponentImporter$14 = () => import("./admin.bookings-DQj4wSoc.mjs");
var Route$14 = createFileRoute("/admin/bookings")({
	head: () => ({ meta: [{ title: "Booking Management — Sansthan Console" }] }),
	component: lazyRouteComponent($$splitComponentImporter$14, "component")
});
/** "New Booking" — the seva dropdown is fed straight from getSevas(), so any
*  seva added on the Sevas & Services page (including brand new ones) shows
*  up here immediately, no separate wiring needed. */
var $$splitComponentImporter$13 = () => import("./admin.cms-31RbLdQS.mjs");
var Route$13 = createFileRoute("/admin/cms")({
	head: () => ({ meta: [{ title: "Content Management System — Sansthan Console" }] }),
	component: lazyRouteComponent($$splitComponentImporter$13, "component")
});
var $$splitComponentImporter$12 = () => import("./admin.command-0Wdo79lK.mjs");
var Route$12 = createFileRoute("/admin/command")({
	head: () => ({ meta: [{ title: "Command Centre — Sansthan Console" }] }),
	component: lazyRouteComponent($$splitComponentImporter$12, "component")
});
var $$splitComponentImporter$11 = () => import("./admin.communication-D69Q-GrZ.mjs");
var Route$11 = createFileRoute("/admin/communication")({
	head: () => ({ meta: [{ title: "Communication — Sansthan Console" }] }),
	component: lazyRouteComponent($$splitComponentImporter$11, "component")
});
var $$splitComponentImporter$10 = () => import("./admin.devotees-_g2P-pDF.mjs");
var Route$10 = createFileRoute("/admin/devotees")({
	head: () => ({ meta: [{ title: "Devotee Management — Sansthan Console" }] }),
	component: lazyRouteComponent($$splitComponentImporter$10, "component")
});
var $$splitComponentImporter$9 = () => import("./admin.donations-DwrNfh0z.mjs");
var Route$9 = createFileRoute("/admin/donations")({
	head: () => ({ meta: [{ title: "Donation Management — Sansthan Console" }] }),
	component: lazyRouteComponent($$splitComponentImporter$9, "component")
});
var $$splitComponentImporter$8 = () => import("./admin.events-B0ltxIwX.mjs");
var Route$8 = createFileRoute("/admin/events")({
	head: () => ({ meta: [{ title: "Events — Sansthan Console" }] }),
	component: lazyRouteComponent($$splitComponentImporter$8, "component")
});
var $$splitComponentImporter$7 = () => import("./admin.inventory-83ixFfC_.mjs");
var Route$7 = createFileRoute("/admin/inventory")({
	head: () => ({ meta: [{ title: "Inventory & Prasad — Sansthan Console" }] }),
	component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
var $$splitComponentImporter$6 = () => import("./admin.platform-BkOlE3JH.mjs");
var Route$6 = createFileRoute("/admin/platform")({
	head: () => ({ meta: [{ title: "Platform Admin — Sansthan Console" }] }),
	component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
var $$splitComponentImporter$5 = () => import("./admin.reports-BRbL9gA9.mjs");
var Route$5 = createFileRoute("/admin/reports")({
	head: () => ({ meta: [{ title: "Reports — Sansthan Console" }] }),
	component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
var $$splitComponentImporter$4 = () => import("./admin.sevas-DkWCzlhG.mjs");
var Route$4 = createFileRoute("/admin/sevas")({
	head: () => ({ meta: [{ title: "Sevas & Services — Sansthan Console" }] }),
	component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
/** Create/Edit form — shared by "New Seva" and the per-card "Edit" button.
*  Any authenticated console user (admin or volunteer) can use this; the
*  backend only requires authentication on the sevas endpoint, no role check. */
/** Read-only preview of a seva, close to what a devotee sees when booking. */
var $$splitComponentImporter$3 = () => import("./admin.tasks-Y-Cl47Gz.mjs");
var Route$3 = createFileRoute("/admin/tasks")({
	head: () => ({ meta: [{ title: "Tasks — Sansthan Console" }] }),
	component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
var $$splitComponentImporter$2 = () => import("./admin.visitors-BwaA54Rw.mjs");
var Route$2 = createFileRoute("/admin/visitors")({
	head: () => ({ meta: [{ title: "Visitors — Sansthan Console" }] }),
	component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
var $$splitComponentImporter$1 = () => import("./admin.volunteer-approvals-zd197SFu.mjs");
var Route$1 = createFileRoute("/admin/volunteer-approvals")({
	head: () => ({ meta: [{ title: "Volunteer Approval Management — Sansthan Console" }] }),
	component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
var $$splitComponentImporter = () => import("./admin.volunteers-VDDUIZ3Q.mjs");
var Route = createFileRoute("/admin/volunteers")({
	head: () => ({ meta: [{ title: "Volunteer Management — Sansthan Console" }] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
var IndexRoute = Route$22.update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$23
});
var AdminRoute = Route$21.update({
	id: "/admin",
	path: "/admin",
	getParentRoute: () => Route$23
});
var ApplyVolunteerRoute = Route$20.update({
	id: "/apply-volunteer",
	path: "/apply-volunteer",
	getParentRoute: () => Route$23
});
var ForgotPasswordRoute = Route$19.update({
	id: "/forgot-password",
	path: "/forgot-password",
	getParentRoute: () => Route$23
});
var LoginRoute = Route$24.update({
	id: "/login",
	path: "/login",
	getParentRoute: () => Route$23
});
var SignupRoute = Route$18.update({
	id: "/signup",
	path: "/signup",
	getParentRoute: () => Route$23
});
var VolunteerSignupRoute = Route$17.update({
	id: "/volunteer-signup",
	path: "/volunteer-signup",
	getParentRoute: () => Route$23
});
var AdminIndexRoute = Route$16.update({
	id: "/",
	path: "/",
	getParentRoute: () => AdminRoute
});
var AdminRouteChildren = {
	AdminAiRoute: Route$15.update({
		id: "/ai",
		path: "/ai",
		getParentRoute: () => AdminRoute
	}),
	AdminBookingsRoute: Route$14.update({
		id: "/bookings",
		path: "/bookings",
		getParentRoute: () => AdminRoute
	}),
	AdminCmsRoute: Route$13.update({
		id: "/cms",
		path: "/cms",
		getParentRoute: () => AdminRoute
	}),
	AdminCommandRoute: Route$12.update({
		id: "/command",
		path: "/command",
		getParentRoute: () => AdminRoute
	}),
	AdminCommunicationRoute: Route$11.update({
		id: "/communication",
		path: "/communication",
		getParentRoute: () => AdminRoute
	}),
	AdminDevoteesRoute: Route$10.update({
		id: "/devotees",
		path: "/devotees",
		getParentRoute: () => AdminRoute
	}),
	AdminDonationsRoute: Route$9.update({
		id: "/donations",
		path: "/donations",
		getParentRoute: () => AdminRoute
	}),
	AdminEventsRoute: Route$8.update({
		id: "/events",
		path: "/events",
		getParentRoute: () => AdminRoute
	}),
	AdminInventoryRoute: Route$7.update({
		id: "/inventory",
		path: "/inventory",
		getParentRoute: () => AdminRoute
	}),
	AdminPlatformRoute: Route$6.update({
		id: "/platform",
		path: "/platform",
		getParentRoute: () => AdminRoute
	}),
	AdminReportsRoute: Route$5.update({
		id: "/reports",
		path: "/reports",
		getParentRoute: () => AdminRoute
	}),
	AdminSevasRoute: Route$4.update({
		id: "/sevas",
		path: "/sevas",
		getParentRoute: () => AdminRoute
	}),
	AdminTasksRoute: Route$3.update({
		id: "/tasks",
		path: "/tasks",
		getParentRoute: () => AdminRoute
	}),
	AdminVisitorsRoute: Route$2.update({
		id: "/visitors",
		path: "/visitors",
		getParentRoute: () => AdminRoute
	}),
	AdminVolunteerApprovalsRoute: Route$1.update({
		id: "/volunteer-approvals",
		path: "/volunteer-approvals",
		getParentRoute: () => AdminRoute
	}),
	AdminVolunteersRoute: Route.update({
		id: "/volunteers",
		path: "/volunteers",
		getParentRoute: () => AdminRoute
	}),
	AdminIndexRoute
};
var rootRouteChildren = {
	IndexRoute,
	AdminRoute: AdminRoute._addFileChildren(AdminRouteChildren),
	ApplyVolunteerRoute,
	ForgotPasswordRoute,
	LoginRoute,
	SignupRoute,
	VolunteerSignupRoute
};
var routeTree = Route$23._addFileChildren(rootRouteChildren)._addFileTypes();
var getRouter = () => {
	return createRouter({
		routeTree,
		context: { queryClient: new QueryClient() },
		scrollRestoration: true,
		defaultPreloadStaleTime: 0
	});
};
//#endregion
export { getRouter };
