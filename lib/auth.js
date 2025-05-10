

// Authentication service for Laravel JWT backend
const API_URL = process.env.NEXT_PUBLIC_LARAVEL_API_URL /* || 'http://127.0.0.1:8000' */;

// Helper function to get auth header
const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
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

/* export const register = async (userData) => {
  try {
    const response = await fetch(`${API_URL}/api/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Registration failed');
    }

    // Store the token if registration includes auto-login
    if (data.access_token) {
      localStorage.setItem('token', data.access_token);
    }

    return data;
  } catch (error) {
    throw error;
  }
}; */

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


/* export const checkAuth = async () => {
  try {
    let token = localStorage.getItem("token");

    if (!token) {
      throw new Error("No authentication token found.");
    }

    let response = await fetch(`${API_URL}/api/user-profile`, {
      headers: { "Authorization": `Bearer ${token}` },
    });

    // If token is expired (401 Unauthorized), refresh it
    if (response.status === 401) {
      console.warn("Token expired, refreshing...");
      const newToken = await refreshToken();
      if (newToken) {
        token = newToken.access_token;
        response = await fetch(`${API_URL}/api/user-profile`, {
          headers: { "Authorization": `Bearer ${token}` },
        });
      }
    }

    const data = await response.json();
    
    if (!response.ok) {
      localStorage.removeItem("token");
      return { authenticated: false };
    }

    return { authenticated: true, user: data };
  } catch (error) {
    console.error("Fetch Error:", error);
    localStorage.removeItem("token");
    return { authenticated: false };
  }
}; */

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

/* export const checkAuth = async () => {
  try {
    const response = await fetch(`${API_URL}/api/user-profile`, {
      headers: getAuthHeader(),
    });

    if (!response.ok) {
      // If unauthorized, clear token
      localStorage.removeItem('token');
      return { authenticated: false };
    }

    const data = await response.json();
    return {
      authenticated: true,
      user: data
    };
  } catch (error) {
    localStorage.removeItem('token');
    return { authenticated: false };
  }
}; */

export const refreshToken = async () => {
  try {
    const response = await fetch(`${API_URL}/api/refresh`, {
      method: 'POST',
      headers: getAuthHeader(),
    });

    const data = await response.json();
    
    console.log("Token Refresh Response:", response.status, data); // Debugging

    if (!response.ok) {
      throw new Error(data.message || 'Token refresh failed');
    }

    // Update stored token
    localStorage.setItem('token', data.access_token);
    return data;
  } catch (error) {
    console.error("Refresh Token Error:", error);
    throw error;
  }
};

/* export const refreshToken = async () => {
  try {
    const response = await fetch(`${API_URL}/api/refresh`, {
      method: 'POST',
      headers: getAuthHeader(),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Token refresh failed');
    }

    // Update stored token
    localStorage.setItem('token', data.access_token);
    return data;
  } catch (error) {
    throw error;
  }
}; */ 