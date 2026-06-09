import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
} from "react";
import { loginUser } from "../api/authApi";

/* =========================
   USER TYPE
========================= */
interface User {
  id: number;
  username: string;
  email: string;
  first_name?: string;
  last_name?: string;
  role?: string | { name: string };
  role_id?: number;
  team_id?: number | null;
  team_name?: string | null;
  is_active?: boolean;
  permissions: string[];
}

/* =========================
   CONTEXT TYPE
========================= */
interface AuthContextType {
  user: User | null;
  token: string | null;
  permissions: string[];
  isAuthenticated: boolean;
  login: (credentials: {
    username: string;
    password: string;
  }) => Promise<User>;
  logout: () => void;
  hasPermission: (permission: string) => boolean;
  hasAnyPermission: (permissions: string[]) => boolean;
}

/* =========================
   CONTEXT
========================= */
const AuthContext = createContext<AuthContextType | undefined>(undefined);

/* =========================
   HELPERS
========================= */
const normalizePermissions = (perms: any): string[] => {
  if (Array.isArray(perms)) return perms.filter(Boolean);
  if (typeof perms === "string") return [perms];
  return [];
};

const safeParseUser = (data: string | null): User | null => {
  if (!data) return null;

  try {
    const parsed = JSON.parse(data);

    return {
      ...parsed,
      permissions: normalizePermissions(parsed.permissions),
      role:
        typeof parsed.role === "object"
          ? parsed.role?.name
          : parsed.role,
    };
  } catch {
    return null;
  }
};

/* =========================
   INITIAL STATE (IMPORTANT FIX)
========================= */
const initialToken = localStorage.getItem("token");
const initialUser = safeParseUser(localStorage.getItem("user"));
const initialPermissions = initialUser?.permissions || [];

/* =========================
   PROVIDER
========================= */
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(initialToken);
  const [user, setUser] = useState<User | null>(initialUser);
  const [permissions, setPermissions] =
    useState<string[]>(initialPermissions);

  /* =========================
     LOGIN
  ========================= */
  const login = async (credentials: {
    username: string;
    password: string;
  }): Promise<User> => {
    const response = await loginUser(credentials);

    const { access, refresh, user } = response.data;

    const safeUser: User = {
      ...user,
      permissions: normalizePermissions(user.permissions),
      role:
        typeof user.role === "object"
          ? user.role?.name
          : user.role,
    };

    localStorage.setItem("token", access);
    localStorage.setItem("refresh", refresh);
    localStorage.setItem("user", JSON.stringify(safeUser));

    setToken(access);
    setUser(safeUser);
    setPermissions(safeUser.permissions);

    return safeUser;
  };

  /* =========================
     LOGOUT
  ========================= */
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refresh");
    localStorage.removeItem("user");

    setToken(null);
    setUser(null);
    setPermissions([]);
  };

  /* =========================
     PERMISSIONS
  ========================= */
  const hasPermission = (permission: string) => {
    if (!permission) return true;
    if (permissions.includes("*")) return true;
    return permissions.includes(permission);
  };

  const hasAnyPermission = (perms: string[]) => {
    if (!perms?.length) return true;
    if (permissions.includes("*")) return true;

    return perms.some((p) => permissions.includes(p));
  };

  /* =========================
     CONTEXT VALUE
  ========================= */
  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        permissions,
        isAuthenticated: !!token,
        login,
        logout,
        hasPermission,
        hasAnyPermission,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

/* =========================
   HOOK
========================= */
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
};