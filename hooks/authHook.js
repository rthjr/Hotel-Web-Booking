/* // hooks/useAuth.js
'use client';

import { useState, useEffect, useContext, createContext } from 'react';
import { AuthContext } from '@Context/AuthContext/AuthContext';


export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);

  // Initialize auth state from localStorage
  useEffect(() => {
    const initAuth = async () => {
      try {
        const storedToken = localStorage.getItem('access_token');
        const storedUser = localStorage.getItem('user');
        
        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
          
          // Verify token is still valid
          await verifyToken(storedToken);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        logout();
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const verifyToken = async (token) => {
    try {
      const response = await fetch('/api/user/profile', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Token verification failed');
      }

      const userData = await response.json();
      setUser(userData);
      return userData;
    } catch (error) {
      console.error('Token verification error:', error);
      logout();
      throw error;
    }
  };

  const login = async (email, password) => {
    try {
      setLoading(true);
      const response = await fetch('/api/login', {
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

      if (data.status === 'success') {
        const { access_token, user: userData } = data;
        
        // Store in localStorage
        localStorage.setItem('access_token', access_token);
        localStorage.setItem('user', JSON.stringify(userData));
        
        // Update state
        setToken(access_token);
        setUser(userData);
        
        return { success: true, user: userData };
      } else {
        throw new Error(data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      // Call logout API if token exists
      if (token) {
        await fetch('/api/logout', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
      }
    } catch (error) {
      console.error('Logout API error:', error);
    } finally {
      // Clear local storage and state regardless of API call result
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
      setToken(null);
      setUser(null);
    }
  };

  const updateUser = async () => {
    try {
      if (!token) return null;
      
      const response = await fetch('/api/user/profile', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user profile');
      }

      const userData = await response.json();
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      
      return userData;
    } catch (error) {
      console.error('Update user error:', error);
      return null;
    }
  };

  const hasRole = (role) => {
    if (!user) return false;
    return user.role === role;
  };

  const isOwner = () => hasRole('Owner');
  const isAdmin = () => hasRole('Admin');
  const isGuest = () => hasRole('Guest') || !user;

  const value = {
    user,
    token,
    loading,
    login,
    logout,
    updateUser,
    hasRole,
    isOwner,
    isAdmin,
    isGuest,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

 */
// hooks/useAuthHook.js
'use client';

import { useAuth as useAuthContext } from '@Context/AuthContext/AuthContext';

export const useAuthHook = () => {
  const auth = useAuthContext();

  return {
    user: auth.userData, // Map userData to user
    token: auth.token, // Use token from context (if you update AuthProvider)
    loading: auth.loading,
    isAuthenticated: auth.isLogin,
    // Expose other useful properties
    userRole: auth.userRole,
    permissions: auth.permissions,
    accessLevel: auth.accessLevel,
    handleLogin: auth.handleLogin,
    handleLogout: auth.handleLogout,
    refreshUserData: auth.refreshUserData,
    // Helper functions
    isAdmin: auth.isAdmin,
    isOwner: auth.isOwner,
    isUser: auth.isUser,
    hasPermission: auth.hasPermission,
    canAccess: auth.canAccess,
    // Error states
    loginError: auth.loginError,
    lastAuthCheckFailed: auth.lastAuthCheckFailed,
  };
};
