import axios from "axios";

const API_URL =
  process.env.NEXT_PUBLIC_LARAVEL_API_URL || "http://127.0.0.1:8000/api";

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  async register(userData) {
    try {
      const response = await api.post("/api/register", userData);
      if (response.data.access_token) {
        localStorage.setItem("token", response.data.access_token);
      }
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Registration failed",
      };
    }
  },

  async login(credentials) {
    try {
      const response = await api.post("/api/login", credentials);
      if (response.data.access_token) {
        localStorage.setItem("token", response.data.access_token);
      }
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Login failed",
      };
    }
  },

  async logout() {
    try {
      await api.post("/logout");
      localStorage.removeItem("token");
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Logout failed",
      };
    }
  },

  async getProfile() {
    try {
      const response = await api.get("/api/user-profile");
      return { data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Failed to get profile",
      };
    }
  },

  async user() {
    try {
      const response = await api.get("/api/user");
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Failed to get profile",
      };
    }
  },

  isAuthenticated() {
    return !!localStorage.getItem("token");
  },

  getToken() {
    return localStorage.getItem("token");
  },
};
