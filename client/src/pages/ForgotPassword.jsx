import React, { useState } from 'react';
import axios from 'axios';
import emailjs from '@emailjs/browser';
import { Mail, CheckCircle, AlertCircle } from 'lucide-react';
import './AuthStyles.css'; // Re-use auth styles

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState("idle"); // idle, loading, success, error
    const [message, setMessage] = useState("");

    const handleResetRequest = async (e) => {
        e.preventDefault();
        setStatus("loading");
        setMessage("");

        try {
            // 1. Request Token from Backend
            const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/auth/forgot-password-init`, { email });

            const { token, username } = res.data;

            // 2. Send Email via EmailJS
            const resetLink = `http://localhost:5173/reset-password/${token}`;

            const templateParams = {
                to_name: username,
                reset_link: resetLink,
                user_email: email // Match Checkout.jsx convention
            };

            await emailjs.send(
                import.meta.env.VITE_EMAILJS_SERVICE_ID,
                import.meta.env.VITE_EMAILJS_TEMPLATE_ID_RESET,
                templateParams,
                import.meta.env.VITE_EMAILJS_PUBLIC_KEY
            );

            setStatus("success");
            setMessage("Password reset link sent to your email!");

        } catch (err) {
            console.error(err);
            setStatus("error");
            setMessage(err.response?.data || "Something went wrong. Please check the email.");
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2>Forgot Password?</h2>
                <p style={{ marginBottom: '20px', color: '#666', textAlign: 'center' }}>
                    Enter your email to receive a reset link.
                </p>

                {status === "success" ? (
                    <div className="success-message" style={{ textAlign: 'center' }}>
                        <CheckCircle size={48} color="green" style={{ margin: '0 auto 10px' }} />
                        <p>{message}</p>
                    </div>
                ) : (
                    <form onSubmit={handleResetRequest}>
                        <div className="form-group">
                            <label>Email Address</label>
                            <input
                                type="email"
                                placeholder="Enter your registered email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        {status === "error" && (
                            <div className="error-alert">
                                <AlertCircle size={16} /> {message}
                            </div>
                        )}

                        <button className="auth-btn" disabled={status === "loading"}>
                            {status === "loading" ? "Sending..." : "Send Reset Link"}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default ForgotPassword;
