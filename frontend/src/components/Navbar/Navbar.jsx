import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="navbar">
      <div className="container">
        <div className="navbar-content">
          <Link to="/" className="navbar-brand">
            <h2>🎮 PixelFuel</h2>
          </Link>

          <div className={`navbar-menu ${isMenuOpen ? 'active' : ''}`}>
            <Link to="/" className="navbar-link" onClick={() => setIsMenuOpen(false)}>
              Home
            </Link>
            <Link to="/games" className="navbar-link" onClick={() => setIsMenuOpen(false)}>
              Games
            </Link>
            <Link to="/services" className="navbar-link" onClick={() => setIsMenuOpen(false)}>
              Services
            </Link>
            <Link to="/coaches" className="navbar-link" onClick={() => setIsMenuOpen(false)}>
              Coaches
            </Link>
            {isAuthenticated && (
              <Link to="/bookings" className="navbar-link" onClick={() => setIsMenuOpen(false)}>
                My Bookings
              </Link>
            )}

            {isAuthenticated ? (
              <div className="navbar-user">
                <span className="user-greeting">Hi, {user?.name}</span>
                <div className="user-dropdown">
                  <Link to="/profile" className="dropdown-link" onClick={() => setIsMenuOpen(false)}>
                    Profile
                  </Link>
                  {user?.role === 'coach' && (
                    <Link to="/coach/dashboard" className="dropdown-link" onClick={() => setIsMenuOpen(false)}>
                      Coach Dashboard
                    </Link>
                  )}
                  {user?.role === 'service-provider' && (
                    <Link to="/provider/dashboard" className="dropdown-link" onClick={() => setIsMenuOpen(false)}>
                      Provider Dashboard
                    </Link>
                  )}
                  {user?.role === 'admin' && (
                    <Link to="/admin" className="dropdown-link" onClick={() => setIsMenuOpen(false)}>
                      Admin Panel
                    </Link>
                  )}
                  <button onClick={handleLogout} className="dropdown-link logout-btn">
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <div className="navbar-auth">
                <Link to="/login" className="btn btn-outline" onClick={() => setIsMenuOpen(false)}>
                  Login
                </Link>
                <Link to="/register" className="btn btn-primary" onClick={() => setIsMenuOpen(false)}>
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          <button className="navbar-toggle" onClick={toggleMenu}>
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;