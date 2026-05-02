import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import { setToken, clearToken, getToken, type AdminInfo } from "@/services/api";

interface AuthState {
  token: string | null;
  admin: AdminInfo | null;
  isAuthenticated: boolean;
  login: (token: string, admin: AdminInfo) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setTok] = useState<string | null>(getToken);
  const [admin, setAdmin] = useState<AdminInfo | null>(null);

  const login = useCallback((tok: string, adminInfo: AdminInfo) => {
    setToken(tok);
    setTok(tok);
    setAdmin(adminInfo);
  }, []);

  const logout = useCallback(() => {
    clearToken();
    setTok(null);
    setAdmin(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{ token, admin, isAuthenticated: !!token, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
