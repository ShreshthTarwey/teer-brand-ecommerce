import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Store, User, Menu, X, LogOut, ShoppingCart, Package, ChevronDown } from 'lucide-react';
import { useCart} from '../context/CartContext';
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
    clearCart();
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

      <nav className={`main-nav ${isMobileMenuOpen ? 'active' : ''}`}>
        <button className="close-menu-btn mobile-only-close" onClick={toggleMenu}>
            <X size={24} />
        </button>
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
          <li><Link to="/contact">CONTACT US</Link></li>
        </ul>

        {/* --- FIXED ACTIONS SECTION --- */}
        <div className="nav-actions">
          
          {/* 1. ONLINE SHOP BUTTON */}
          <Link to="/store" className="goldiee-queen" style={{display: 'flex', alignItems: 'center', gap: '8px', whiteSpace: 'nowrap'}}>
            <Store size={16} />
            <span>ONLINE SHOP</span> {/* Changed text to span */}
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
            <Link to="/login" className="user-icon-link" style={{display: 'flex', alignItems: 'center', gap: '5px', whiteSpace: 'nowrap'}}>
              <User size={24} color="#e21f26" /> 
              <span>Login/Profile</span> {/* Changed p to span */}
            </Link>
          )}
          
        </div>
      </nav>
    </header>
  );
};

export default Navbar;