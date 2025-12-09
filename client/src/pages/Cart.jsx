import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowLeft } from 'lucide-react';
import { useCart } from '../context/CartContext'; // <--- 1. CONNECT TO BRAIN

const Cart = () => {
  const navigate = useNavigate();
  
  // 2. GET REAL DATA INSTEAD OF FAKE STATE
  const { cartItems, removeFromCart, updateQuantity, getCartTotal } = useCart();

  // Calculate Shipping & Total dynamically
  const subtotal = getCartTotal();
  const shipping = subtotal > 500 ? 0 : 50; // Free shipping over 500 (Optional logic)
  const total = subtotal + shipping;

  const handleCheckout = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      alert("Please Login to Checkout!");
      navigate("/login");
    } else {
      navigate("/checkout");
      // Later we will redirect to /checkout here
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="empty-cart">
        <img src="/images/Teer_Brand_Main_Logo.png" alt="Empty Cart" style={{height: '100px', opacity: 0.5}} />
        <h2>Your Cart is Empty</h2>
        <p>Looks like you haven't added any spices yet.</p>
        <Link to="/store" className="continue-btn">Start Shopping</Link>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <h1>Your Shopping Cart ({cartItems.length} items)</h1>
      
      <div className="cart-container">
        {/* LEFT: Cart Items */}
        <div className="cart-items">
          {cartItems.map((item) => (
            <div key={item.id} className="cart-item">
              <img 
                src={item.img} 
                alt={item.name} 
                onError={(e) => {
                  e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="80" height="80"%3E%3Crect fill="%23f0f0f0" width="80" height="80"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%23999" font-family="Arial" font-size="12"%3ENo Image%3C/text%3E%3C/svg%3E';
                }}
              />
              
              <div className="item-details">
                <h3>{item.name}</h3>
                <p className="item-category" style={{fontSize: '12px', color: '#999'}}>{item.category}</p>
                <p className="item-price">₹{item.price}</p>
              </div>

              <div className="quantity-controls">
                <button onClick={() => updateQuantity(item.id, "decrease")}><Minus size={16} /></button>
                <span>{item.quantity}</span>
                <button onClick={() => updateQuantity(item.id, "increase")}><Plus size={16} /></button>
              </div>

              <div className="item-total">
                ₹{item.price * item.quantity}
              </div>

              <button className="remove-btn" onClick={() => removeFromCart(item.id)}>
                <Trash2 size={20} />
              </button>
            </div>
          ))}
          
          <Link to="/store" className="back-link">
            <ArrowLeft size={16} /> Continue Shopping
          </Link>
        </div>

        {/* RIGHT: Order Summary */}
        <div className="order-summary">
          <h2>Order Summary</h2>
          <div className="summary-row">
            <span>Subtotal</span>
            <span>₹{subtotal}</span>
          </div>
          <div className="summary-row">
            <span>Shipping</span>
            <span>{shipping === 0 ? <span style={{color: 'green'}}>Free</span> : `₹${shipping}`}</span>
          </div>
          <div className="divider"></div>
          <div className="summary-row total">
            <span>Total</span>
            <span>₹{total}</span>
          </div>

          <button className="checkout-btn" onClick={handleCheckout}>
            PROCEED TO CHECKOUT
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;