import React, { useEffect, useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, LogOut, LayoutDashboard, ShoppingCart, Package, PlusCircle } from 'lucide-react';
import './admin.css';

const AdminLayout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem('user'));
        if (!userData || !userData.isAdmin) {
            navigate('/admin/login');
        } else {
            setUser(userData);
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/admin/login');
    };

    return (
        <div className="admin-container">
            {/* Sidebar */}
            <div className={`admin-sidebar ${isSidebarOpen ? 'open' : 'closed'}`}>
                <div className="sidebar-header">
                    <h2>Teer Admin</h2>
                    <button className="mobile-close-btn" onClick={() => setIsSidebarOpen(false)}>
                        <X size={24} />
                    </button>
                </div>

                <nav className="admin-nav">
                    <Link to="/admin/dashboard" className={`admin-link ${location.pathname === '/admin/dashboard' ? 'active' : ''}`}>
                        <LayoutDashboard size={20} />
                        <span>Dashboard</span>
                    </Link>
                    <Link to="/admin/orders" className={`admin-link ${location.pathname === '/admin/orders' ? 'active' : ''}`}>
                        <ShoppingCart size={20} />
                        <span>Orders</span>
                    </Link>
                    <Link to="/admin/products" className={`admin-link ${location.pathname === '/admin/products' ? 'active' : ''}`}>
                        <Package size={20} />
                        <span>Products</span>
                    </Link>
                    <Link to="/admin/new-product" className={`admin-link ${location.pathname === '/admin/new-product' ? 'active' : ''}`}>
                        <PlusCircle size={20} />
                        <span>Add Product</span>
                    </Link>
                </nav>
            </div>

            {/* Main Content Wrapper */}
            <div className={`admin-main ${isSidebarOpen ? 'expanded' : 'collapsed'}`}>
                {/* Top Navbar */}
                <div className="admin-topbar">
                    <button className="toggle-btn" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                        <Menu size={24} />
                    </button>
                    <div className="admin-profile">
                        <span className="admin-name">Hi, {user?.username}</span>
                        <button className="admin-logout-btn" onClick={handleLogout} title="Logout">
                            <LogOut size={20} />
                        </button>
                    </div>
                </div>

                {/* Content Area */}
                <div className="admin-content">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default AdminLayout;
