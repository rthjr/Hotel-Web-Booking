"use client";
import { useAuth } from "@Context/AuthContext/AuthContext";

const PermissionGate = ({ 
  children, 
  requiredPermissions = [], 
  requiredAccessLevel = 0,
  fallback = null,
  role = null // specific role check
}) => {
  const { canAccess, userRole } = useAuth();

  // Check specific role if provided
  if (role && userRole !== role) {
    return fallback;
  }

  // Check permissions and access level
  if (!canAccess(requiredPermissions, requiredAccessLevel)) {
    return fallback;
  }

  return children;
};

export default PermissionGate;