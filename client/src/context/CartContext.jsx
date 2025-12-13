import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const CartContext = createContext();

export const useCart = () => {
  return useContext(CartContext);
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));
  const BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/api`;

  // 1. INITIAL LOAD
  useEffect(() => {
    const loadCart = async () => {
      if (user) {
        // LOGGED IN: Fetch from DB
        try {
          // CHECK FOR LOCAL CART TO MERGE
          const localCart = JSON.parse(localStorage.getItem('cartItems')) || [];
          if (localCart.length > 0) {
            await axios.post(`${BASE_URL}/cart`, {
              userId: user._id,
              product: localCart,
              type: 'merge'
            });
            // Clear local cart after merge so we don't merge again next reload
            localStorage.removeItem('cartItems');
          }

          const res = await axios.get(`${BASE_URL}/cart/find/${user._id}`);
          if (res.data && res.data.products) {
            setCartItems(res.data.products);
          }
        } catch (err) {
          console.error("Failed to load cart from DB:", err);
        }
      } else {
        // GUEST: Load from LocalStorage
        const localData = localStorage.getItem('cartItems');
        setCartItems(localData ? JSON.parse(localData) : []);
      }
    };
    loadCart();
  }, []); // Run once on mount (window reload happens on login/logout)

  // 2. SAVE TO LOCAL STORAGE (GUEST ONLY)
  useEffect(() => {
    if (!user) {
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }
  }, [cartItems, user]);

  // --- ACTIONS ---

  const addToCart = async (product) => {
    if (user) {
      // SERVER SIDE
      try {
        const res = await axios.post(`${BASE_URL}/cart`, {
          userId: user._id,
          product: product,
          type: 'add' // backend handles add vs update logic mostly same way 
        });
        setCartItems(res.data.products);
      } catch (err) {
        console.error("Add to cart failed", err);
      }
    } else {
      // CLIENT SIDE
      setCartItems((prevItems) => {
        const existingItem = prevItems.find((item) => item.id === product.id);
        if (existingItem) {
          return prevItems.map((item) =>
            item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
          );
        } else {
          // Ensure consistent structure (DB uses productId, local uses id. Let's try to normalize or handle both)
          // For now, keeping as is, but DB response will map 'productId' back to front? 
          // DB Schema has: productId, title, img...
          // Frontend expects: id, title, img...
          // We might need to map DB products `productId` -> `id` for frontend consistency.
          return [...prevItems, { ...product, quantity: 1 }];
        }
      });
    }
  };

  const removeFromCart = async (id) => {
    // Normalizing ID: DB uses 'productId', Local uses 'id' usually. 
    // If getting from DB, the item might have `productId`. 
    // We should ensure `id` is passed correctly.
    if (user) {
      try {
        const res = await axios.post(`${BASE_URL}/cart/remove`, {
          userId: user._id,
          productId: id
        });
        setCartItems(res.data.products);
      } catch (err) {
        console.error(err);
      }
    } else {
      setCartItems((prevItems) => prevItems.filter((item) => (item.id || item.productId) !== id));
    }
  };

  const updateQuantity = async (id, type) => {
    if (user) {
      // We need to calculate new quantity or tell server to inc/dec
      // My server route currently handles 'add' (inc) or 'update_qty' (set).
      // Let's deduce the current quantity to act smarter or update server to handle inc/dec.
      // Server route: if exists, q += 1. 
      // We need q -= 1 support or set exact quantity.
      // Let's find the item first.
      const item = cartItems.find(p => (p.productId || p.id) === id);
      if (!item) return;

      const newQty = type === 'increase' ? item.quantity + 1 : item.quantity - 1;
      if (newQty < 1) return; // Don't remove via update, use remove for that

      try {
        const res = await axios.post(`${BASE_URL}/cart`, {
          userId: user._id,
          product: { id: id, quantity: newQty }, // sending id as id, server checks productId
          type: 'update_qty'
        });
        setCartItems(res.data.products);
      } catch (err) {
        console.error(err);
      }

    } else {
      setCartItems((prevItems) =>
        prevItems.map((item) => {
          if ((item.id || item.productId) === id) {
            const newQuantity = type === 'increase' ? item.quantity + 1 : item.quantity - 1;
            return { ...item, quantity: Math.max(newQuantity, 1) };
          }
          return item;
        })
      );
    }
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getCartCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  const clearCart = async () => {
    if (user) {
      try {
        await axios.post(`${BASE_URL}/cart/clear`, { userId: user._id });
        setCartItems([]);
      } catch (err) { console.error(err) }
    } else {
      setCartItems([]);
    }
  };

  // NORMALIZE HELPER: 
  // Frontend mostly uses .id, DB uses .productId. 
  // API returns .productId, ._id (obj id of subdoc).
  // Ideally, we map cartItems to always have .id = .productId for compatibility.
  const normalizedCartItems = cartItems.map(item => ({
    ...item,
    id: item.productId || item.id
  }));

  const value = {
    cartItems: normalizedCartItems, // Evolve state to normalized
    addToCart,
    removeFromCart,
    updateQuantity,
    getCartTotal,
    getCartCount,
    clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;

};