// src/context/AuthContext.tsx
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useCallback,
} from "react";
import { loginUser, changePassword, refreshToken } from "../api/authApi";

/* =========================
   USER TYPE
========================= */
interface User {
  id: number;
  username: string;
  email: string;
  first_name?: string;
  last_name?: string;
  full_name?: string;
  role?: string | { name: string };
  role_id?: number;
  team_id?: number | null;
  team_name?: string | null;
  is_active?: boolean;
  permissions: string[];
  rank?: string;
  is_default_password?: boolean;
  needs_password_change?: boolean;
  last_password_change?: string | null;
}

/* =========================
   CONTEXT TYPE
========================= */
interface AuthContextType {
  user: User | null;
  token: string | null;
  permissions: string[];
  isAuthenticated: boolean;
  isLoading: boolean;
  needsPasswordChange: boolean;
  login: (credentials: {
    username: string;
    password: string;
  }) => Promise<User>;
  logout: () => void;
  changePassword: (data: {
    current_password: string;
    new_password: string;
    confirm_password: string;
  }) => Promise<void>;
  hasPermission: (permission: string) => boolean;
  hasAnyPermission: (permissions: string[]) => boolean;
  refreshAuthToken: () => Promise<boolean>;
  setNeedsPasswordChange: (value: boolean) => void;
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
      needs_password_change: parsed.needs_password_change || false,
      is_default_password: parsed.is_default_password || false,
    };
  } catch {
    return null;
  }
};

/* =========================
   INITIAL STATE
========================= */
const initialToken = localStorage.getItem("token");
const initialUser = safeParseUser(localStorage.getItem("user"));
const initialPermissions = initialUser?.permissions || [];
const initialNeedsPasswordChange = initialUser?.needs_password_change || false;

/* =========================
   PROVIDER
========================= */
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(initialToken);
  const [user, setUser] = useState<User | null>(initialUser);
  const [permissions, setPermissions] = useState<string[]>(initialPermissions);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [needsPasswordChange, setNeedsPasswordChange] = useState<boolean>(
    initialNeedsPasswordChange
  );

  // =========================
  // VALIDATE TOKEN ON MOUNT
  // =========================
  useEffect(() => {
    const validateToken = async () => {
      if (token && user) {
        setIsLoading(true);
        try {
          // Try to refresh token to validate it
          const refreshed = await refreshAuthToken();
          if (!refreshed) {
            logout();
          }
        } catch {
          logout();
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };

    validateToken();
  }, []);

  // =========================
  // REFRESH TOKEN
  // =========================
  const refreshAuthToken = useCallback(async (): Promise<boolean> => {
    const refresh = localStorage.getItem("refresh");
    if (!refresh) return false;

    try {
      const response = await refreshToken(refresh);
      const { access } = response.data;
      localStorage.setItem("token", access);
      setToken(access);
      return true;
    } catch {
      return false;
    }
  }, []);

  // =========================
  // LOGIN
  // =========================
  const login = async (credentials: {
    username: string;
    password: string;
  }): Promise<User> => {
    setIsLoading(true);
    try {
      const response = await loginUser(credentials);

      const { access, refresh, user: userData, needs_password_change } = response.data;

      const safeUser: User = {
        ...userData,
        permissions: normalizePermissions(userData.permissions),
        role:
          typeof userData.role === "object"
            ? userData.role?.name
            : userData.role,
        needs_password_change: needs_password_change || userData.needs_password_change || false,
        is_default_password: needs_password_change || userData.is_default_password || false,
      };

      localStorage.setItem("token", access);
      localStorage.setItem("refresh", refresh);
      localStorage.setItem("user", JSON.stringify(safeUser));

      setToken(access);
      setUser(safeUser);
      setPermissions(safeUser.permissions);
      setNeedsPasswordChange(safeUser.needs_password_change || false);

      return safeUser;
    } finally {
      setIsLoading(false);
    }
  };

  // =========================
  // CHANGE PASSWORD
  // =========================
  const changePassword = async (data: {
    current_password: string;
    new_password: string;
    confirm_password: string;
  }): Promise<void> => {
    setIsLoading(true);
    try {
      await changePassword(data);

      // ✅ Update user after password change
      if (user) {
        const updatedUser: User = {
          ...user,
          is_default_password: false,
          needs_password_change: false,
        };

        setUser(updatedUser);
        setNeedsPasswordChange(false);
        localStorage.setItem("user", JSON.stringify(updatedUser));
      }
    } finally {
      setIsLoading(false);
    }
  };

  // =========================
  // LOGOUT
  // =========================
  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("refresh");
    localStorage.removeItem("user");

    setToken(null);
    setUser(null);
    setPermissions([]);
    setNeedsPasswordChange(false);
  }, []);

  // =========================
  // PERMISSIONS
  // =========================
  const hasPermission = useCallback(
    (permission: string) => {
      if (!permission) return true;
      if (permissions.includes("*")) return true;
      return permissions.includes(permission);
    },
    [permissions]
  );

  const hasAnyPermission = useCallback(
    (perms: string[]) => {
      if (!perms?.length) return true;
      if (permissions.includes("*")) return true;
      return perms.some((p) => permissions.includes(p));
    },
    [permissions]
  );

  // =========================
  // SET NEEDS PASSWORD CHANGE
  // =========================
  const setNeedsPasswordChangeLocal = useCallback((value: boolean) => {
    setNeedsPasswordChange(value);
    if (user) {
      const updatedUser = { ...user, needs_password_change: value };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
    }
  }, [user]);

  // =========================
  // CONTEXT VALUE
  // =========================
  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        permissions,
        isAuthenticated: !!token && !!user,
        isLoading,
        needsPasswordChange,
        login,
        logout,
        changePassword,
        hasPermission,
        hasAnyPermission,
        refreshAuthToken,
        setNeedsPasswordChange: setNeedsPasswordChangeLocal,
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