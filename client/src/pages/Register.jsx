import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import emailjs from '@emailjs/browser';
// import './Auth.css'; 

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState(""); // User input OTP
  const [generatedOtp, setGeneratedOtp] = useState(null); // System generated OTP
  const [otpExpiry, setOtpExpiry] = useState(null); // Expiration timestamp
  const [otpSent, setOtpSent] = useState(false); // UI State switch
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState(false);
  const navigate = useNavigate();

  // 1. Generate and Send OTP
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError(false);

    if (!username || !email || !password) {
      toast.error("Please fill all fields first.");
      return;
    }

    setLoading(true);

    try {
      // Generate 6 digit random number
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      setGeneratedOtp(code);

      // Set Expiration (15 minutes from now)
      setOtpExpiry(Date.now() + 15 * 60 * 1000);

      // Email Template Params (matching user provided template)
      const templateParams = {
        to_email: email,       // Depending on template, might need 'to_email' or 'email' or 'user_email' 
        to_name: username,     // Often used in templates
        passcode: code,        // The key variable
        time: "15 minutes"     // The time variable
      };

      // Send Email using Account 2 Credentials
      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID2,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID2,
        templateParams,
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY2
      );

      setOtpSent(true);
      toast.success(`OTP sent to ${email}`);
      setLoading(false);

    } catch (err) {
      console.error("OTP Error:", err);
      toast.error("Failed to send OTP. Check email or try again.");
      setLoading(false);
    }
  };

  // 2. Verify OTP and Register
  const handleVerifyAndRegister = async (e) => {
    e.preventDefault();

    // Check Expiration
    if (Date.now() > otpExpiry) {
      toast.error("OTP has expired. Please refresh and try again.");
      return;
    }

    if (otp !== generatedOtp) {
      toast.error("Invalid OTP. Please try again.");
      return;
    }

    setLoading(true);

    try {
      // Call Backend Registration
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/auth/register`, {
        username,
        email,
        password,
      });

      toast.success("Registration Successful! Please Login.");
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration Failed.");
      console.error(err);
      setError(true);
      setLoading(false);
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

          <form onSubmit={otpSent ? handleVerifyAndRegister : handleSendOtp}>

            {/* Fields are read-only after OTP is sent to prevent changing email mid-process */}
            <div className="input-group">
              <label>Full Name</label>
              <input
                type="text"
                placeholder="Shreshth Tarwey"
                required
                disabled={otpSent}
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
                disabled={otpSent}
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
                disabled={otpSent}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {/* OTP INPUT (Visible only after sending) */}
            {otpSent && (
              <div className="input-group" style={{ animation: "fadeIn 0.5s" }}>
                <label style={{ color: '#e21f26', fontWeight: 'bold' }}>Enter OTP</label>
                <input
                  type="text"
                  placeholder="Enter 6-digit code"
                  required
                  maxLength="6"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  style={{ letterSpacing: '2px', fontSize: '1.2rem', textAlign: 'center' }}
                />
              </div>
            )}

            <button type="submit" className="auth-btn" disabled={loading}>
              {loading
                ? "Processing..."
                : otpSent
                  ? "VERIFY & REGISTER"
                  : "SEND OTP"}
            </button>

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