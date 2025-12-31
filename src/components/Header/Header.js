import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Header.css';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <nav className={`super-nav ${scrolled ? 'scrolled' : ''}`}>
      <div className="nav-container">
        <div className="nav-main">
          <Link to="/" className="logo">
            <img src="/logo.png" alt="PhoneClubs" className="logo-img" />
          </Link>
          
          <ul className="nav-links">
            <li>
              <Link to="/single-sell" className={`nav-link ${isActive('/single-sell') ? 'active' : ''}`}>
                Single Sell
              </Link>
            </li>
            <li>
              <Link to="/bulk-sell" className={`nav-link ${isActive('/bulk-sell') ? 'active' : ''}`}>
                Bulk Sell
              </Link>
            </li>
            <li>
              <Link to="/auctions" className={`nav-link ${isActive('/auctions') ? 'active' : ''}`}>
                Auctions
              </Link>
            </li>
            <li>
              <Link to="/blog" className={`nav-link ${isActive('/blog') ? 'active' : ''}`}>
                Blog
              </Link>
            </li>
          </ul>
        </div>
        
        <div className="nav-actions">
          {user ? (
            <>
              <Link to="/profile" className="nav-btn btn-login">Profile</Link>
              <button onClick={handleLogout} className="nav-btn btn-login">Logout</button>
              {user.userType !== 'buyer' && (
                <Link to="/post-ad" className="btn-sell">
                  <i className="fas fa-plus"></i>
                  <span className="btn-sell-text">Sell Phone</span>
                </Link>
              )}
            </>
          ) : (
            <>
              <Link to="/login" className="nav-btn btn-login">Sign In</Link>
              <Link to="/register" className="nav-btn btn-signup">Sign Up</Link>
              <Link to="/post-ad" className="btn-sell">
                <i className="fas fa-plus"></i>
                <span className="btn-sell-text">Sell iPhone</span>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Header;

