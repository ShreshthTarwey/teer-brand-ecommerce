import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './admin.css';

const Orders = () => {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const user = JSON.parse(localStorage.getItem('user'));
                const res = await axios.get('http://localhost:5000/api/orders', {
                    headers: { token: `Bearer ${user.accessToken}` }
                });
                setOrders(res.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchOrders();
    }, []);

    const handleStatusChange = async (orderId, newStatus) => {
        // Since backend update endpoint might not be explicitly requested, 
        // I'll assume standard PUT /api/orders/:id exists or handle locally first for UI.
        // But the user prompt said "Actions: A dropdown to update status".
        // I will assume a standard implementation:
        try {
            // NOTE: Requirement said "Actions: A dropdown to update status (Pending -> Shipped -> Delivered)"
            // Assuming endpoint exists or just console logging if not specified in prompt details
            // The prompt said: "Assume the Backend Routes already exist"
            const user = JSON.parse(localStorage.getItem('user'));
            // Typically PUT /api/orders/:id
            // However, seeing order.js in backend analysis, there is NO status update route explicitly shown in previous turn analysis (only GET, GET/:id, POST).
            // But User Rule 4 said: "Assume the Backend Routes ... already exist (I will handle the backend logic separately if needed)".
            // So I will code the request.

            await axios.put(`http://localhost:5000/api/orders/${orderId}`, { status: newStatus }, {
                headers: { token: `Bearer ${user.accessToken}` }
            });
            // Updating local state to reflect change immediately for better UX
            setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status: newStatus } : o));
            // alert(`Order status updated to ${newStatus}`);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div>
            <div className="admin-header">
                <h1>Manage Orders</h1>
            </div>
            <div className="admin-table-container">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Order ID</th>
                            <th>User Info</th>
                            <th>Amount</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order) => (
                            <tr key={order._id}>
                                <td>{order._id}</td>
                                <td>
                                    <div>{order.userId?.username || 'Unknown'}</div>
                                    <div style={{ fontSize: '0.8rem', color: '#666' }}>{order.userId?.email || order.userId}</div>
                                </td>
                                <td>₹{order.amount}</td>
                                <td>
                                    <span className={`status-badge status-${order.status?.toLowerCase() || 'pending'}`}>
                                        {order.status || 'Pending'}
                                    </span>
                                </td>
                                <td>
                                    <select
                                        value={order.status || 'Pending'}
                                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                                        style={{ padding: '5px' }}
                                    >
                                        <option value="Pending">Pending</option>
                                        <option value="Shipped">Shipped</option>
                                        <option value="Delivered">Delivered</option>
                                    </select>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Orders;
