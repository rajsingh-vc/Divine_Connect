import axios from "axios";

/**
 * Axios instance wired to the Django REST Framework backend.
 * Base URL comes from VITE_API_URL (see .env).
 */
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000/api",
});

const ACCESS_KEY = "sansthan_access_token";
const REFRESH_KEY = "sansthan_refresh_token";
const USER_KEY = "sansthan_user";

export function setTokens(access: string | null, refresh?: string | null) {
  if (typeof window === "undefined") return;
  if (access) window.localStorage.setItem(ACCESS_KEY, access);
  else window.localStorage.removeItem(ACCESS_KEY);
  if (refresh !== undefined) {
    if (refresh) window.localStorage.setItem(REFRESH_KEY, refresh);
    else window.localStorage.removeItem(REFRESH_KEY);
  }
}

export function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(ACCESS_KEY);
}

export function getRefreshToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(REFRESH_KEY);
}

export function setStoredUser(user: unknown) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function getStoredUser<T = any>(): T | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(USER_KEY);
  return raw ? (JSON.parse(raw) as T) : null;
}

export function clearSession() {
  setTokens(null, null);
  if (typeof window !== "undefined") window.localStorage.removeItem(USER_KEY);
}

api.interceptors.request.use((cfg) => {
  const t = getAccessToken();
  if (t) cfg.headers.Authorization = `Bearer ${t}`;
  return cfg;
});

// Refresh-token handling: on a 401, try refreshing the access token once
// and replay the original request before giving up and logging the user out.
let refreshPromise: Promise<string | null> | null = null;

async function refreshAccessToken(): Promise<string | null> {
  const refresh = getRefreshToken();
  if (!refresh) return null;
  try {
    const res = await axios.post(`${api.defaults.baseURL}/auth/token/refresh/`, { refresh });
    const access = res.data?.access as string;
    setTokens(access);
    return access;
  } catch {
    return null;
  }
}

api.interceptors.response.use(
  (r) => r,
  async (err) => {
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
      if (typeof window !== "undefined" && !window.location.pathname.startsWith("/login")) {
        window.location.href = "/login";
      }
    }
    return Promise.reject(err);
  },
);

/** Unwraps DRF's paginated `{count, next, previous, results}` shape into a plain array. */
export function unwrap<T>(data: any): T[] {
  if (Array.isArray(data)) return data as T[];
  if (data && Array.isArray(data.results)) return data.results as T[];
  return [];
}
