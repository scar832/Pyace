import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

const isTokenExpired = (token) => {
  if (!token) return true;
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return true;
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      window.atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    const payload = JSON.parse(jsonPayload);
    if (!payload.exp) return false;
    return payload.exp * 1000 < Date.now();
  } catch (e) {
    return true;
  }
};

export const AuthProvider = ({ children }) => {
  // Hydrate from localStorage so sessions survive page refreshes, verifying token validity
  const [token, setToken] = useState(() => {
    const storedToken = localStorage.getItem('pyace_token');
    if (isTokenExpired(storedToken)) {
      localStorage.removeItem('pyace_token');
      localStorage.removeItem('user_role');
      return null;
    }
    return storedToken;
  });
  const [role, setRole] = useState(() => localStorage.getItem('user_role') || 'student');

  // Keep localStorage in sync whenever token or role changes
  useEffect(() => {
    if (token) {
      localStorage.setItem('pyace_token', token);
    } else {
      localStorage.removeItem('pyace_token');
    }
  }, [token]);

  useEffect(() => {
    if (role) {
      localStorage.setItem('user_role', role);
    }
  }, [role]);

  /** Call after a successful login / registration */
  const login = (accessToken, userRole) => {
    setToken(accessToken);
    setRole(userRole);
  };

  /** Clear session */
  const logout = () => {
    setToken(null);
    setRole('student');
    localStorage.removeItem('pyace_token');
    localStorage.removeItem('user_role');
  };

  const isAuthenticated = !!token;

  // Keep toggleRole for the DevRoleToggle component during development
  const toggleRole = () => {
    setRole((prev) => (prev === 'student' ? 'teacher' : 'student'));
  };

  // Check token expiration periodically and intercept 401 Unauthorized API responses
  useEffect(() => {
    const checkToken = () => {
      const storedToken = localStorage.getItem('pyace_token');
      if (storedToken && isTokenExpired(storedToken)) {
        logout();
        window.location.href = '/';
      }
    };

    // Run check on mount
    checkToken();

    // Check periodically (every 10 seconds)
    const interval = setInterval(checkToken, 10000);

    // Intercept window.fetch to automatically log out on 401 Unauthorized errors
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      const response = await originalFetch(...args);
      if (response.status === 401) {
        logout();
        if (window.location.pathname !== '/') {
          window.location.href = '/';
        }
      }
      return response;
    };

    return () => {
      clearInterval(interval);
      window.fetch = originalFetch;
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        token,
        role,
        isAuthenticated,
        login,
        logout,
        setRole,
        toggleRole,
      }}
    >
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
