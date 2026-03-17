import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { modules } from './Sidebar';
import { FiMenu, FiX } from 'react-icons/fi';
import './BottomNav.css';

const bottomPaths = [
  '/dashboard',
  '/dashboard/baby',
  '/dashboard/pregnancy',
  '/dashboard/calendar',
];

export default function BottomNav() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const bottomModules = bottomPaths
    .map((p) => modules.find((m) => m.path === p))
    .filter(Boolean);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  // Close menu when navigating
  const handleLinkClick = () => setIsMenuOpen(false);

  return (
    <>
      {/* Mobile Dropdown Menu Overlay */}
      <div className={`mobile-menu-overlay ${isMenuOpen ? 'open' : ''}`} onClick={() => setIsMenuOpen(false)}>
        <div className="mobile-menu-content" onClick={e => e.stopPropagation()}>
          <div className="mobile-menu-header">
            <h3>Menu</h3>
            <button className="menu-close-btn" onClick={() => setIsMenuOpen(false)}>
              <FiX />
            </button>
          </div>
          <div className="mobile-menu-grid">
            {modules.map((mod) => (
              <NavLink
                key={mod.path}
                to={mod.path}
                end={mod.exact}
                onClick={handleLinkClick}
                className={({ isActive }) =>
                  `mobile-menu-item ${isActive ? 'active' : ''}`
                }
              >
                <span className="menu-emoji">{mod.emoji}</span>
                <span className="menu-label">{mod.label}</span>
              </NavLink>
            ))}
          </div>
        </div>
      </div>

      <nav className="bottom-nav">
        {bottomModules.map((mod) => (
          <NavLink
            key={mod.path}
            to={mod.path}
            end={mod.exact}
            onClick={() => setIsMenuOpen(false)}
            className={({ isActive }) =>
              `bottom-nav-item ${isActive ? 'bottom-nav-item-active' : ''}`
            }
          >
            <span className="bottom-nav-emoji">{mod.emoji}</span>
            <span className="bottom-nav-label">{mod.label}</span>
          </NavLink>
        ))}

        <button 
          className={`bottom-nav-item menu-toggle-btn ${isMenuOpen ? 'active' : ''}`}
          onClick={toggleMenu}
        >
          <span className="bottom-nav-emoji">
            {isMenuOpen ? <FiX /> : <FiMenu />}
          </span>
          <span className="bottom-nav-label">Mais</span>
        </button>
      </nav>
    </>
  );
}

