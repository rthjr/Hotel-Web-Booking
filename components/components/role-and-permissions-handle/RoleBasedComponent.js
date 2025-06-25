"use client";
import { useAuth } from "@Context/AuthContext/AuthContext";

const RoleBasedComponent = ({ 
  adminComponent = null,
  ownerComponent = null,
  userComponent = null,
  fallback = null 
}) => {
  const { userRole } = useAuth();

  switch (userRole) {
    case 'Admin':
      return adminComponent || fallback;
    case 'Owner':
      return ownerComponent || fallback;
    case 'User':
      return userComponent || fallback;
    default:
      return fallback;
  }
};

export default RoleBasedComponent;
