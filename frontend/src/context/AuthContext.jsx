import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [role, setRole] = useState('STUDENT');

  const toggleRole = () => {
    setRole((prev) => (prev === 'STUDENT' ? 'INSTRUCTOR' : 'STUDENT'));
  };

  return (
    <AuthContext.Provider value={{ role, setRole, toggleRole }}>
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
