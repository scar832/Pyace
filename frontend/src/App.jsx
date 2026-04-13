import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
} from 'react-router-dom';

import { AuthProvider, useAuth } from './context/AuthContext';

// Layouts
import StudentLayout from './pages/student/StudentLayout';
import InstructorLayout from './pages/instructor/InstructorLayout';

// Student pages
import StudentDashboard from './pages/student/Dashboard';
import Assignments from './pages/student/Assignments';
import Sandbox from './pages/student/Sandbox';
import Reports from './pages/student/Reports';
import Classes from './pages/student/Classes';
import Profile from './pages/student/Profile';
import Settings from './pages/student/Settings';

// Instructor pages
import InstructorDashboard from './pages/instructor/Dashboard';

// General pages
import Login from './pages/Login';
import NotFound from './pages/general/NotFound';

// Dev utilities
import DevRoleToggle from './components/general/DevRoleToggle';

// ─── Protected Route ─────────────────────────────────────────────────────────
// Guards a layout route: redirects if the current role doesn't match.
const ProtectedRoute = ({ allowedRole, redirectTo }) => {
  const { role } = useAuth();
  if (role !== allowedRole) {
    return <Navigate to={redirectTo} replace />;
  }
  return <Outlet />;
};

// ─── Root redirect based on active role ──────────────────────────────────────
const RootRedirect = () => {
  const { role } = useAuth();
  return (
    <Navigate
      to={role === 'INSTRUCTOR' ? '/instructor/dashboard' : '/student/dashboard'}
      replace
    />
  );
};

// ─── Inner App (needs access to AuthContext) ──────────────────────────────────
const AppRoutes = () => {
  return (
    <>
      <Router>
        <Routes>
          {/* Public */}
          <Route path="/login" element={<Login />} />

          {/* Root → role-based redirect */}
          <Route path="/" element={<RootRedirect />} />

          {/* Student routes — guard → layout → pages */}
          <Route
            element={
              <ProtectedRoute
                allowedRole="STUDENT"
                redirectTo="/instructor/dashboard"
              />
            }
          >
            <Route path="/student/*" element={<StudentLayout />}>
              <Route path="dashboard" element={<StudentDashboard />} />
              <Route path="assignments" element={<Assignments />} />
              <Route path="sandbox" element={<Sandbox />} />
              <Route path="reports" element={<Reports />} />
              <Route path="classes" element={<Classes />} />
              <Route path="profile" element={<Profile />} />
              <Route path="settings" element={<Settings />} />
            </Route>
          </Route>

          {/* Instructor routes — guard → layout → pages */}
          <Route
            element={
              <ProtectedRoute
                allowedRole="INSTRUCTOR"
                redirectTo="/student/dashboard"
              />
            }
          >
            <Route path="/instructor/*" element={<InstructorLayout />}>
              <Route path="dashboard" element={<InstructorDashboard />} />
            </Route>
          </Route>

          {/* Catch-all */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>

      {/* Dev-only toggle — outside Router keeps it always visible */}
      <DevRoleToggle />
    </>
  );
};

// ─── App root ────────────────────────────────────────────────────────────────
const App = () => {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
};

export default App;