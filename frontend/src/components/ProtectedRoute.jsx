import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ allowedRoles }) => {
  const token = localStorage.getItem('pyace_token');
  const role = localStorage.getItem('user_role');

  if (!token) {
    return <Navigate to="/" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    // Redirect to the correct dashboard based on role
    if (role === 'teacher') {
      return <Navigate to="/instructor/dashboard" replace />;
    } else {
      return <Navigate to="/student/dashboard" replace />;
    }
  }

  return <Outlet />;
};

export default ProtectedRoute;
