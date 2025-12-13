import React, { useState, useEffect } from 'react';
import { ShoppingBag, Truck, CreditCard, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext'; // <--- USE REAL CONTEXT
import './Checkout.css';
import emailjs from '@emailjs/browser';

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
  const [savedAddresses, setSavedAddresses] = useState([]); // New State

  // Fetch User Addresses
  useEffect(() => {
    const fetchAddresses = async () => {
      const user = JSON.parse(localStorage.getItem("user"));
      if (user) {
        try {
          // We re-fetch user because localStorage might be stale regarding addresses
          const res = await fetch(`http://localhost:5000/api/users/find/${user._id}`, {
            headers: { token: `Bearer ${user.accessToken}` }
          });
          const data = await res.json();
          if (data.addresses) setSavedAddresses(data.addresses);
        } catch (err) {
          console.error("Failed to load addresses", err);
        }
      }
    };
    fetchAddresses();
  }, []);

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

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   if (!validateForm()) return;

  //   // 3. AUTH CHECK
  //   const userDataString = localStorage.getItem('user');
  //   if (!userDataString) {
  //     alert('Please login to continue');
  //     navigate('/login');
  //     return;
  //   }

  //   const userData = JSON.parse(userDataString);
  //   const token = userData.accessToken;
  //   const userId = userData._id;

  //   // 4. PREPARE ORDER PAYLOAD
  //   const orderData = {
  //     userId: userId,
  //     products: cartItems.map(item => ({
  //       productId: item.id, // Ensure this matches your Cart item structure (id vs _id)
  //       quantity: item.quantity
  //     })),
  //     amount: total,
  //     address: {
  //       fullName: formData.fullName,
  //       phone: formData.phone,
  //       address: formData.address,
  //       city: formData.city,
  //       pincode: formData.pincode
  //     }
  //   };

  //   setLoading(true);

  //   try {
  //     // 5. SEND TO BACKEND
  //     const response = await fetch('http://localhost:5000/api/orders', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //         'token': `Bearer ${token}`
  //       },
  //       body: JSON.stringify(orderData)
  //     });

  //     if (!response.ok) throw new Error('Failed to place order');

  //     // 6. SUCCESS
  //     alert('Order Placed Successfully! 🎉');
  //     clearCart(); // Wipe the cart
  //     navigate('/'); // Go Home

  //   } catch (err) {
  //     setError('Failed to place order. Please try again.');
  //     console.error('Order Error:', err);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  //   const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   if (!validateForm()) return;

  //   const userDataString = localStorage.getItem('user');
  //   if (!userDataString) {
  //     alert('Please login to continue');
  //     navigate('/login');
  //     return;
  //   }

  //   const userData = JSON.parse(userDataString);
  //   const token = userData.accessToken;
  //   const userId = userData._id;

  //   const orderData = {
  //     userId: userId,
  //     products: cartItems.map(item => ({
  //       productId: item.id,
  //       quantity: item.quantity
  //     })),
  //     amount: total,
  //     address: {
  //       fullName: formData.fullName,
  //       phone: formData.phone,
  //       address: formData.address,
  //       city: formData.city,
  //       pincode: formData.pincode
  //     }
  //   };

  //   setLoading(true);

  //   try {
  //     // 1. SAVE TO MONGODB (Backend)
  //     const response = await fetch('http://localhost:5000/api/orders', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //         'token': `Bearer ${token}`
  //       },
  //       body: JSON.stringify(orderData)
  //     });

  //     if (!response.ok) throw new Error('Failed to place order');

  //     // 2. SEND EMAIL (Frontend - Bypasses Render Block)
  //     // Prepare the data to match your EmailJS Template variables
  //     const emailParams = {
  //       to_name: formData.fullName,
  //       total_amount: `₹${total}`,
  //       address: `${formData.address}, ${formData.city} - ${formData.pincode}`,
  //       user_email: userData.email // Assuming user object has email
  //     };

  //     await emailjs.send(
  //       "service_w11ztee",      // <--- PASTE YOUR SERVICE ID
  //       "template_w54oyky",     // <--- PASTE YOUR TEMPLATE ID
  //       emailParams,
  //       "d7gZ3l4sWs6vNFFTB"       // <--- PASTE YOUR PUBLIC KEY
  //     );

  //     console.log("Email sent successfully!");

  //     // 3. SUCCESS UI
  //     alert('Order Placed! A confirmation email has been sent.');
  //     clearCart();
  //     navigate('/'); 

  //   } catch (err) {
  //     console.error('Order/Email Error:', err);
  //     // We still alert success if the Order saved but Email failed, to avoid panic
  //     if(err.text) { 
  //         alert("Order placed, but email confirmation failed."); 
  //         clearCart();
  //         navigate('/');
  //     } else {
  //         setError('Failed to place order. Please try again.');
  //     }
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // ... inside Checkout.jsx

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    // 1. Auth Check
    const userDataString = localStorage.getItem('user');
    if (!userDataString) {
      alert('Please login to continue');
      navigate('/login');
      return;
    }

    const userData = JSON.parse(userDataString);
    const token = userData.accessToken;
    const userId = userData._id;

    setLoading(true);

    try {
      // 2. CREATE ORDER ON BACKEND (Get Razorpay Order ID)
      const orderResponse = await fetch('http://localhost:5000/api/payment/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: total })
      });

      const orderData = await orderResponse.json();
      if (!orderData.data) throw new Error("Server error, could not initiate payment.");

      // 3. INITIALIZE RAZORPAY
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID, // Ensure this exists in frontend .env
        amount: orderData.data.amount,
        currency: orderData.data.currency,
        name: "Teer Brand",
        description: "Order Payment",
        order_id: orderData.data.id,
        handler: async function (response) {
          // 4. VERIFY PAYMENT ON BACKEND
          try {
            const verifyRes = await fetch('http://localhost:5000/api/payment/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature
              })
            });

            const verifyData = await verifyRes.json();

            if (verifyRes.ok) {
              // 5. IF VERIFIED, SAVE ORDER TO DATABASE
              await saveOrderToDB(userId, token, response.razorpay_payment_id, userData);
            } else {
              alert("Payment verification failed!");
            }
          } catch (error) {
            console.error("Verification Error", error);
            alert("Payment verification error");
          }
        },
        prefill: {
          name: formData.fullName,
          email: userData.email,
          contact: formData.phone
        },
        theme: {
          color: "#000000"
        }
      };

      if (!window.Razorpay) {
        alert("Razorpay SDK not loaded. Check internet connection.");
        return;
      }

      const rzp1 = new window.Razorpay(options);
      rzp1.open();

    } catch (err) {
      console.error('Payment Init Error:', err);
      setError('Payment initialization failed.');
    } finally {
      setLoading(false);
    }
  };

  // Helper to Save Order after payment
  const saveOrderToDB = async (userId, token, paymentId, userData) => {
    try {
      const orderPayload = {
        userId: userId,
        products: cartItems.map(item => ({
          productId: item.id,
          quantity: item.quantity
        })),
        amount: total,
        address: {
          fullName: formData.fullName,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          pincode: formData.pincode
        },
        paymentStatus: "Completed",
        paymentId: paymentId
      };

      const response = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'token': `Bearer ${token}`
        },
        body: JSON.stringify(orderPayload)
      });

      if (!response.ok) throw new Error('Failed to save order');

      // Send Email (Fire and forget)
      sendConfirmationEmail(userData); // Helper function recommended

      alert('Payment Successful! Order Placed.');
      clearCart();
      navigate('/');

    } catch (err) {
      console.error("Save Order Error", err);
      alert("Payment successful but failed to save order. Contact support with ID: " + paymentId);
    }
  };

  const sendConfirmationEmail = async (userData) => {
    // Re-using existing email logic, simplified for brevity here
    // const userData = JSON.parse(userString); // Removed parsing, passed object directly
    const productListHTML = cartItems.map(item =>
      `<div style="border-bottom: 1px solid #eee; padding: 5px 0;">
           <strong>${item.name}</strong> <br/>
           Qty: ${item.quantity} x ₹${item.price}
         </div>`
    ).join('');

    const emailParams = {
      to_name: formData.fullName,
      user_email: userData.email,
      order_amount: `₹${total}`,
      shipping_address: `${formData.address}, ${formData.city} - ${formData.pincode}`,
      order_list: productListHTML
    };

    emailjs.send(
      import.meta.env.VITE_EMAILJS_SERVICE_ID,
      import.meta.env.VITE_EMAILJS_TEMPLATE_ID_ORDER,
      emailParams,
      import.meta.env.VITE_EMAILJS_PUBLIC_KEY
    )
      .then(() => console.log("Email sent"))
      .catch((e) => console.error("Email failed", e));
  };

  if (cartItems.length === 0) {
    return (
      <div className="checkout-page" style={{ textAlign: 'center', marginTop: '50px' }}>
        <h2>Your Cart is Empty</h2>
        <button onClick={() => navigate('/store')} className="submit-button" style={{ maxWidth: '200px' }}>Go to Store</button>
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

              {/* Saved Addresses Selector */}
              <div className="saved-addresses-selector" style={{ marginBottom: '20px' }}>
                <label className="form-label" style={{ display: 'block', marginBottom: '10px' }}>Load Saved Address:</label>
                <select
                  className="form-input"
                  onChange={(e) => {
                    const addr = JSON.parse(e.target.value);
                    setFormData({
                      ...formData,
                      address: addr.street,
                      city: addr.city,
                      pincode: addr.pin,
                      // state: addr.state // If you had a state field
                    });
                  }}
                  defaultValue=""
                >
                  <option value="" disabled>Select a saved address...</option>
                  {savedAddresses.map((addr, idx) => (
                    <option key={idx} value={JSON.stringify(addr)}>
                      {addr.street}, {addr.city} ({addr.pin})
                    </option>
                  ))}
                </select>
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
                <p className="payment-method"><strong>Payment Method:</strong> Razorpay Secure Payment</p>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Checkout;