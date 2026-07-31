import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useCallback,
} from "react";

import {
  loginUser,
  changePassword as changePasswordApi,
  refreshToken,
} from "../api/authApi";

// ============================================================
// TYPES & INTERFACES
// ============================================================

interface User {
  id: number;
  username: string;
  email: string;
  phone?: string | null;
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

interface LoginCredentials {
  username: string;
  password: string;
}

interface ChangePasswordData {
  current_password: string;
  new_password: string;
  confirm_password: string;
}

interface AuthContextType {
  // State
  user: User | null;
  token: string | null;
  permissions: string[];
  isAuthenticated: boolean;
  isLoading: boolean;
  needsPasswordChange: boolean;
  needsPhoneUpdate: boolean;

  // Actions
  login: (credentials: LoginCredentials) => Promise<User>;
  logout: () => void;
  changePassword: (data: ChangePasswordData) => Promise<void>;
  refreshAuthToken: () => Promise<boolean>;
  refreshUser: () => Promise<void>;

  // Setters
  setNeedsPasswordChange: (value: boolean) => void;
  setNeedsPhoneUpdate: (value: boolean) => void;

  // Permission helpers
  hasPermission: (permission: string) => boolean;
  hasAnyPermission: (permissions: string[]) => boolean;
}

// ============================================================
// CONTEXT
// ============================================================

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ============================================================
// UTILITY FUNCTIONS
// ============================================================

/**
 * Normalizes permissions into a string array
 */
const normalizePermissions = (permissions: unknown): string[] => {
  if (Array.isArray(permissions)) {
    return permissions.filter(
      (permission): permission is string =>
        typeof permission === "string" && Boolean(permission)
    );
  }

  if (typeof permissions === "string") {
    return [permissions];
  }

  return [];
};

/**
 * Safely parses user data from localStorage
 */
const parseUserData = (data: string | null): User | null => {
  if (!data) return null;

  try {
    const parsed = JSON.parse(data);

    return {
      ...parsed,
      permissions: normalizePermissions(parsed.permissions),
      role: typeof parsed.role === "object" ? parsed.role?.name : parsed.role,
      needs_password_change: parsed.needs_password_change || false,
      is_default_password: parsed.is_default_password || false,
    };
  } catch {
    return null;
  }
};

/**
 * Determines if a user needs to update their phone number
 */
const requiresPhoneUpdate = (user: User | null): boolean => {
  if (!user) return false;
  return !user.phone || user.phone === "" || user.phone === null;
};

// ============================================================
// INITIAL STATE
// ============================================================

const storedToken = localStorage.getItem("token");
const storedUser = parseUserData(localStorage.getItem("user"));

const initialPermissions = storedUser?.permissions || [];
const initialNeedsPasswordChange = storedUser?.needs_password_change || false;
const initialNeedsPhoneUpdate = requiresPhoneUpdate(storedUser);

// ============================================================
// AUTH PROVIDER
// ============================================================

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  // ================================
  // STATE
  // ================================

  const [token, setToken] = useState<string | null>(storedToken);
  const [user, setUser] = useState<User | null>(storedUser);
  const [permissions, setPermissions] = useState<string[]>(initialPermissions);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [needsPasswordChange, setNeedsPasswordChange] = useState<boolean>(
    initialNeedsPasswordChange
  );
  const [needsPhoneUpdate, setNeedsPhoneUpdate] = useState<boolean>(
    initialNeedsPhoneUpdate
  );

  // ================================
  // AUTHENTICATION ACTIONS
  // ================================

  /**
   * Logs out the current user and clears all session data
   */
  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("refresh");
    localStorage.removeItem("user");

