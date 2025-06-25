"use client";
import { useAuth } from "@Context/AuthContext/AuthContext";

export const usePermissions = () => {
  const { 
    permissions, 
    accessLevel, 
    userRole, 
    hasPermission, 
    hasMinimumAccessLevel, 
    canAccess,
    isAdmin,
    isOwner,
    isUser 
  } = useAuth();

  // Additional helper functions
  const canManageUsers = () => hasPermission('users') && isAdmin();
  const canManageProperties = () => hasPermission('properties') && (isAdmin() || isOwner());
  const canViewReports = () => hasPermission('reports') && hasMinimumAccessLevel(80);
  const canManageSettings = () => hasPermission('settings') && isAdmin();

  return {
    permissions,
    accessLevel,
    userRole,
    hasPermission,
    hasMinimumAccessLevel,
    canAccess,
    isAdmin,
    isOwner,
    isUser,
    canManageUsers,
    canManageProperties,
    canViewReports,
    canManageSettings,
  };
};