"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { login, logout, checkAuth } from "@/lib/auth";
import { authService } from "@lib/authService";
import { set } from "mongoose";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(false);
  const [userName, setUserName] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState([]);

  useEffect(() => {
    checkAuthentication();
  }, []);

  const handleLogin = async (email, password) => {
    try {
      const response = await authService.login(email, password);

      if (!response.success) {
        throw new Error(response.error);
      }

      localStorage.setItem("token", response.user.token);
      setIsLogin(true);
      setUserName(response.user.lastName || "");
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
  /*
    const handleLogin = async (email, password) => {
        try {
            const response = await login(email, password);
            setIsLogin(true);
            setUserName(response.user.lastName || "");
            router.push('/');
            return { success: true };
        } catch (error) {
            console.error('Login failed:', error);
            return { success: false, error: error.message };
        }
    }; */

  const handleLogout = async () => {
    try {
      await logout();
      setIsLogin(false);
      setUserName("");
      router.push("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

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
