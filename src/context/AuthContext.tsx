import { createContext, useContext, useState, useCallback, ReactNode } from "react";

export type UserRole = "customer" | "admin" | "kitchen" | "inventory";

interface AuthContextValue {
  currentRole: UserRole;
  isAuthenticated: (role: UserRole) => boolean;
  login: (role: UserRole, pin: string) => boolean;
  logout: (role: UserRole) => void;
  logoutAll: () => void;
}

// Simulated PINs for each role
const ROLE_PINS: Record<Exclude<UserRole, "customer">, string> = {
  admin: "1234",
  kitchen: "5678",
  inventory: "4321",
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authenticatedRoles, setAuthenticatedRoles] = useState<Set<UserRole>>(() => {
    const saved = localStorage.getItem("aureum-auth-roles");
    return saved ? new Set(JSON.parse(saved) as UserRole[]) : new Set<UserRole>(["customer"]);
  });

  const persist = useCallback((roles: Set<UserRole>) => {
    localStorage.setItem("aureum-auth-roles", JSON.stringify(Array.from(roles)));
  }, []);

  const isAuthenticated = useCallback((role: UserRole) => {
    if (role === "customer") return true;
    return authenticatedRoles.has(role);
  }, [authenticatedRoles]);

  const login = useCallback((role: UserRole, pin: string) => {
    if (role === "customer") return true;
    if (ROLE_PINS[role] === pin) {
      setAuthenticatedRoles((prev) => {
        const next = new Set(prev);
        next.add(role);
        persist(next);
        return next;
      });
      return true;
    }
    return false;
  }, [persist]);

  const logout = useCallback((role: UserRole) => {
    setAuthenticatedRoles((prev) => {
      const next = new Set(prev);
      next.delete(role);
      persist(next);
      return next;
    });
  }, [persist]);

  const logoutAll = useCallback(() => {
    const next = new Set<UserRole>(["customer"]);
    setAuthenticatedRoles(next);
    persist(next);
  }, [persist]);

  const currentRole: UserRole = authenticatedRoles.has("admin")
    ? "admin"
    : authenticatedRoles.has("kitchen")
    ? "kitchen"
    : authenticatedRoles.has("inventory")
    ? "inventory"
    : "customer";

  return (
    <AuthContext.Provider value={{ currentRole, isAuthenticated, login, logout, logoutAll }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
