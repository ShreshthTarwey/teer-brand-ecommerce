import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './admin.css';

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:5000/api/auth/login', {
                email,
                password
            });

            if (res.data.isAdmin) {
                // Save complete user object as frontend expects 'user' key typically
                localStorage.setItem('user', JSON.stringify(res.data));
                navigate('/admin/dashboard');
            } else {
                alert("Access Denied: You are not an admin.");
            }
        } catch (err) {
            console.error(err);
            alert("Login Failed: Checking credentials or server.");
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f5f5f5' }}>
            <div className="admin-form">
                <h2 style={{ textAlign: 'center', fontFamily: 'Merriweather', marginBottom: '20px' }}>Admin Portal</h2>
                <form onSubmit={handleLogin}>
                    <div className="form-group">
                        <label>Email</label>
                        <input type="email" placeholder="admin@teer.com" onChange={(e) => setEmail(e.target.value)} required />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input type="password" placeholder="******" onChange={(e) => setPassword(e.target.value)} required />
                    </div>
                    <button className="admin-btn" style={{ width: '100%' }} type="submit">Login to Dashboard</button>
                </form>
            </div>
        </div>
    );
};

export default AdminLogin;
