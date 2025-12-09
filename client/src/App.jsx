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

function App() {
  return (
    <CartProvider>
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/who-we-are" element={<WhoWeAre />} />
        <Route path="/products" element={<ProductGallery />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/store" element={<OnlineStore />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path='/orders' element={<MyOrders />} />
        {/* Placeholders for future pages */}
        {/* <Route path="/products" element={<h1>Products Page Coming Soon</h1>} /> */}
        {/* <Route path="/login" element={<h1>Login Page Coming Soon</h1>} /> */}
      </Routes>
      <Footer />
    </Router>
    </CartProvider>
  );
}

export default App;