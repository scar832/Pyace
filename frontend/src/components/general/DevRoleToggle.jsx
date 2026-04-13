import React from 'react';
import { useAuth } from '../../context/AuthContext';

// Inner component — hooks always called, render is guarded by the wrapper below
const Toggle = () => {
  const { role, toggleRole } = useAuth();

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        background: 'rgba(15, 15, 25, 0.85)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(255,255,255,0.12)',
        borderRadius: '999px',
        padding: '8px 16px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
        fontFamily: 'Manrope, Inter, sans-serif',
        fontSize: '13px',
        color: '#fff',
        userSelect: 'none',
      }}
    >
      <span style={{ opacity: 0.6, fontWeight: 500 }}>DEV</span>
      <span style={{ opacity: 0.35 }}>|</span>
      <span
        style={{
          fontWeight: 700,
          color: role === 'STUDENT' ? '#7dd3fc' : '#a78bfa',
          letterSpacing: '0.05em',
        }}
      >
        {role}
      </span>
      <button
        onClick={toggleRole}
        style={{
          background:
            role === 'STUDENT'
              ? 'linear-gradient(135deg, #0ea5e9, #6366f1)'
              : 'linear-gradient(135deg, #7c3aed, #ec4899)',
          border: 'none',
          borderRadius: '999px',
          color: '#fff',
          fontSize: '12px',
          fontWeight: 600,
          padding: '4px 12px',
          cursor: 'pointer',
          transition: 'opacity 0.2s',
          fontFamily: 'inherit',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.8')}
        onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
      >
        Switch
      </button>
    </div>
  );
};

// Outer wrapper — guards render in production without violating Rules of Hooks
const DevRoleToggle = () => {
  if (process.env.NODE_ENV === 'production') return null;
  return <Toggle />;
};

export default DevRoleToggle;
