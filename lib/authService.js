import axios from "axios";

const API_URL =  "http://127.0.0.1:8000/api";

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // If the error is 401 and the request hasn't been retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Mark the request as retried
      
      try {
        // Try to refresh the token
        const refresh_token = localStorage.getItem("refresh_token");
        
        if (!refresh_token) {
          // No refresh token available, logout user
          authService.logout();
          return Promise.reject(error);
        }
        
        // Call refresh token endpoint
        const response = await axios.post(`${API_URL}/refresh`, {
          refresh_token: refresh_token
        });
        
        if (response.data.access_token) {
          // Store the new tokens
          localStorage.setItem("token", response.data.access_token);
          localStorage.setItem("refresh_token", response.data.refresh_token);
          
          // Update the authorization header
          api.defaults.headers.common["Authorization"] = `Bearer ${response.data.access_token}`;
          
          // Retry the original request with the new token
          return api(originalRequest);
        }
      } catch (refreshError) {
        // If refresh token is invalid, logout user
        authService.logout();
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

export const authService = {
  async register(userData) {
    try {
      const response = await api.post("/register", userData);
      if (response.data.access_token) {
        localStorage.setItem("token", response.data.access_token);
        localStorage.setItem("refresh_token", response.data.refresh_token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
      }
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Registration failed",
      };
    }
  },

  

  async refresh() {
    try {
      const refresh_token = localStorage.getItem("refresh_token");
      if (!refresh_token) {
        throw new Error("No refresh token available");
      }
      
      const response = await api.post("/refresh", { refresh_token });
      
      if (response.data.access_token) {
        localStorage.setItem("token", response.data.access_token);
        localStorage.setItem("refresh_token", response.data.refresh_token);
      }
      return { success: true, data: response.data };
    } catch (error) {
      // If refresh fails, log the user out
      this.logout();
      return {
        success: false,
        error: error.response?.data?.message || "Token refresh failed",
      };
    }
  },

  async login(credentials) {
    try {
      const response = await api.post("/login", credentials);
      if (response.data.access_token) {
        localStorage.setItem("token", response.data.access_token);
        localStorage.setItem("refresh_token", response.data.refresh_token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
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
      // Send both tokens to the server for proper invalidation
      const refresh_token = localStorage.getItem("refresh_token");
      await api.post("/logout", { refresh_token });
      
      // Clear all auth data from localStorage
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("user");
      
      return { success: true };
    } catch (error) {
      // Even if the server-side logout fails, clear the local storage
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("user");
      
      return {
        success: false,
        error: error.response?.data?.message || "Logout failed",
      };
    }
  },

  async getProfile() {
    try {
      const response = await api.get("/user-profile");
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Failed to get profile",
      };
    }
  },

  async user() {
    try {
      const response = await api.get("/user");
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Failed to get user data",
      };
    }
  },

  isAuthenticated() {
    return !!localStorage.getItem("access_token");
  },

  getAccessToken() {
    return localStorage.getItem("access_token");
  },
  
  getRefreshToken() {
    return localStorage.getItem("refresh_token");
  },
  
  getUser() {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  }
};