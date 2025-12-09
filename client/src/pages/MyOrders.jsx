import React, { useEffect, useState } from 'react';
import { Package, Truck, Clock, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './MyOrders.css'; // We will create this next

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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
        const res = await axios.get(`http://localhost:5000/api/orders/find/${user._id}`, {
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
                  <span className={`order-status status-${order.status}`}>
                    {order.status === 'pending' && <Clock size={14} />}
                    {order.status === 'delivered' && <Truck size={14} />}
                    {order.status.toUpperCase()}
                  </span>
                </div>

                {/* Items List */}
                <div className="order-body">
                   {/* Note: In a real app, we would populate product details (img/name) 
                      via MongoDB. For now, since we only saved IDs in the Order model, 
                      we just show the count. 
                      *Future Upgrade:* Update Order Model to store product Name/Img snapshot.
                   */}
                   <p className="order-summary-text">
                     {order.products.length} {order.products.length === 1 ? 'Item' : 'Items'}
                   </p>
                   <div className="order-total">
                     Total Amount: <span>₹{order.amount}</span>
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