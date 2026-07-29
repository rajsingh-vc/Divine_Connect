import { o as __toESM } from "../_runtime.mjs";
import { d as require_jsx_runtime, f as require_react } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { n as useAuth } from "./auth-context-D5WWK08x.mjs";
import { _ as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as AdminShell } from "./shell-D4WxgETf.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin-sUEt6DZo.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
/** Client-side auth guard: redirects to /login if there's no valid session. */
function ProtectedAdmin() {
	const { isAuthenticated, isLoading } = useAuth();
	const navigate = useNavigate();
	(0, import_react.useEffect)(() => {
		if (!isLoading && !isAuthenticated) navigate({ to: "/login" });
	}, [isLoading, isAuthenticated]);
	if (isLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-muted-foreground",
			children: "Loading your console…"
		})
	});
	if (!isAuthenticated) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminShell, {});
}
//#endregion
export { ProtectedAdmin as component };
