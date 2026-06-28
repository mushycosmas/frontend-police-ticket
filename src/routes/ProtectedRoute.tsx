// src/routes/ProtectedRoute.tsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

type ProtectedRouteProps = {
  children: React.ReactNode;
  allowedPermissions?: string[];
  requiresPasswordChange?: boolean;
};

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedPermissions = [],
  requiresPasswordChange = false,
}) => {
  const { 
    isAuthenticated, 
    isLoading, 
    needsPasswordChange, 
    permissions,
    hasAnyPermission,
    user 
  } = useAuth();

  // ✅ DEBUG LOGS
  console.log("🔍 ProtectedRoute:");
  console.log("  isAuthenticated:", isAuthenticated);
  console.log("  isLoading:", isLoading);
  console.log("  needsPasswordChange:", needsPasswordChange);
  console.log("  requiresPasswordChange:", requiresPasswordChange);
  console.log("  user:", user);

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Not authenticated
  if (!isAuthenticated) {
    console.log("🔍 Not authenticated, redirecting to login");
    return <Navigate to="/login" replace />;
  }

  // ✅ If this is the change password page, allow access
  if (requiresPasswordChange) {
    console.log("🔍 Password change page, allowing access");
    return <>{children}</>;
  }

  // ✅ Check if user needs to change password
  if (needsPasswordChange) {
    console.log("🔍 Needs password change, redirecting to /change-password");
    return <Navigate to="/change-password" replace />;
  }

  // Permission check
  if (allowedPermissions.length > 0) {
    const hasPermission = hasAnyPermission(allowedPermissions);
    if (!hasPermission) {
      console.warn("Permission denied. Required:", allowedPermissions);
      console.warn("User permissions:", permissions);
      return <Navigate to="/dashboard" replace />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;