import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MoreVertical, Star, Archive, LogOut } from 'lucide-react';

/**
 * ClassCard — displays a class summary with:
 *  - cover image (or gradient fallback)
 *  - status badge (active / past)
 *  - three-dot kebab menu (Favourite, Archive, Leave Class)
 *
 * Props:
 *  id           string   route id
 *  name         string
 *  courseCode   string
 *  lecturer     string
 *  status       'active' | 'past'
 *  coverImage   string   img URL (optional)
 *  accent       string   CSS colour used for gradient fallback
 */
const ClassCard = ({ id, name, courseCode, lecturer, status = 'active', coverImage, accent }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const inits = lecturer
    .split(' ')
    .filter(Boolean)
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  // Close dropdown when clicking outside
  useEffect(() => {
    if (!menuOpen) return;
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [menuOpen]);

  const handleMenuAction = (action, e) => {
    e.preventDefault(); // prevent Link navigation
    e.stopPropagation();
    setMenuOpen(false);
    // TODO: wire to API
    console.log(`[ClassCard] ${action} → ${id}`);
  };

  const toggleMenu = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setMenuOpen((prev) => !prev);
  };

  // Derive a gradient from accent colour for fallback
  const gradientStyle = {
    background: accent
      ? `linear-gradient(135deg, ${accent}cc, ${accent}66)`
      : 'linear-gradient(135deg, #0061ff, #4318FF)',
  };

  return (
    <Link to={`/student/classes/${id}`} className="class-card">
      {/* Cover image / gradient */}
      <div className="class-card-cover">
        {coverImage ? (
          <img src={coverImage} alt={name} loading="lazy" />
        ) : (
          <div className="class-card-cover-gradient" style={gradientStyle} />
        )}
        <span className={`class-card-status-badge ${status}`}>
          {status === 'active' ? 'Active' : 'Archived'}
        </span>
      </div>

      {/* Body */}
      <div className="class-card-body">
        <div className="class-card-top">
          <span className="class-card-code">{courseCode}</span>
        </div>

        <h3 className="class-card-name">{name}</h3>

        <div className="class-card-footer">
          <div className="class-card-avatar">{inits}</div>
          <span className="class-card-lecturer">{lecturer}</span>

          {/* Kebab menu */}
          <div className="card-menu-wrapper" ref={menuRef}>
            <button
              className="card-kebab-btn"
              onClick={toggleMenu}
              aria-label="More options"
              aria-expanded={menuOpen}
            >
              <MoreVertical size={16} />
            </button>

            {menuOpen && (
              <div className="card-dropdown" role="menu">
                <button
                  className="card-dropdown-item"
                  role="menuitem"
                  onClick={(e) => handleMenuAction('favourite', e)}
                >
                  <Star size={15} />
                  Favourite
                </button>
                <button
                  className="card-dropdown-item"
                  role="menuitem"
                  onClick={(e) => handleMenuAction('archive', e)}
                >
                  <Archive size={15} />
                  Archive
                </button>
                <button
                  className="card-dropdown-item danger"
                  role="menuitem"
                  onClick={(e) => handleMenuAction('leave', e)}
                >
                  <LogOut size={15} />
                  Leave Class
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ClassCard;
