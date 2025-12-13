import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// --- IMPORT YOUR COMPONENTS HERE ---
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import WhoWeAre from './pages/WhoWeAre';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Cart from './pages/Cart';
import ProductGallery from './pages/ProductGallery';
import { CartProvider } from './context/CartContext';
import OnlineStore from './pages/OnlineStore';
import Checkout from './pages/Checkout';
import MyOrders from './pages/MyOrders';
import ProductDetails from './pages/ProductDetails';
import UserProfile from './pages/UserProfile';
import PublicLayout from './components/PublicLayout'; // Import Layout
// Admin Imports
import AdminLayout from './pages/admin/AdminLayout';
import AdminLogin from './pages/admin/AdminLogin';
import Dashboard from './pages/admin/Dashboard';
import Orders from './pages/admin/Orders';
import Products from './pages/admin/Products';
import NewProduct from './pages/admin/NewProduct';
import EditProduct from './pages/admin/EditProduct';

function App() {
  return (
    <CartProvider>
      <Router>
        <Routes>
          {/* Public Routes Wrapped in PublicLayout */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/who-we-are" element={<WhoWeAre />} />
            <Route path="/products" element={<ProductGallery />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/store" element={<OnlineStore />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path='/orders' element={<MyOrders />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/profile" element={<UserProfile />} />
          </Route>

          {/* Admin Routes - Standalone (No Public Navbar/Footer) */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="orders" element={<Orders />} />
            <Route path="products" element={<Products />} />
            <Route path="new-product" element={<NewProduct />} />
            <Route path="product/:id" element={<EditProduct />} />
          </Route>
        </Routes>
      </Router>
    </CartProvider>
  );
}

export default App;