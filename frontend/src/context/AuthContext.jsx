import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // Hydrate from localStorage so sessions survive page refreshes
  const [token, setToken] = useState(() => localStorage.getItem('pyace_token'));
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
