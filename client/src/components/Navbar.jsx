import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Store, User, Menu, X, LogOut, ShoppingCart, Package, ChevronDown } from 'lucide-react';
import { useCart } from '../context/CartContext';
import './Navbar.css';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { clearCart } = useCart();
  const user = JSON.parse(localStorage.getItem("user"));

  const toggleMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLogout = () => {
    // clearCart(); // REMOVED: Don't clear server cart on logout
    localStorage.removeItem("user");
    window.location.reload();
  }

  return (
    <header>
      <div className="logo">
        <Link to="/">
          <img src="/images/Teer_Brand_Logo_Large.png" alt="Teer Brand Logo" />
        </Link>
        <span className="since-text">SINCE 1992</span>
      </div>

      <button
        className={`mobile-menu-btn ${isMobileMenuOpen ? 'active' : ''}`}
        onClick={toggleMenu}
        aria-label="Toggle Menu"
      >
        <Menu size={24} />
      </button>

      {/* --- DESKTOP NAV --- */}
      <nav className="main-nav desktop-only">
        <ul className="nav-links">
          <li><Link to="/">HOME</Link></li>
          <li><Link to="/who-we-are">WHO WE ARE</Link></li>

          <li className="dropdown">
            <Link to="/products">PRODUCTS ▼</Link>
            <ul className="dropdown-content">
              <li><Link to="/products?category=kitchen">KITCHEN ESSENTIALS</Link></li>
              <li><Link to="/products?category=spices">SPICES</Link></li>
              <li><Link to="/products?category=salts">SALTS</Link></li>
              <li><Link to="/products?category=blended">BLENDED MASALAS</Link></li>
            </ul>
          </li>

          <li><Link to="/events">EVENTS & AWARDS</Link></li>
          <li><Link to="/media">MEDIA</Link></li>
          <li><Link to="/news">NEWS</Link></li>
          <li><Link to="/contact-us">CONTACT US</Link></li>
        </ul>

        {/* --- FIXED ACTIONS SECTION --- */}
        <div className="nav-actions">
          {/* 1. ONLINE SHOP BUTTON */}
          <Link to="/store" className="goldiee-queen" style={{ display: 'flex', alignItems: 'center', gap: '8px', whiteSpace: 'nowrap' }}>
            <Store size={16} />
            <span>ONLINE SHOP</span>
          </Link>

          {/* 2. USER SECTION (Dropdown) */}
          {user ? (
            <div className="user-menu-container">
              {/* Trigger */}
              <div className="user-trigger">
                <User size={20} color="#e21f26" />
                <span className="user-name">Hi, {user.username}</span>
                <ChevronDown size={14} color="#e21f26" />
              </div>

              {/* Dropdown Menu */}
              <div className="user-dropdown">
                <Link to="/profile" className="user-dropdown-item">
                  <User size={16} /> <span>My Profile</span>
                </Link>
                <Link to="/orders" className="user-dropdown-item">
                  <Package size={16} /> <span>My Orders</span>
                </Link>
                <Link to="/cart" className="user-dropdown-item">
                  <ShoppingCart size={16} /> <span>My Cart</span>
                </Link>
                <div className="dropdown-divider"></div>
                <button onClick={handleLogout} className="user-dropdown-item logout-btn">
                  <LogOut size={16} /> <span>Logout</span>
                </button>
              </div>
            </div>
          ) : (
            /* Login Link */
            <Link to="/login" className="user-icon-link" style={{ display: 'flex', alignItems: 'center', gap: '5px', whiteSpace: 'nowrap' }}>
              <User size={24} color="#e21f26" />
              <span>Login/Profile</span>
            </Link>
          )}
        </div>
      </nav>

      {/* --- MOBILE MENU (Slide-in Drawer) --- */}
      <div className={`mobile-menu-overlay ${isMobileMenuOpen ? 'open' : ''}`} onClick={toggleMenu}></div>

      <nav className={`mobile-menu-drawer ${isMobileMenuOpen ? 'open' : ''}`}>
        <div className="mobile-menu-header">
          <img src="/images/Teer_Brand_Logo_Large.png" alt="Teer Logo" height="40" />
          <button className="close-menu-btn" onClick={toggleMenu}>
            <X size={28} />
          </button>
        </div>

        <div className="mobile-menu-content">
          <Link to="/" onClick={toggleMenu} className="mobile-link">HOME</Link>
          <Link to="/who-we-are" onClick={toggleMenu} className="mobile-link">WHO WE ARE</Link>

          {/* PRODUCTS SECTION (Expanded by default) */}
          <div className="mobile-products-section">
            <span className="mobile-section-title">PRODUCTS</span>
            <div className="mobile-sublinks">
              <Link to="/products?category=kitchen" onClick={toggleMenu}>Kitchen Essentials</Link>
              <Link to="/products?category=spices" onClick={toggleMenu}>Spices</Link>
              <Link to="/products?category=salts" onClick={toggleMenu}>Salts</Link>
              <Link to="/products?category=blended" onClick={toggleMenu}>Blended Masalas</Link>
            </div>
          </div>

          <Link to="/events" onClick={toggleMenu} className="mobile-link">EVENTS & AWARDS</Link>
          <Link to="/media" onClick={toggleMenu} className="mobile-link">MEDIA</Link>
          <Link to="/news" onClick={toggleMenu} className="mobile-link">NEWS</Link>
          <Link to="/contact-us" onClick={toggleMenu} className="mobile-link">CONTACT US</Link>

          <div className="mobile-divider"></div>

          {/* ACTIONS FOR MOBILE */}
          <Link to="/store" onClick={toggleMenu} className="mobile-action-btn">
            <Store size={18} /> ONLINE SHOP
          </Link>

          {user ? (
            <div className="mobile-user-section">
              <div className="mobile-user-info">
                <User size={18} /> Hi, {user.username}
              </div>
              <div className="mobile-sublinks">
                <Link to="/profile" onClick={toggleMenu}>My Profile</Link>
                <Link to="/orders" onClick={toggleMenu}>My Orders</Link>
                <Link to="/cart" onClick={toggleMenu}>My Cart</Link>
                <button onClick={handleLogout} className="mobile-logout">Logout</button>
              </div>
            </div>
          ) : (
            <Link to="/login" onClick={toggleMenu} className="mobile-action-btn secondary">
              <User size={18} /> LOGIN / REGISTER
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;