// utils/api.js

const API_BASE_URL = 'http://localhost:8000/api' || process.env.NEXT_PUBLIC_LARAVEL_API_URL; // Ensure this ENV variable name is consistent (NEXT_PUBLIC_LARAVEL_API_URL or NEXT_PUBLIC_API_URL)

class ApiClient {
  constructor(baseURL = API_BASE_URL) { // Use the environment variable for baseURL
    this.baseURL = baseURL;
  }

  async refreshToken() {
  try {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await fetch(`${this.baseURL}/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${refreshToken}`
      }
    });

    if (!response.ok) {
      throw new Error('Token refresh failed');
    }

    const data = await response.json();
    this.setAuthToken(data.access_token);
    
    if (data.refresh_token) {
      localStorage.setItem('refresh_token', data.refresh_token);
    }

    return data.access_token;
  } catch (error) {
    // If refresh fails, redirect to login
    this.removeAuthToken();
    localStorage.removeItem('refresh_token');
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
    throw error;
  }
}

  // Get auth token from localStorage
  // Standardize: Let's use 'access_token' consistently as Laravel JWT returns it.
  getAuthToken() {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('access_token'); // Use 'access_token'
    }
    return null;
  }

  // Store auth token in localStorage
  setAuthToken(token) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('access_token', token); // Use 'access_token'
    }
  }

  // Remove auth token from localStorage
  removeAuthToken() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('access_token'); // Use 'access_token'
    }
  }

  // Get default headers
  getHeaders(customHeaders = {}) {
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json', // Good practice to include Accept header
      ...customHeaders,
    };

    const token = this.getAuthToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    return headers;
  }

  // Handle API responses
  async handleResponse(response) {
  const contentType = response.headers.get('content-type');

  let data;
  if (contentType && contentType.includes('application/json')) {
    data = await response.json();
  } else if (response.status === 204) {
    return null;
  } else {
    data = await response.text();
  }

  // Handle 401 Unauthorized - try to refresh token
  if (response.status === 401 && this.getAuthToken()) {
    try {
      await this.refreshToken();
      // Retry the original request would go here
      // For now, just redirect to login
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    } catch (refreshError) {
      // Already handled in refreshToken method
    }
  }

  if (!response.ok) {
    const errorMessage = data.message || data.error || `HTTP ${response.status}: ${response.statusText}`;
    const error = new Error(errorMessage);
    error.status = response.status;
    error.response = data;
    throw error;
  }

  return data;
}

  // GET request
  async get(endpoint, options = {}) {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'GET',
        headers: this.getHeaders(options.headers),
        ...options,
      });
      return await this.handleResponse(response);
    } catch (error) {
      console.error(`GET ${endpoint} error:`, error);
      throw error;
    }
  }

  // POST request
  async post(endpoint, data = null, options = {}) {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'POST',
        headers: this.getHeaders(options.headers),
        body: data ? JSON.stringify(data) : null,
        ...options,
      });
      return await this.handleResponse(response);
    } catch (error) {
      console.error(`POST ${endpoint} error:`, error);
      throw error;
    }
  }

  // PUT request
  async put(endpoint, data = null, options = {}) {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'PUT',
        headers: this.getHeaders(options.headers),
        body: data ? JSON.stringify(data) : null,
        ...options,
      });
      return await this.handleResponse(response);
    } catch (error) {
      console.error(`PUT ${endpoint} error:`, error);
      throw error;
    }
  }

  // PATCH request
  async patch(endpoint, data = null, options = {}) {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'PATCH',
        headers: this.getHeaders(options.headers),
        body: data ? JSON.stringify(data) : null,
        ...options,
      });
      return await this.handleResponse(response);
    } catch (error) {
      console.error(`PATCH ${endpoint} error:`, error);
      throw error;
    }
  }

  // DELETE request
  async delete(endpoint, options = {}) {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'DELETE',
        headers: this.getHeaders(options.headers),
        ...options,
      });
      return await this.handleResponse(response);
    } catch (error) {
      console.error(`DELETE ${endpoint} error:`, error);
      throw error;
    }
  }

  // Upload file (already well-defined)
  async uploadFile(endpoint, file, additionalData = {}) {
    try {
      const formData = new FormData();
      formData.append('file', file);

      // Add additional data to form
      Object.keys(additionalData).forEach(key => {
        formData.append(key, additionalData[key]);
      });

      const token = this.getAuthToken();
      const headers = {}; // FormData sends its own Content-Type, so don't set 'application/json' here
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'POST',
        headers, // No Content-Type for FormData
        body: formData,
      });

      return await this.handleResponse(response);
    } catch (error) {
      console.error(`Upload ${endpoint} error:`, error);
      throw error;
    }
  }
}

// Create and export API client instance
export const api = new ApiClient();

// Export specific methods for convenience
export const { get, post, put, patch, delete: del, uploadFile } = api;

// Export default instance
export default api;