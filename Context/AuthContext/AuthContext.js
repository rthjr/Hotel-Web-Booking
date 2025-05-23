"use client";

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
