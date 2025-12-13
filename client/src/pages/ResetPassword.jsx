import React, { useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Lock, CheckCircle, AlertCircle } from 'lucide-react';
import './AuthStyles.css';

const ResetPassword = () => {
    const { token } = useParams();
    const navigate = useNavigate();

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [status, setStatus] = useState("idle");
    const [message, setMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setStatus("error");
            setMessage("Passwords do not match!");
            return;
        }

        setStatus("loading");

        try {
            await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/auth/reset-password-finish`, {
                token,
                newPassword: password
            });

            setStatus("success");
            setMessage("Password reset successful! Redirecting to login...");

            setTimeout(() => {
                navigate("/login");
            }, 3000);

        } catch (err) {
            console.error(err);
            setStatus("error");
            setMessage(err.response?.data || "Link expired or invalid.");
        }
    };

    if (status === "success") {
        return (
            <div className="auth-container">
                <div className="auth-card" style={{ textAlign: 'center' }}>
                    <CheckCircle size={48} color="green" style={{ margin: '0 auto 20px' }} />
                    <h3>Password Reset!</h3>
                    <p>You can now log in with your new password.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2>Set New Password</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>New Password</label>
                        <input
                            type="password"
                            placeholder="********"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Confirm Password</label>
                        <input
                            type="password"
                            placeholder="********"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>

                    {status === "error" && (
                        <div className="error-alert">
                            <AlertCircle size={16} /> {message}
                        </div>
                    )}

                    <button className="auth-btn" disabled={status === "loading"}>
                        {status === "loading" ? "Updating..." : "Update Password"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ResetPassword;
