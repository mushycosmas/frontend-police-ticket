import React, {
  createContext,
  useContext,
  useEffect,
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
  role?: string | { name: string }; // FIX: backend inconsistency safe
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
   SAFE NORMALIZER
========================= */
const normalizePermissions = (perms: any): string[] => {
  if (Array.isArray(perms)) return perms.filter(Boolean);
  if (typeof perms === "string") return [perms];
  return [];
};

/* =========================
   PROVIDER
========================= */
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [permissions, setPermissions] = useState<string[]>([]);

  /* =========================
     LOAD FROM STORAGE
  ========================= */
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (!storedToken || !storedUser) return;

    try {
      const parsedUser = JSON.parse(storedUser);

      const safeUser: User = {
        ...parsedUser,
        permissions: normalizePermissions(parsedUser.permissions),
        role:
          typeof parsedUser.role === "object"
            ? parsedUser.role?.name
            : parsedUser.role,
      };

      setToken(storedToken);
      setUser(safeUser);
      setPermissions(safeUser.permissions);
    } catch (err) {
      console.error("Invalid stored user data", err);
      localStorage.removeItem("token");
      localStorage.removeItem("refresh");
      localStorage.removeItem("user");
    }
  }, []);

  /* =========================
     LOGIN
  ========================= */
  const login = async (credentials: {
    username: string;
    password: string;
  }): Promise<User> => {
    try {
      const response = await loginUser(credentials);

      const { access, refresh, user } = response.data;

      const safeUser: User = {
        ...user,
        permissions: normalizePermissions(user.permissions),
        role:
          typeof user.role === "object" ? user.role?.name : user.role,
      };

      localStorage.setItem("token", access);
      localStorage.setItem("refresh", refresh);
      localStorage.setItem("user", JSON.stringify(safeUser));

      setToken(access);
      setUser(safeUser);
      setPermissions(safeUser.permissions);

      return safeUser;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  /* =========================
     LOGOUT
  ========================= */
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refresh");
    localStorage.removeItem("user");

    setUser(null);
    setToken(null);
    setPermissions([]);
  };

  /* =========================
     PERMISSIONS
  ========================= */
  const hasPermission = (permission: string) => {
    if (!permission) return true;
    if (!Array.isArray(permissions)) return false;
    if (permissions.includes("*")) return true;

    return permissions.includes(permission);
  };

  const hasAnyPermission = (perms: string[]) => {
    if (!Array.isArray(perms) || perms.length === 0) return true;
    if (!Array.isArray(permissions)) return false;
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