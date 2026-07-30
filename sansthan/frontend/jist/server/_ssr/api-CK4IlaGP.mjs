import { t as axios } from "../_libs/axios+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/api-CK4IlaGP.js
/**
* Axios instance wired to the Django REST Framework backend.
* Base URL comes from VITE_API_URL (see .env).
*/
var api = axios.create({ baseURL: "https://divineconnect.vibecopilot.ai/api" });
var ACCESS_KEY = "sansthan_access_token";
var REFRESH_KEY = "sansthan_refresh_token";
var USER_KEY = "sansthan_user";
function setTokens(access, refresh) {
	if (typeof window === "undefined") return;
	if (access) window.localStorage.setItem(ACCESS_KEY, access);
	else window.localStorage.removeItem(ACCESS_KEY);
	if (refresh !== void 0) if (refresh) window.localStorage.setItem(REFRESH_KEY, refresh);
	else window.localStorage.removeItem(REFRESH_KEY);
}
function getAccessToken() {
	if (typeof window === "undefined") return null;
	return window.localStorage.getItem(ACCESS_KEY);
}
function getRefreshToken() {
	if (typeof window === "undefined") return null;
	return window.localStorage.getItem(REFRESH_KEY);
}
function setStoredUser(user) {
	if (typeof window === "undefined") return;
	window.localStorage.setItem(USER_KEY, JSON.stringify(user));
}
function getStoredUser() {
	if (typeof window === "undefined") return null;
	const raw = window.localStorage.getItem(USER_KEY);
	return raw ? JSON.parse(raw) : null;
}
function clearSession() {
	setTokens(null, null);
	if (typeof window !== "undefined") window.localStorage.removeItem(USER_KEY);
}
api.interceptors.request.use((cfg) => {
	const t = getAccessToken();
	if (t) cfg.headers.Authorization = `Bearer ${t}`;
	return cfg;
});
var refreshPromise = null;
async function refreshAccessToken() {
	const refresh = getRefreshToken();
	if (!refresh) return null;
	try {
		const access = (await axios.post(`${api.defaults.baseURL}/auth/token/refresh/`, { refresh })).data?.access;
		setTokens(access);
		return access;
	} catch {
		return null;
	}
}
api.interceptors.response.use((r) => r, async (err) => {
	const original = err?.config;
	if (err?.response?.status === 401 && original && !original._retry) {
		original._retry = true;
		refreshPromise = refreshPromise || refreshAccessToken();
		const newAccess = await refreshPromise;
		refreshPromise = null;
		if (newAccess) {
			original.headers.Authorization = `Bearer ${newAccess}`;
			return api(original);
		}
		clearSession();
		if (typeof window !== "undefined" && !window.location.pathname.startsWith("/login")) window.location.href = "/login";
	}
	return Promise.reject(err);
});
/** Unwraps DRF's paginated `{count, next, previous, results}` shape into a plain array. */
function unwrap(data) {
	if (Array.isArray(data)) return data;
	if (data && Array.isArray(data.results)) return data.results;
	return [];
}
//#endregion
export { setStoredUser as a, getStoredUser as i, clearSession as n, setTokens as o, getAccessToken as r, unwrap as s, api as t };
