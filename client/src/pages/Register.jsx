import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
// import './Auth.css'; // Make sure this is uncommented if you need it

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false); // Added Error State
  const navigate = useNavigate(); // Added Navigation Hook

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(false);

    try {
      // 1. Send data to Backend
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/auth/register`, {
        username,
        email,
        password,
      });
      toast.success("Registration Successful! Please Login.");
      navigate('/login');
    } catch (err) {
      toast.error("Registration Failed. Try again.");
      console.error(err);
      setError(true); // Show error message
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-wrapper">
        <div className="auth-box">
          <div className="auth-header">
            <img src="/images/Teer_Brand_Main_Logo.png" alt="Teer Logo" className="auth-logo" />
            <h2>Create Account</h2>
            <p>Join the Teer Brand family</p>
          </div>

          <form onSubmit={handleRegister}>
            <div className="input-group">
              <label>Full Name</label>
              <input
                type="text"
                placeholder="Shreshth Tarwey"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div className="input-group">
              <label>Email Address</label>
              <input
                type="email"
                placeholder="example@gmail.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="input-group">
              <label>Password</label>
              <input
                type="password"
                placeholder="Create a strong password"
                required
                minLength="6"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button type="submit" className="auth-btn">REGISTER</button>

            {error && <span style={{ color: 'red', marginTop: '10px', display: 'block', textAlign: 'center' }}>Something went wrong! (Email might be taken)</span>}
          </form>

          <div className="auth-footer">
            <Link to="/login">Already have an account? <span>Login</span></Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;