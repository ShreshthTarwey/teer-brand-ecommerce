import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    BarChart, Bar
} from 'recharts';
import { Download } from 'lucide-react';
import './admin.css';

const Dashboard = () => {
    const [stats, setStats] = useState({
        totalSales: 0,
        totalOrders: 0,
        totalProducts: 0,
        salesStats: [],
        topProducts: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const user = JSON.parse(localStorage.getItem('user'));
                const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/stats`, {
                    headers: { token: `Bearer ${user.accessToken}` }
                });
                setStats(res.data);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching stats:", err);
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const downloadReport = () => {
        const csvContent = [];

        // Header
        csvContent.push("Sales Trends (Last 7 Days)");
        csvContent.push("Date,Sales (INR)");
        stats.salesStats.forEach(item => {
            csvContent.push(`${item._id},${item.sales}`);
        });

        csvContent.push(""); // Empty line

        csvContent.push("Top Selling Products");
        csvContent.push("Product Name,Total Sold");
        stats.topProducts.forEach(item => {
            csvContent.push(`${item.name},${item.totalSold}`);
        });

        // Key Metrics
        csvContent.push("");
        csvContent.push("Key Metrics");
        csvContent.push(`Total Revenue,${stats.totalRevenue}`);
        csvContent.push(`Total Orders,${stats.totalOrders}`);
        csvContent.push(`Total Products,${stats.totalProducts}`);

        const csvString = "data:text/csv;charset=utf-8," + csvContent.join("\n");
        const encodedUri = encodeURI(csvString);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `analytics_report_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    if (loading) return <div className="admin-content">Loading analytics...</div>;

    return (
        <div>
            <div className="admin-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1>Dashboard Overview</h1>
                <button onClick={downloadReport} className="admin-btn" style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <Download size={18} /> Download Report
                </button>
            </div>

            {/* 1. KEY METRICS WIDGETS */}
            <div className="dashboard-widgets">
                <div className="widget-card">
                    <h3>Total Revenue</h3>
                    <p className="widget-value">₹{stats.totalRevenue?.toLocaleString()}</p>
                </div>
                <div className="widget-card">
                    <h3>Total Orders</h3>
                    <p className="widget-value">{stats.totalOrders}</p>
                </div>
                <div className="widget-card">
                    <h3>Total Products</h3>
                    <p className="widget-value">{stats.totalProducts}</p>
                </div>
            </div>

            {/* 2. CHARTS SECTION */}
            <div className="charts-container">

                {/* SALES TREND LINE CHART */}
                <div className="chart-card">
                    <h3>Sales Trend (Last 7 Days)</h3>
                    <div style={{ width: '100%', height: 300 }}>
                        <ResponsiveContainer>
                            <LineChart data={stats.salesStats}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="_id" stroke="#5550bd" />
                                <YAxis />
                                <Tooltip />
                                <Line type="monotone" dataKey="sales" stroke="#e21f26" strokeWidth={2} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* TOP PRODUCTS BAR CHART */}
                <div className="chart-card">
                    <h3>Top Selling Products</h3>
                    <div style={{ width: '100%', height: 300 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={stats.topProducts}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" stroke="#5550bd" />
                                <YAxis allowDecimals={false} />
                                <Tooltip cursor={{ fill: 'rgba(0,0,0,0.05)' }} />
                                <Bar dataKey="totalSold" fill="#82ca9d" barSize={30} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Dashboard;
