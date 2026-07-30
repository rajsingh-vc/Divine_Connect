import { m as createFileRoute, p as lazyRouteComponent } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as stringType, t as objectType } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/login-BzLPQlpz.js
var $$splitComponentImporter = () => import("./login-Biy7Xh0u.mjs");
var searchSchema = objectType({ registered: stringType().optional() });
var Route = createFileRoute("/login")({
	head: () => ({ meta: [{ title: "Sign in — Sansthan Console" }] }),
	validateSearch: searchSchema,
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
