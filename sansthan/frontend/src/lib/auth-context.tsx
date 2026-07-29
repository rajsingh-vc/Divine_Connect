import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { api, clearSession, getStoredUser, setStoredUser, setTokens, getAccessToken } from "@/lib/api";

export interface AuthUser {
  id: number;
  username: string;
  email: string;
  full_name: string;
  user_type: "devotee" | "volunteer" | "admin";
  phone: string;
}

interface AuthTokens {
  access: string;
  refresh: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  /** Single login for admin, volunteer, and devotee — backend matches the
   * account type from the identifier + password, no role selection needed. */
  login: (identifier: string, password: string) => Promise<AuthUser>;
  /** Creates a Devotee account. Becoming a volunteer is a separate step:
   * apply on the Volunteer Verification page, wait for admin approval, then
   * use `signupAsVolunteer` to create the volunteer login. A devotee signup
   * never creates a volunteer account directly (Signup Restriction). */
  signup: (payload: SignupPayload) => Promise<AuthUser>;
  /** Creates a Volunteer login account. Only succeeds if this email/phone
   * has an Admin Approved volunteer application on file — the backend
   * enforces this and returns a descriptive error otherwise (pending /
   * rejected / not-yet-applied). */
  signupAsVolunteer: (payload: SignupPayload) => Promise<AuthUser>;
  logout: () => void;
}

export interface SignupPayload {
  full_name: string;
  phone: string;
  email: string;
  password: string;
  confirm_password: string;
}

const AuthContext = createContext<AuthContextValue | null>(null);

async function persistSession(data: { user: AuthUser } & AuthTokens) {
  setTokens(data.access, data.refresh);
  setStoredUser(data.user);
  return data.user;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = getStoredUser<AuthUser>();
    if (stored && getAccessToken()) {
      setUser(stored);
      // Revalidate against the backend in the background.
      api
        .get("/auth/me/")
        .then((res) => {
          setUser(res.data);
          setStoredUser(res.data);
        })
        .catch(() => {
          clearSession();
          setUser(null);
        })
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, []);

  const value: AuthContextValue = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login: async (identifier, password) => {
      // One login for everyone — the backend looks up the account by
      // email/phone and matches whichever role (admin/volunteer/devotee)
      // it belongs to, so there's no role picker on the frontend.
      const { data } = await api.post("/auth/login/", { identifier, password });
      const u = await persistSession(data);
      setUser(u);
      return u;
    },
    signup: async (payload) => {
      // Intentionally does NOT persist a session or log the user in.
      // After successful signup, the user must sign in explicitly on the login page.
      const { data } = await api.post("/auth/devotee/signup/", payload);
      return data.user ?? data;
    },
    signupAsVolunteer: async (payload) => {
      // Backend only allows this to succeed for an Admin Approved volunteer
      // application (see VolunteerSignupSerializer) — otherwise it 400s with
      // a message explaining why (still pending, rejected, or not applied).
      const { data } = await api.post("/auth/volunteer/signup/", payload);
      return data.user ?? data;
    },
    logout: () => {
      clearSession();
      setUser(null);
      if (typeof window !== "undefined") window.location.href = "/login";
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}