/* "use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { logout, checkAuth } from "@/lib/auth";
import { authService } from "@lib/authService";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(false);
  const [userName, setUserName] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState([]);

  const refresh = typeof window !== "undefined" && localStorage.getItem("refresh_token") ? true : false;

  const handleLogin = async (email, password) => {
    try {
      const response = await authService.login({ email, password });

      if (!response.success) {
        throw new Error(response.error);
      }

      localStorage.setItem("token", response.data.access_token);
      setIsLogin(true);
      setUserName(response.data.user.lastName || response.data.user.name || "");
      router.push("/");

      return { success: true };
    } catch (error) {
      console.error("Login failed:", error);
      return { success: false, error: error.message };
    }
  };

  const checkAuthentication = async () => {
    try {
      const response = await checkAuth();
      if (response.authenticated) {
        setIsLogin(true);
        setUserName(response.user.lastName || "");

        const data = await authService.user();

        setUserData(data);
      } else {
        setIsLogin(false);
        setUserName("");
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      setIsLogin(false);
      setUserName("");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      setIsLogin(false);
      setUserName("");
      // Clear all auth data from localStorage
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      document.cookie = "access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
      router.push("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

useEffect(() => {
  if (refresh) {
    const refreshToken = async () => {
      try {
        const response = await authService.refresh();
        if (response.success) {
          localStorage.setItem("token", response.data.access_token);
          localStorage.setItem("refresh_token", response.data.refresh_token);
        } else {
          console.error("Failed to refresh token:", response.error);
        }
      } catch (error) {
        console.error("Error refreshing token:", error);
      }
    };

    refreshToken();
  }
}, [refresh]);

  useEffect(() => {
    checkAuthentication();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider
      value={{
        isLogin,
        userName,
        isDropdownOpen,
        setIsDropdownOpen,
        userData,
        handleLogout,
        handleLogin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
 */

