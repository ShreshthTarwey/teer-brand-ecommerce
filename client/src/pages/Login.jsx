import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AuthStyles.css'; // Use the new shared styles

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(false);

    try {
      const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/auth/login`, {
        email: email,
        password: password,
      });

      // SAVE USER & TOKEN
      localStorage.setItem("user", JSON.stringify(res.data));

      // REDIRECT & FORCE RELOAD (To update Navbar state instantly)
      setLoading(false);
      window.location.replace("/");

    } catch (err) {
      setLoading(false);
      setError(true);
      console.error("Login Failed:", err);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-wrapper">
        <div className="auth-box">
          <div className="auth-header">
            <img src="/images/Teer_Brand_Main_Logo.png" alt="Teer Logo" className="auth-logo" />
            <h2>Welcome Back</h2>
            <p>Login to access your cart & orders</p>
          </div>

          <form onSubmit={handleLogin}>
            <div className="input-group">
              <label>Email Address</label>
              <input
                type="email"
                placeholder="Enter your email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="input-group">
              <label>Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button type="submit" className="auth-btn" disabled={loading}>
              {loading ? "LOGGING IN..." : "LOGIN"}
            </button>

            {error && <span style={{ color: 'red', marginTop: '10px', display: 'block', textAlign: 'center' }}>Wrong credentials! Please try again.</span>}

            <div style={{ marginTop: '15px', textAlign: 'center' }}>
              <Link to="/forgot-password" style={{ color: '#e21f26', textDecoration: 'none', fontSize: '0.9rem' }}>
                Forgot Password?
              </Link>
            </div>
          </form>

          <div className="auth-footer">
            <Link to="/register">New to Teer Brand? <span>Create Account</span></Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;