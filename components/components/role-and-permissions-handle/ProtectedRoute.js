"use client";
import { useAuth } from "@Context/AuthContext/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const ProtectedRoute = ({ 
  children, 
  requiredPermissions = [], 
  requiredAccessLevel = 0,
  fallbackPath = "/unauthorized",
  showFallback = false 
}) => {
  const { isLogin, canAccess, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!isLogin) {
        router.push("/login");
        return;
      }

      if (!canAccess(requiredPermissions, requiredAccessLevel)) {
        if (showFallback) return;
        router.push(fallbackPath);
        return;
      }
    }
  }, [isLogin, loading, canAccess, router, requiredPermissions, requiredAccessLevel]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!isLogin) {
    return null;
  }

  if (!canAccess(requiredPermissions, requiredAccessLevel)) {
    if (showFallback) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
            <p className="text-gray-600">You don't have permission to access this page.</p>
          </div>
        </div>
      );
    }
    return null;
  }

  return children;
};

export default ProtectedRoute;