/* "use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { logout, checkAuth } from "@/lib/auth";
import { authService } from "@lib/authService";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(false);
  const [userName, setUserName] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState({});
  
  // New permission-related states
  const [permissions, setPermissions] = useState([]);
  const [accessLevel, setAccessLevel] = useState(0);
  const [userRole, setUserRole] = useState("");

  const refresh = typeof window !== "undefined" && localStorage.getItem("refresh_token") ? true : false;

  // Permission helper functions
  const hasPermission = (permission) => {
    return permissions.includes(permission);
  };

  const hasMinimumAccessLevel = (requiredLevel) => {
    return accessLevel >= requiredLevel;
  };

  const canAccess = (requiredPermissions = [], requiredAccessLevel = 0) => {
    const hasRequiredPermissions = requiredPermissions.length === 0 || 
      requiredPermissions.every(permission => hasPermission(permission));
    const hasRequiredAccessLevel = hasMinimumAccessLevel(requiredAccessLevel);
    
    return hasRequiredPermissions && hasRequiredAccessLevel;
  };

  const isAdmin = () => userRole === 'Admin';
  const isOwner = () => userRole === 'Owner';
  const isUser = () => userRole === 'User';

  // Store auth data in localStorage
  const storeAuthData = (authData) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("user", JSON.stringify(authData.user || {}));
      localStorage.setItem("permissions", JSON.stringify(authData.permissions || []));
      localStorage.setItem("access_level", authData.access_level?.toString() || "0");
      localStorage.setItem("user_role", authData.user?.role || "");
    }
  };

  // Load cached auth data
  const loadCachedAuthData = () => {
    if (typeof window !== "undefined") {
      try {
        const cachedUser = localStorage.getItem("user");
        const cachedPermissions = localStorage.getItem("permissions");
        const cachedAccessLevel = localStorage.getItem("access_level");
        const cachedRole = localStorage.getItem("user_role");

        if (cachedUser && cachedPermissions) {
          const user = JSON.parse(cachedUser);
          setUserData(user);
          setPermissions(JSON.parse(cachedPermissions));
          setAccessLevel(parseInt(cachedAccessLevel) || 0);
          setUserRole(cachedRole || "");
          setUserName(user.lastName || user.name || "");
        }
      } catch (error) {
        console.error("Error loading cached auth data:", error);
      }
    }
  };

  // Clear auth data
  const clearAuthData = () => {
    setIsLogin(false);
    setUserName("");
    setUserData({});
    setPermissions([]);
    setAccessLevel(0);
    setUserRole("");
    
    if (typeof window !== "undefined") {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("permissions");
      localStorage.removeItem("access_level");
      localStorage.removeItem("user_role");
    }
  };

  const handleLogin = async (email, password) => {
    try {
      const response = await authService.login({ email, password });

      if (!response.success) {
        throw new Error(response.error);
      }

      localStorage.setItem("token", response.data.access_token);
      
      // Fetch user profile with permissions after login
      try {
        const profileData = await authService.userProfile(); // This should call your userProfile() endpoint
        
        if (profileData.status === 'success') {
          setIsLogin(true);
          setUserName(profileData.user.name || "");
          setUserData(profileData.user);
          setPermissions(profileData.permissions);
          setAccessLevel(profileData.access_level);
          setUserRole(profileData.user.role);
          
          // Store in localStorage
          storeAuthData(profileData);
        }
      } catch (profileError) {
        console.error("Failed to fetch user profile:", profileError);
        // Fallback to basic user data from login response
        setIsLogin(true);
        setUserName(response.data.user.lastName || response.data.user.name || "");
        setUserData(response.data.user);
        setUserRole(response.data.user.role || "");
      }

      router.push("/");
      return { success: true };
    } catch (error) {
      console.error("Login failed:", error);
      return { success: false, error: error.message };
    }
  };

  const checkAuthentication = async () => {
    try {
      // Load cached data first for immediate UI update
      loadCachedAuthData();

      const response = await checkAuth();
      if (response.authenticated) {
        setIsLogin(true);
        setUserName(response.user.lastName || "");

        // Fetch fresh user profile data with permissions
        try {
          const profileData = await authService.userProfile();
          
          if (profileData.status === 'success') {
            setUserData(profileData.user);
            setPermissions(profileData.permissions);
            setAccessLevel(profileData.access_level);
            setUserRole(profileData.user.role);
            
            // Update localStorage with fresh data
            storeAuthData(profileData);
          } else {
            // Fallback to existing userData call
            const data = await authService.user();
            setUserData(data);
          }
        } catch (profileError) {
          console.error("Failed to fetch user profile:", profileError);
          // Fallback to existing userData call
          const data = await authService.user();
          setUserData(data);
        }
      } else {
        clearAuthData();
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      clearAuthData();
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      clearAuthData();
      document.cookie = 'access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      router.push("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  useEffect(() => {
  if (!refresh) return;

  const refreshToken = async () => {
    try {
      const response = await authService.refresh();
      if (response.success) {
        localStorage.setItem("token", response.data.access_token);
        localStorage.setItem("refresh_token", response.data.refresh_token);
        
        // Refresh user profile data after token refresh
        try {
          const profileData = await authService.userProfile();
          if (profileData.status === 'success') {
            storeAuthData(profileData);
            setPermissions(profileData.permissions);
            setAccessLevel(profileData.access_level);
            setUserRole(profileData.user.role);
          }
        } catch (profileError) {
          console.error("Failed to refresh user profile:", profileError);
        }
      } else {
        console.error("Failed to refresh token:", response.error);
        // If refresh fails, clear auth data and log out
        clearAuthData();
        router.push("/login");
      }
    } catch (error) {
      console.error("Error refreshing token:", error);
      clearAuthData();
      router.push("/login");
    }
  };

  // You might want to add a check to see if token is about to expire
  // before refreshing. For example:
   // You'd need to implement this
   // Refresh if token expires in 5 minutes
    refreshToken();
}, [refresh, authService, router]); // Added dependencies

  useEffect(() => {
    checkAuthentication();
  }, [])

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider
      value={{
        // Existing values
        isLogin,
        userName,
        isDropdownOpen,
        setIsDropdownOpen,
        userData,
        handleLogout,
        handleLogin,
        
        // New permission-related values
        permissions,
        accessLevel,
        userRole,
        hasPermission,
        hasMinimumAccessLevel,
        canAccess,
        isAdmin,
        isOwner,
        isUser,
        
        // Utility functions
        refreshUserData: checkAuthentication,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}; */


