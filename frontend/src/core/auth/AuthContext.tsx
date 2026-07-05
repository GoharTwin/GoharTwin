import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { getMe, login as apiLogin } from "../api/client";

interface AuthUser {
  username: string;
  companyId: string;
  role: string;
  displayName?: string;
  displayNameFa?: string;
  permissions?: string[];
}

interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  login: (username: string, password: string, companyId: string) => Promise<void>;
  logout: () => void;
  hasPermission: (perm: string) => boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("gohartwin_token"));
  const [user, setUser] = useState<AuthUser | null>(() => {
    const raw = localStorage.getItem("gohartwin_user");
    return raw ? JSON.parse(raw) : null;
  });

  useEffect(() => {
    if (!token) return;
    getMe()
      .then((res) => setUser(res.user as unknown as AuthUser))
      .catch(() => {
        setToken(null);
        setUser(null);
        localStorage.removeItem("gohartwin_token");
        localStorage.removeItem("gohartwin_user");
      });
  }, [token]);

  const value = useMemo<AuthContextValue>(() => ({
    user,
    token,
    async login(username, password, companyId) {
      const res = await apiLogin(username, password, companyId);
      const authUser: AuthUser = {
        username: (res.user.username as string) || username,
        companyId: res.companyId,
        role: res.roleId,
        displayName: res.user.displayName as string | undefined,
        displayNameFa: res.user.displayNameFa as string | undefined,
      };
      setToken(res.token);
      setUser(authUser);
      localStorage.setItem("gohartwin_token", res.token);
      localStorage.setItem("gohartwin_user", JSON.stringify(authUser));
    },
    logout() {
      setToken(null);
      setUser(null);
      localStorage.removeItem("gohartwin_token");
      localStorage.removeItem("gohartwin_user");
    },
    hasPermission(perm: string) {
      if (!user?.permissions) return false;
      return user.permissions.includes("*") || user.permissions.includes(perm);
    },
  }), [user, token]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
