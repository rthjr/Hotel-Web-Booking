/* import axios from "axios";

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
        document.cookie = `access_token=${response.data.access_token}; path=/;`;
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
}; */

/* import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api";

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token") || localStorage.getItem("token");
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
          localStorage.setItem("access_token", response.data.access_token); // Keep both for compatibility
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
        localStorage.setItem("access_token", response.data.access_token); // Keep both for compatibility
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
        localStorage.setItem("access_token", response.data.access_token); // Keep both for compatibility
        localStorage.setItem("refresh_token", response.data.refresh_token);
        // Update the cookie with new token
        document.cookie = `access_token=${response.data.access_token}; path=/; secure; samesite=strict; max-age=${7 * 24 * 60 * 60}`;
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
        localStorage.setItem("access_token", response.data.access_token); // Keep both for compatibility
        localStorage.setItem("refresh_token", response.data.refresh_token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
         document.cookie = `access_token=${response.data.access_token}; path=/; secure; samesite=strict; max-age=${7 * 24 * 60 * 60}`;
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
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("permissions");
      localStorage.removeItem("access_level");
      localStorage.removeItem("user_role");

      // Clear the cookie
      document.cookie = 'access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      
      return { success: true };
    } catch (error) {
      // Even if the server-side logout fails, clear the local storage
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("permissions");
      localStorage.removeItem("access_level");
      localStorage.removeItem("user_role");

      // Clear the cookie even on error
      document.cookie = 'access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      
      return {
        success: false,
        error: error.response?.data?.message || "Logout failed",
      };
    }
  },

  // NEW METHOD: Get user profile with permissions
  async userProfile() {
    try {
      const response = await api.get("/user/profile"); // This should match your Laravel route
      return response.data; // Return the raw data as your backend already formats it correctly
    } catch (error) {
      console.error("UserProfile API Error:", error);
      throw new Error(error.response?.data?.message || "Failed to fetch user profile");
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
      return response.data; // Return raw data for compatibility with your AuthContext
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to get user data");
    }
  },

  isAuthenticated() {
    return !!(localStorage.getItem("access_token") || localStorage.getItem("token"));
  },

  getAccessToken() {
    return localStorage.getItem("access_token") || localStorage.getItem("token");
  },
  
  getRefreshToken() {
    return localStorage.getItem("refresh_token");
  },
  
  getUser() {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  }
}; */

import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api";

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Helper function to clear all local authentication data
const clearLocalAuthData = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("token"); // Remove old key
    localStorage.removeItem("user");
    localStorage.removeItem("permissions");
    localStorage.removeItem("access_level");
    localStorage.removeItem("user_role");
    document.cookie = 'access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
  }
};

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token") || localStorage.getItem("token");
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
          // No refresh token available, clear local data and reject
          console.warn("No refresh token available, clearing local auth data.");
          clearLocalAuthData(); // Direct clear, no API call
          return Promise.reject(error);
        }
        
        // Call refresh token endpoint
        const response = await axios.post(`${API_URL}/refresh`, {
          refresh_token: refresh_token
        });
        
        if (response.data.access_token) {
          // Store the new tokens
          localStorage.setItem("token", response.data.access_token);
          localStorage.setItem("access_token", response.data.access_token); // Keep both for compatibility
          localStorage.setItem("refresh_token", response.data.refresh_token);
          
          // Update the authorization header for subsequent requests
          api.defaults.headers.common["Authorization"] = `Bearer ${response.data.access_token}`;
          
          // Retry the original request with the new token
          return api(originalRequest);
        }
      } catch (refreshError) {
        // If refresh token is invalid, clear local data and reject
        console.error("Token refresh failed, clearing local auth data:", refreshError);
        clearLocalAuthData(); // Direct clear, no API call
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
        localStorage.setItem("access_token", response.data.access_token); // Keep both for compatibility
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
        localStorage.setItem("access_token", response.data.access_token); // Keep both for compatibility
        localStorage.setItem("refresh_token", response.data.refresh_token);
        // Update the cookie with new token
        document.cookie = `access_token=${response.data.access_token}; path=/; secure; samesite=strict; max-age=${7 * 24 * 60 * 60}`;
      }
      return { success: true, data: response.data };
    } catch (error) {
      // If refresh fails, clear local data directly
      console.error("Token refresh failed in refresh method, clearing local auth data:", error);
      clearLocalAuthData(); // Direct clear, no API call
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
        localStorage.setItem("access_token", response.data.access_token); // Keep both for compatibility
        localStorage.setItem("refresh_token", response.data.refresh_token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
          document.cookie = `access_token=${response.data.access_token}; path=/; secure; samesite=strict; max-age=${7 * 24 * 60 * 60}`;
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
    // IMPORTANT: Clear local data IMMEDIATELY first, regardless of backend response
    clearLocalAuthData(); 
    
    try {
      // Attempt to send logout request to backend for server-side invalidation
      // This is now optional and won't prevent client-side logout
      const refresh_token = localStorage.getItem("refresh_token"); // Still get for the API call if needed
      await api.post("/logout", { refresh_token });
      
      return { success: true };
    } catch (error) {
      // If server-side logout fails, local state is already cleared.
      console.error("Server-side logout API call failed:", error);
      return {
        success: false,
        error: error.response?.data?.message || "Server-side logout failed",
      };
    }
  },

  // NEW METHOD: Get user profile with permissions
  async userProfile() {
    try {
      const response = await api.get("/user/profile"); // This should match your Laravel route
      return response.data; // Return the raw data as your backend already formats it correctly
    } catch (error) {
      // Re-throw the original error, allowing AuthContext to handle Axios errors with response status
      throw error; 
    }
  },

  async getProfile() {
    try {
      const response = await api.get("/user-profile");
      return { success: true, data: response.data };  
    } catch (error) {
      // Re-throw the original error
      throw error; 
    }
  },

  async user() {
    try {
      const response = await api.get("/user");
      return response.data; // Return raw data for compatibility with your AuthContext
    } catch (error) {
      // Re-throw the original error
      throw error; 
    }
  },

  isAuthenticated() {
    return !!(localStorage.getItem("access_token") || localStorage.getItem("token"));
  },

  getAccessToken() {
    return localStorage.getItem("access_token") || localStorage.getItem("token");
  },
  
  getRefreshToken() {
    return localStorage.getItem("refresh_token");
  },
  
  getUser() {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  }
};