// @Context/AuthContext/AuthContext.js
// @Context/AuthContext/AuthContext.js
"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/lib/authService";
import Loading from "@app/loading";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(false);
  const [userName, setUserName] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState({});
  const [token, setToken] = useState(null); // Add token state

  const [permissions, setPermissions] = useState([]);
  const [accessLevel, setAccessLevel] = useState(0);
  const [userRole, setUserRole] = useState("");

  const [loginError, setLoginError] = useState(null);
  const [lastAuthCheckFailed, setLastAuthCheckFailed] = useState(false);

  // Helper function to get token from localStorage
  const getStoredToken = () => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("access_token");
    }
    return null;
  };

  // Helper function to update token state
  const updateTokenState = () => {
    const storedToken = getStoredToken();
    setToken(storedToken);
  };

  const hasPermission = (permission) => permissions.includes(permission);
  const hasMinimumAccessLevel = (requiredLevel) => accessLevel >= requiredLevel;
  const canAccess = (requiredPermissions = [], requiredAccessLevel = 0) => {
    const hasRequiredPermissions = requiredPermissions.length === 0 ||
      requiredPermissions.every(permission => hasPermission(permission));
    const hasRequiredAccessLevel = hasMinimumAccessLevel(requiredAccessLevel);
    return hasRequiredPermissions && hasRequiredAccessLevel;
  };
  const isAdmin = () => userRole === 'Admin';
  const isOwner = () => userRole === 'Owner';
  const isUser = () => userRole === 'User';

  const storeAuthData = (authData) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("user", JSON.stringify(authData.user || {}));
      localStorage.setItem("permissions", JSON.stringify(authData.permissions || []));
      localStorage.setItem("access_level", authData.access_level?.toString() || "0");
      localStorage.setItem("user_role", authData.user?.role || "");
      // Update token state after storing
      updateTokenState();
    }
  };

  const loadCachedAuthData = () => {
    if (typeof window !== "undefined") {
      try {
        const cachedUser = localStorage.getItem("user");
        const cachedPermissions = localStorage.getItem("permissions");
        const cachedAccessLevel = localStorage.getItem("access_level");
        const cachedRole = localStorage.getItem("user_role");

        if (cachedUser && cachedPermissions) {
          const user = JSON.parse(cachedUser);
          setUserData(user);
          setPermissions(JSON.parse(cachedPermissions));
          setAccessLevel(parseInt(cachedAccessLevel) || 0);
          setUserRole(cachedRole || "");
          setUserName(user.lastName || user.name || "");
          // Update token state
          updateTokenState();
        }
      } catch (error) {
        console.error("Error loading cached auth data:", error);
        clearAuthData();
      }
    }
  };

  const clearAuthData = () => {
    setIsLogin(false);
    setUserName("");
    setUserData({});
    setPermissions([]);
    setAccessLevel(0);
    setUserRole("");
    setToken(null); // Clear token state
    setLoginError(null);
    setLastAuthCheckFailed(false);

    if (typeof window !== "undefined") {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("permissions");
      localStorage.removeItem("access_level");
      localStorage.removeItem("user_role");
      document.cookie = 'access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    }
  };

  const handleLogin = async (email, password) => {
    setLoading(true);
    setLoginError(null);
    try {
      const response = await authService.login({ email, password });

      if (!response.success) {
        throw new Error(response.error || "Login failed due to an unknown error.");
      }

      const profileData = await authService.userProfile();
      if (profileData && profileData.user) {
        setIsLogin(true);
        setUserName(profileData.user.lastName || profileData.user.name || "");
        setUserData(profileData.user);
        setPermissions(profileData.permissions || []);
        setAccessLevel(profileData.access_level || 0);
        setUserRole(profileData.user.role || "");
        storeAuthData(profileData); // This will also update token state
        setLastAuthCheckFailed(false);
      } else {
        console.warn("User profile fetch after login failed, using basic login data.");
        setIsLogin(true);
        setUserName(response.data.user?.lastName || response.data.user?.name || "");
        setUserData(response.data.user || {});
        setUserRole(response.data.user?.role || "");
        storeAuthData({ user: response.data.user, permissions: [], access_level: 0 });
        setLastAuthCheckFailed(false);
      }

      router.push("/");
      return { success: true };
    } catch (error) {
      console.error("Login failed:", error);
      const errorMessage = error.response?.data?.message || error.message || "Failed to log in. Please check your credentials.";
      setLoginError(errorMessage);
      clearAuthData();
      setLastAuthCheckFailed(true);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const checkAuthentication = async () => {
    setLoading(true);
    setLastAuthCheckFailed(false);
    try {
      loadCachedAuthData(); // This will also load token state

      const profileData = await authService.userProfile();
      if (profileData && profileData.user) {
        setIsLogin(true);
        setUserName(profileData.user.lastName || profileData.user.name || "");
        setUserData(profileData.user);
        setPermissions(profileData.permissions || []);
        setAccessLevel(profileData.access_level || 0);
        setUserRole(profileData.user.role || "");
        storeAuthData(profileData); // This will also update token state
        setLastAuthCheckFailed(false);
      } else {
        console.warn("User profile check failed, clearing authentication data.");
        clearAuthData();
        setLastAuthCheckFailed(true);
      }
    } catch (error) {
      if (error.response?.status === 401) {
        console.warn("Auth check: User is unauthorized. This is expected for unauthenticated users.", error);
      } else {
        console.error("Auth check failed:", error);
      }
      clearAuthData();
      setLastAuthCheckFailed(true);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
      clearAuthData();
      router.push("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // Initial check on mount
  useEffect(() => {
    checkAuthentication();
  }, []);

  if (loading) {
    return <Loading/> ;
  }

  return (
    <AuthContext.Provider
      value={{
        isLogin,
        userName,
        isDropdownOpen,
        setIsDropdownOpen,
        userData,
        token, // Expose token
        handleLogout,
        handleLogin,
        loading, // Expose loading state
        permissions,
        accessLevel,
        userRole,
        hasPermission,
        hasMinimumAccessLevel,
        canAccess,
        isAdmin,
        isOwner,
        isUser,
        loginError,
        lastAuthCheckFailed,
        refreshUserData: checkAuthentication,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};