import { NavLink, Link, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, BookOpen, Settings, SquareTerminal, GraduationCap, School, LogOut, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import Logo from '../assets/image2.png';
import '../Styles/Sidebar.css';
import { useAuth } from '../context/AuthContext';

const studentRoutes = [
  { path: '/student/dashboard', name: 'DASHBOARD', icon: LayoutDashboard },
  { path: '/student/classes', name: 'MY CLASSES', icon: School },
  { path: '/student/assignments', name: 'ASSIGNMENTS', icon: BookOpen },
  { path: '/student/sandbox', name: 'SANDBOX', icon: SquareTerminal },
  { path: '/student/reports', name: 'REPORTS', icon: GraduationCap },
  { path: '/student/settings', name: 'SETTINGS', icon: Settings },
];

const instructorRoutes = [
  { path: '/instructor/dashboard', name: 'DASHBOARD', icon: LayoutDashboard },
  { path: '/instructor/classroom', name: 'MANAGE CLASSROOM', icon: School },
  { path: '/instructor/assignments', name: 'MANAGE ASSIGNMENTS', icon: BookOpen },
];

// basePath: "/student" | "/instructor"
const Sidebar = ({ basePath = '/student' }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

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
            to={route.path}
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
        <button
          onClick={handleLogout}
          className="logout-btn"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            width: '100%',
            padding: '12px',
            background: 'transparent',
            border: 'none',
            borderRadius: '8px',
            color: 'var(--color-text-muted)',
            cursor: 'pointer',
            fontWeight: 600,
            fontSize: '0.9rem',
            fontFamily: 'inherit',
            transition: 'all 0.2s ease',
            marginBottom: '12px',
            textAlign: 'left',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = '#ef4444';
            e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.08)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = 'var(--color-text-muted)';
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
        >
          <LogOut size={20} className="nav-icon" />
          <span>LOGOUT</span>
        </button>

        <Link to={`${basePath}/profile`} style={{ textDecoration: 'none', color: 'inherit' }}>
          <div className="user-info">
            <div className="user-avatar">JS</div>
            <div className="user-details">
              <span className="user-name">John Smith</span>
              <span className="user-role">
                {basePath === '/instructor' ? 'Instructor' : 'Student'}
              </span>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
