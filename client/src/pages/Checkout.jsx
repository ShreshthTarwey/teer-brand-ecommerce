import React, { useState, useEffect } from 'react';
import { ShoppingBag, Truck, CreditCard, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext'; // <--- USE REAL CONTEXT
import './Checkout.css'; // <--- FIXED IMPORT

const Checkout = () => {
  // 1. Get Real Data from Context
  const { cartItems, getCartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    address: '',
    city: '',
    pincode: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const SHIPPING_COST = 50;
  const subtotal = getCartTotal();
  const total = subtotal + SHIPPING_COST;
  
  // 2. Redirect if Cart is Empty
  useEffect(() => {
    if (cartItems.length === 0) {
      // Optional: Redirect to store if empty
      // navigate('/store'); 
    }
  }, [cartItems, navigate]);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };
  
  const validateForm = () => {
    if (!formData.fullName.trim()) return setError('Please enter your full name');
    if (!formData.phone.trim() || formData.phone.length < 10) return setError('Please enter a valid 10-digit phone number');
    if (!formData.address.trim()) return setError('Please enter your delivery address');
    if (!formData.city.trim()) return setError('Please enter your city');
    if (!formData.pincode.trim() || formData.pincode.length !== 6) return setError('Please enter a valid 6-digit pincode');
    return true;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    // 3. AUTH CHECK
    const userDataString = localStorage.getItem('user');
    if (!userDataString) {
      alert('Please login to continue');
      navigate('/login');
      return;
    }
    
    const userData = JSON.parse(userDataString);
    const token = userData.accessToken;
    const userId = userData._id;
    
    // 4. PREPARE ORDER PAYLOAD
    const orderData = {
      userId: userId,
      products: cartItems.map(item => ({
        productId: item.id, // Ensure this matches your Cart item structure (id vs _id)
        quantity: item.quantity
      })),
      amount: total,
      address: {
        fullName: formData.fullName,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        pincode: formData.pincode
      }
    };
    
    setLoading(true);
    
    try {
      // 5. SEND TO BACKEND
      const response = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'token': `Bearer ${token}`
        },
        body: JSON.stringify(orderData)
      });
      
      if (!response.ok) throw new Error('Failed to place order');
      
      // 6. SUCCESS
      alert('Order Placed Successfully! 🎉');
      clearCart(); // Wipe the cart
      navigate('/'); // Go Home
      
    } catch (err) {
      setError('Failed to place order. Please try again.');
      console.error('Order Error:', err);
    } finally {
      setLoading(false);
    }
  };
  
  if (cartItems.length === 0) {
    return (
        <div className="checkout-page" style={{textAlign:'center', marginTop:'50px'}}>
            <h2>Your Cart is Empty</h2>
            <button onClick={() => navigate('/store')} className="submit-button" style={{maxWidth:'200px'}}>Go to Store</button>
        </div>
    )
  }

  return (
    <div className="checkout-page">
      <div className="checkout-container">
        
        <div className="checkout-header">
          <h1 className="checkout-title">
            <CreditCard size={32} /> Checkout
          </h1>
          <p className="checkout-subtitle">Complete your order</p>
        </div>
        
        {error && (
          <div className="error-alert">
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        )}
        
        <div className="checkout-grid">
          
          {/* Left Column - Form */}
          <div className="checkout-left">
            <div className="section-card">
              <div className="section-header">
                <Truck size={24} />
                <h2 className="section-title">Shipping Details</h2>
              </div>
              
              <div className="checkout-form">
                <div className="form-group">
                  <label className="form-label">Full Name *</label>
                  <input name="fullName" value={formData.fullName} onChange={handleInputChange} className="form-input" placeholder="Enter your full name" />
                </div>
                
                <div className="form-group">
                  <label className="form-label">Phone Number *</label>
                  <input name="phone" value={formData.phone} onChange={handleInputChange} className="form-input" placeholder="10-digit mobile number" maxLength="10" />
                </div>
                
                <div className="form-group">
                  <label className="form-label">Delivery Address *</label>
                  <textarea name="address" value={formData.address} onChange={handleInputChange} className="form-textarea" placeholder="House No., Street" rows="3" />
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">City *</label>
                    <input name="city" value={formData.city} onChange={handleInputChange} className="form-input" placeholder="City" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Pincode *</label>
                    <input name="pincode" value={formData.pincode} onChange={handleInputChange} className="form-input" placeholder="Pincode" maxLength="6" />
                  </div>
                </div>
                
                <button onClick={handleSubmit} className="submit-button" disabled={loading}>
                  {loading ? 'Processing...' : 'PLACE ORDER'}
                </button>
              </div>
            </div>
          </div>
          
          {/* Right Column - Summary */}
          <div className="checkout-right">
            <div className="section-card">
              <div className="section-header">
                <ShoppingBag size={24} />
                <h2 className="section-title">Order Summary</h2>
              </div>
              
              <div className="order-items">
                {cartItems.map(item => (
                  <div key={item.id} className="order-item">
                    <img src={item.img} alt={item.name} className="item-image" />
                    <div className="item-details">
                      <h3 className="item-name">{item.name}</h3>
                      <p className="item-quantity">Qty: {item.quantity}</p>
                    </div>
                    <div className="item-price">₹{item.price * item.quantity}</div>
                  </div>
                ))}
              </div>
              
              <div className="price-breakdown">
                <div className="price-row">
                  <span className="price-label">Subtotal</span>
                  <span className="price-value">₹{subtotal}</span>
                </div>
                <div className="price-row">
                  <span className="price-label">Shipping</span>
                  <span className="price-value">₹{SHIPPING_COST}</span>
                </div>
                <div className="price-divider"></div>
                <div className="price-row total-row">
                  <span className="price-label">Total</span>
                  <span className="price-value total-value">₹{total}</span>
                </div>
              </div>

              <div className="payment-info">
                  <p className="payment-method"><strong>Payment Method:</strong> Cash on Delivery</p>
              </div>
              
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default Checkout;