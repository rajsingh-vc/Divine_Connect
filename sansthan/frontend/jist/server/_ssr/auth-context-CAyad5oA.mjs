import { o as __toESM } from "../_runtime.mjs";
import { a as setStoredUser, i as getStoredUser, n as clearSession, o as setTokens, r as getAccessToken, t as api } from "./api-CK4IlaGP.mjs";
import { d as require_jsx_runtime, f as require_react } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/auth-context-CAyad5oA.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var AuthContext = (0, import_react.createContext)(null);
async function persistSession(data) {
	setTokens(data.access, data.refresh);
	setStoredUser(data.user);
	return data.user;
}
function AuthProvider({ children }) {
	const [user, setUser] = (0, import_react.useState)(null);
	const [isLoading, setIsLoading] = (0, import_react.useState)(true);
	(0, import_react.useEffect)(() => {
		const stored = getStoredUser();
		if (stored && getAccessToken()) {
			setUser(stored);
			api.get("/auth/me/").then((res) => {
				setUser(res.data);
				setStoredUser(res.data);
			}).catch(() => {
				clearSession();
				setUser(null);
			}).finally(() => setIsLoading(false));
		} else setIsLoading(false);
	}, []);
	const value = {
		user,
		isAuthenticated: !!user,
		isLoading,
		login: async (identifier, password) => {
			const { data } = await api.post("/auth/login/", {
				identifier,
				password
			});
			const u = await persistSession(data);
			setUser(u);
			return u;
		},
		signup: async (payload) => {
			const { data } = await api.post("/auth/devotee/signup/", payload);
			return data.user ?? data;
		},
		signupAsVolunteer: async (payload) => {
			const { data } = await api.post("/auth/volunteer/signup/", payload);
			return data.user ?? data;
		},
		logout: () => {
			clearSession();
			setUser(null);
			if (typeof window !== "undefined") window.location.href = "/login";
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthContext.Provider, {
		value,
		children
	});
}
function useAuth() {
	const ctx = (0, import_react.useContext)(AuthContext);
	if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
	return ctx;
}
//#endregion
export { useAuth as n, AuthProvider as t };
