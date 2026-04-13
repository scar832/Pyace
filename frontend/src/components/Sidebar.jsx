import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, BookOpen, Settings, User, SquareTerminal, GraduationCap, School } from 'lucide-react';
import { motion } from 'framer-motion';
import Logo from '../assets/image2.png';
import '../Styles/Sidebar.css';
import { ChevronRight } from 'lucide-react';

const studentRoutes = [
  { path: 'dashboard',   name: 'DASHBOARD',  icon: LayoutDashboard },
  { path: 'classes',     name: 'MY CLASSES', icon: School },
  { path: 'assignments', name: 'ASSIGNMENT',  icon: BookOpen },
  { path: 'sandbox',     name: 'SANDBOX',     icon: SquareTerminal },
  { path: 'reports',     name: 'REPORT',      icon: GraduationCap },
];

const instructorRoutes = [
  { path: 'dashboard', name: 'DASHBOARD', icon: LayoutDashboard },
];

// basePath: "/student" | "/instructor"
const Sidebar = ({ basePath = '/student' }) => {
  const routes = basePath === '/instructor' ? instructorRoutes : studentRoutes;
  const portalLabel = basePath === '/instructor' ? 'Instructor Portal' : 'Student Portal';

  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <img src={Logo} alt="Pyace Logo" />
        <div className='user-type'>
          <div className="left">
            <h2>{portalLabel}</h2>
            <p className='description'>Frankliving Academy</p>
          </div>
          <div className="right">
            <ChevronRight />
          </div>
        </div>
      </div>

      <nav className="sidebar-nav">
        {routes.map((route) => (
          <NavLink
            key={route.path}
            to={`${basePath}/${route.path}`}
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            {({ isActive }) => (
              <>
                <route.icon className="nav-icon" size={20} />
                <span>{route.name}</span>
                {isActive && (
                  <motion.div
                    layoutId="active-bg"
                    className="active-bg"
                    initial={false}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="user-info">
          <div className="user-avatar">JS</div>
          <div className="user-details">
            <span className="user-name">John Smith</span>
            <span className="user-role">
              {basePath === '/instructor' ? 'Instructor' : 'Student'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
