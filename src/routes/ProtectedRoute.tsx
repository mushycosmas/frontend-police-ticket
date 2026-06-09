import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

type ProtectedRouteProps = {
  children: React.ReactNode;
  allowedPermissions?: string[];
};

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedPermissions = [],
}) => {
  const { isAuthenticated, permissions } = useAuth();

  // 🚨 Not logged in
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // 🚨 Permission check
  if (
    allowedPermissions.length > 0 &&
    !allowedPermissions.some((p) => permissions.includes(p))
  ) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;