    setToken(null);
    setUser(null);
    setPermissions([]);
    setNeedsPasswordChange(false);
    setNeedsPhoneUpdate(false);
  }, []);

  /**
   * Refreshes the authentication token
   */
  const refreshAuthToken = useCallback(async (): Promise<boolean> => {
    const refreshTokenValue = localStorage.getItem("refresh");

    if (!refreshTokenValue) {
      return false;
    }

    try {
      const response = await refreshToken(refreshTokenValue);
      const { access } = response.data;

      localStorage.setItem("token", access);
      setToken(access);

      return true;
    } catch {
      return false;
    }
  }, []);

  /**
   * Authenticates a user with username and password
   */
  const login = useCallback(
    async (credentials: LoginCredentials): Promise<User> => {
      setIsLoading(true);

      try {
        const response = await loginUser(credentials);
        const {
          access,
          refresh,
          user: userData,
          needs_password_change,
        } = response.data;

        const safeUser: User = {
          ...userData,
          permissions: normalizePermissions(userData.permissions),
          role:
            typeof userData.role === "object" ? userData.role?.name : userData.role,
          needs_password_change:
            needs_password_change || userData.needs_password_change || false,
          is_default_password:
            needs_password_change || userData.is_default_password || false,
        };

        // Persist to localStorage
        localStorage.setItem("token", access);
        localStorage.setItem("refresh", refresh);
        localStorage.setItem("user", JSON.stringify(safeUser));

        // Update state
        setToken(access);
        setUser(safeUser);
        setPermissions(safeUser.permissions);
        setNeedsPasswordChange(safeUser.needs_password_change || false);
        setNeedsPhoneUpdate(requiresPhoneUpdate(safeUser));

        return safeUser;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  /**
   * Changes the user's password
   */
  const changePassword = useCallback(
    async (data: ChangePasswordData): Promise<void> => {
      setIsLoading(true);

      try {
        await changePasswordApi(data);

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
    },
    [user]
  );

  /**
   * Refreshes user data from localStorage
   */
  const refreshUser = useCallback(async (): Promise<void> => {
    setIsLoading(true);

    try {
      const userData = parseUserData(localStorage.getItem("user"));

      if (userData) {
        setUser(userData);
        setPermissions(userData.permissions);
        setNeedsPhoneUpdate(requiresPhoneUpdate(userData));
      }
    } catch (error) {
      console.error("Failed to refresh user data:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ================================
  // PERMISSION HELPERS
  // ================================

  const hasPermission = useCallback(
    (permission: string): boolean => {
      if (!permission) return true;
      if (permissions.includes("*")) return true;
      return permissions.includes(permission);
    },
    [permissions]
  );

  const hasAnyPermission = useCallback(
    (perms: string[]): boolean => {
      if (!perms?.length) return true;
      if (permissions.includes("*")) return true;
      return perms.some((permission) => permissions.includes(permission));
    },
    [permissions]
  );

  // ================================
  // STATE SETTERS
  // ================================

  const setNeedsPasswordChangeLocal = useCallback(
    (value: boolean) => {
      setNeedsPasswordChange(value);

      if (user) {
        const updatedUser = {
          ...user,
          needs_password_change: value,
        };

        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
      }
    },
    [user]
  );

  const setNeedsPhoneUpdateLocal = useCallback((value: boolean) => {
    setNeedsPhoneUpdate(value);
  }, []);

  // ================================
  // EFFECTS
  // ================================

  /**
   * Validates the token on app mount
   */
  useEffect(() => {
    const validateToken = async () => {
      if (!token || !user) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);

      try {
        const isTokenValid = await refreshAuthToken();

        if (!isTokenValid) {
          logout();
        }
      } catch {
        logout();
      } finally {
        setIsLoading(false);
      }
    };

    validateToken();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Sets up auto-logout after 10 minutes of inactivity
   */
  useEffect(() => {
    if (!token || !user) {
      return;
    }

    const SESSION_TIMEOUT = 10 * 60 * 1000; // 10 minutes
    let sessionTimer: ReturnType<typeof setTimeout>;

    const handleSessionTimeout = () => {
      logout();
      window.location.replace("/login");
    };

    const resetSessionTimer = () => {
      clearTimeout(sessionTimer);
      sessionTimer = setTimeout(handleSessionTimeout, SESSION_TIMEOUT);
    };

    // Events that reset the session timer
    const activityEvents = [
      "mousemove",
      "mousedown",
      "click",
      "keydown",
      "scroll",
      "touchstart",
    ];

    // Register event listeners
    activityEvents.forEach((event) => {
      window.addEventListener(event, resetSessionTimer);
    });

    // Start the timer
    resetSessionTimer();

    // Cleanup
    return () => {
      clearTimeout(sessionTimer);
      activityEvents.forEach((event) => {
        window.removeEventListener(event, resetSessionTimer);
      });
    };
  }, [token, user, logout]);

  // ================================
  // CONTEXT VALUE
  // ================================

  const contextValue: AuthContextType = {
    user,
    token,
    permissions,
    isAuthenticated: !!token && !!user,
    isLoading,
    needsPasswordChange,
    needsPhoneUpdate,
    login,
    logout,
    changePassword,
    hasPermission,
    hasAnyPermission,
    refreshAuthToken,
    setNeedsPasswordChange: setNeedsPasswordChangeLocal,
    setNeedsPhoneUpdate: setNeedsPhoneUpdateLocal,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// ============================================================
// CUSTOM HOOK
// ============================================================

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
};