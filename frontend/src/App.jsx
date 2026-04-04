import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Login from './pages/Login';
import NotFound from './pages/404';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Classes from './pages/Classes';
import Layout from './components/Layout';
import Assignment from './pages/Assignment';
import Sandbox from './pages/Sandbox';
import Report from './pages/Report';


const App = () => {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Login />} />

        {/* Protected Routes directly under Layout */}
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/classes" element={<Classes />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/assignment" element={<Assignment />} />
          <Route path="/sandbox" element={<Sandbox />} />
          <Route path="/report" element={<Report />} />
          <Route path="/settings" element={<Settings />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>

    </Router>
  )
}

export default App