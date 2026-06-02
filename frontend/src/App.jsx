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
import ClassDetail from './pages/student/ClassDetail';
import Profile from './pages/student/Profile';
import Settings from './pages/student/Settings';
import AssignmentDetail from './pages/student/AssignmentDetail';

// Instructor pages
import InstructorDashboard from './pages/instructor/Dashboard';
import ManageClassroom from './pages/instructor/ManageClassroom';
import ManageClassDetail from './pages/instructor/ManageClassDetail';
import ManageAssignments from './pages/instructor/ManageAssignments';

// General pages
import Login from './pages/Login';
import NotFound from './pages/general/NotFound';

// Dev utilities
import DevRoleToggle from './components/general/DevRoleToggle';

import { useAuth as useClerkAuth } from '@clerk/react';

// ─── Protected Route ─────────────────────────────────────────────────────────
// Guards a layout route: redirects to login if not authenticated, or if the current role doesn't match.
const ProtectedRoute = ({ allowedRole, redirectTo }) => {
  const { role } = useAuth();
  const { isLoaded, isSignedIn } = useClerkAuth();

  if (!isLoaded) return null; // or a loading spinner

  if (!isSignedIn) {
    return <Navigate to="/login" replace />;
  }

  if (role !== allowedRole) {
    return <Navigate to={redirectTo} replace />;
  }
  return <Outlet />;
};

// ─── Root redirect based on active role ──────────────────────────────────────
const RootRedirect = () => {
  const { role } = useAuth();
  const { isLoaded, isSignedIn } = useClerkAuth();

  if (!isLoaded) return null;

  if (!isSignedIn) {
    return <Navigate to="/login" replace />;
  }

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
          <Route path="/student/*" element={<StudentLayout />}>
            <Route path="dashboard" element={<StudentDashboard />} />
            <Route path="assignments" element={<Assignments />} />
            <Route path="assignments/:id" element={<AssignmentDetail />} />
            <Route path="sandbox" element={<Sandbox />} />
            <Route path="reports" element={<Reports />} />
            <Route path="classes" element={<Classes />} />
            <Route path="classes/:id" element={<ClassDetail />} />
            <Route path="profile" element={<Profile />} />
            <Route path="settings" element={<Settings />} />
          </Route>

          {/* Instructor routes — guard → layout → pages */}
          <Route path="/instructor/*" element={<InstructorLayout />}>
            <Route path="dashboard" element={<InstructorDashboard />} />
            <Route path="classroom" element={<ManageClassroom />} />
            <Route path="classroom/:id" element={<ManageClassDetail />} />
            <Route path="assignments" element={<ManageAssignments />} />
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