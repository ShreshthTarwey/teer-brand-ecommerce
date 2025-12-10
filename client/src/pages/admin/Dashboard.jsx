import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './admin.css';

const Dashboard = () => {
    const [stats, setStats] = useState({
        sales: 0,
        orders: 0,
        products: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const user = JSON.parse(localStorage.getItem('user'));
                const headers = { token: `Bearer ${user.accessToken}` };

                const [ordersRes, productsRes] = await Promise.all([
                    axios.get('http://localhost:5000/api/orders', { headers }),
                    axios.get('http://localhost:5000/api/products')
                ]);

                const totalSales = ordersRes.data.reduce((acc, order) => acc + order.amount, 0);

                setStats({
                    sales: totalSales,
                    orders: ordersRes.data.length,
                    products: productsRes.data.length
                });
                setLoading(false);
            } catch (err) {
                console.error("Error fetching stats:", err);
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) return <div className="admin-content">Loading stats...</div>;

    return (
        <div>
            <div className="admin-header">
                <h1>Overview</h1>
            </div>

            <div className="dashboard-widgets">
                <div className="widget-card">
                    <h3>Total Sales</h3>
                    <p>₹{stats.sales.toLocaleString()}</p>
                </div>
                <div className="widget-card">
                    <h3>Total Orders</h3>
                    <p>{stats.orders}</p>
                </div>
                <div className="widget-card">
                    <h3>Total Products</h3>
                    <p>{stats.products}</p>
                </div>
            </div>

            <div className="admin-table-container">
                <h3>Quick Actions</h3>
                <p>Use the sidebar to manage specific sections.</p>
            </div>
        </div>
    );
};

export default Dashboard;
