import React, { useEffect, useState } from 'react';
import { Package, Truck, Clock, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './MyOrders.css'; // We will create this next

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // HANDLER FOR CANCELLATION
  const handleCancelOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;

    try {
      const user = JSON.parse(localStorage.getItem("user"));
      await axios.put(`${import.meta.env.VITE_API_BASE_URL}/api/orders/${orderId}/cancel`, {}, {
        headers: { token: `Bearer ${user.accessToken}` }
      });

      alert("Order Cancelled Successfully");
      // Refresh Orders locally
      setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status: 'cancelled' } : o));

    } catch (err) {
      console.error("Cancellation Failed", err);
      const errMsg = err.response?.data?.message || err.response?.data || "Failed to cancel order";
      alert(typeof errMsg === 'object' ? JSON.stringify(errMsg) : errMsg);
    }
  };

  useEffect(() => {
    const fetchOrders = async () => {
      // 1. Get User Data
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user) {
        navigate("/login");
        return;
      }

      try {
        // 2. Fetch Orders from Backend
        const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/orders/find/${user._id}`, {
          headers: { token: `Bearer ${user.accessToken}` }
        });

        // 3. Sort by Newest First
        const sortedOrders = res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setOrders(sortedOrders);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching orders:", err);
        setLoading(false);
      }
    };
    fetchOrders();
  }, [navigate]);

  if (loading) return <div className="orders-loading">Loading your orders...</div>;

  return (
    <div className="orders-page">
      <div className="orders-container">
        <h1 className="orders-title">My Orders</h1>

        {orders.length === 0 ? (
          <div className="no-orders">
            <Package size={48} color="#ccc" />
            <p>You haven't placed any orders yet.</p>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map((order) => (
              <div key={order._id} className="order-card">

                {/* Header: Order ID & Status */}
                <div className="order-header">
                  <div>
                    <span className="order-id">ORDER #{order._id.slice(-6).toUpperCase()}</span>
                    <span className="order-date">{new Date(order.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="order-status-wrapper" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span className={`order-status status-${order.status}`}>
                      {order.status === 'pending' && <Clock size={14} />}
                      {order.status === 'delivered' && <Truck size={14} />}
                      {order.status === 'cancelled' && <AlertCircle size={14} />}
                      {order.status.toUpperCase()}
                    </span>
                    {order.status === 'pending' && (
                      <button
                        className="cancel-order-btn"
                        onClick={() => handleCancelOrder(order._id)}
                        style={{
                          padding: '5px 10px',
                          fontSize: '0.8rem',
                          color: '#c62828',
                          border: '1px solid #c62828',
                          borderRadius: '4px',
                          background: 'transparent',
                          cursor: 'pointer',
                          fontWeight: '600'
                        }}
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>

                {/* Items List */}
                <div className="order-body">
                  {/* Note: In a real app, we would populate product details (img/name) 
                      via MongoDB. For now, since we only saved IDs in the Order model, 
                      we just show the count. 
                      *Future Upgrade:* Update Order Model to store product Name/Img snapshot.
                   */}
                  <div className="order-products-list">
                    {order.products.map((item, index) => (
                      <div key={index} className="order-product-item">
                        {item.productId ? (
                          <>
                            <img src={item.productId.img} alt={item.productId.name} className="order-product-img" />
                            <div className="order-product-info">
                              <span className="order-product-name">{item.productId.name}</span>
                              <span className="order-product-qty">Qty: {item.quantity}</span>
                            </div>
                            <span className="order-product-price">₹{item.productId.price * item.quantity}</span>
                          </>
                        ) : (
                          <span className="product-deleted-msg">Product Unavailable</span>
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="order-total-row">
                    <span>Total Amount:</span>
                    <span className="total-amount-value">₹{order.amount}</span>
                  </div>
                </div>

                {/* Footer: Address Snapshot */}
                <div className="order-footer">
                  <p>Delivering to: <strong>{order.address.city}, {order.address.pincode}</strong></p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;