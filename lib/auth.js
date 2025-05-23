// Authentication service for Laravel JWT backend
const API_URL = process.env.NEXT_PUBLIC_LARAVEL_API_URL /* || 'http://127.0.0.1:8000' */;

// Helper function to get auth header
const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return {
    'Accept': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
};

export const login = async (email, password) => {
  try {
    const response = await fetch(`${API_URL}/api/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Login failed');
    }

    // Store the token
    localStorage.setItem('token', data.access_token);

    // Immediately fetch user profile
    return await checkAuth();
    
    /* return data; */
  } catch (error) {
    throw error;
  }
};

export const register = async (userData) => {
  try {
    const response = await fetch(`${API_URL}/api/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.error("Registration Error:", response.status, data);
      throw new Error(data.message || `Registration failed with status: ${response.status}`);
    }

    if (data.access_token) {
      localStorage.setItem('token', data.access_token);
    }

    return data;
  } catch (error) {
    console.error("Fetch Error:", error);
    throw error;
  }
};

export const logout = async () => {
  try {
    const response = await fetch(`${API_URL}/api/logout`, {
      method: 'POST',
      headers: {
        ...getAuthHeader(),
        'Content-Type': 'application/json',
      },
    });

    // Clear the token regardless of response
    localStorage.removeItem('token');

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || 'Logout failed');
    }

    return { success: true };
  } catch (error) {
    throw error;
  }
};


export const checkAuth = async () => {
  try {
    const response = await fetch(`${API_URL}/api/user-profile`, {
      headers: getAuthHeader(),
    });

    const data = await response.json();
    
    console.log("Profile Response:", response.status, data); // Debugging

    if (!response.ok) {
      localStorage.removeItem('token');
      return { authenticated: false };
    }

    return {
      authenticated: true,
      user: data,
    };
  } catch (error) {
    console.error("Fetch Error:", error);
    localStorage.removeItem('token');
    return { authenticated: false };
  }
};


export const refreshToken = async () => {
  try {
    const response = await fetch(`${API_URL}/api/refresh`, {
      method: "POST",
      headers: getAuthHeader(),
    });
    const data = await response.json();
    if (response.ok && data.access_token) {
      localStorage.setItem("token", data.access_token);
      return data.access_token;
    }
    throw new Error("Refresh failed");
  } catch (error) {
    localStorage.removeItem("token");
    return null;
  }
};


export const fetchWithAuth = async (url, options = {}) => {
  let token = localStorage.getItem("token");
  let headers = { ...options.headers, ...getAuthHeader() };

  let response = await fetch(url, { ...options, headers });
  if (response.status === 401) {
    console.log("Token expired, attempting refresh...");
    const newToken = await refreshToken();
    if (newToken) {
      headers = { ...options.headers, Authorization: `Bearer ${newToken}` };
      response = await fetch(url, { ...options, headers });
    } else {
      // Logout or redirect to login
      throw new Error("Session expired. Please log in again.");
    }
  }
  return response;
}; 