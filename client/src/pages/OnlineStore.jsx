import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, ShoppingCart, ArrowRight, Loader2 } from 'lucide-react'; // Added Loader2 icon
import axios from 'axios'; // <--- IMPORT AXIOS
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';
import "./OnlineStore.css";

const OnlineStore = () => {
  const { addToCart, getCartCount } = useCart();

  // 1. STATE MANAGEMENT
  const [products, setProducts] = useState([]); // Stores data from DB
  const [loading, setLoading] = useState(true); // Handles loading state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  const categories = ["ALL", "KITCHEN ESSENTIALS", "SPICES", "BLENDED MASALAS", "SALTS"];

  // 2. FETCH DATA FROM BACKEND
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Calling your "Chef" (Node.js)
        const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/products`);
        setProducts(res.data); // Save the food (data)
        setLoading(false); // Stop loading spinner

        //SPINNER TESTING

        // setTimeout(() => {
        //   setProducts(res.data);
        //   setLoading(false); 
        // }, 15000);
      } catch (err) {
        console.error("Error fetching products:", err);
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // 3. FILTERING LOGIC (Applied to the fetched 'products')
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'ALL' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="online-store-page">

      {/* HERO BANNER */}
      <section className="store-hero">
        <div className="store-hero-overlay">
          <h1 className="store-hero-title">Online Store</h1>
          <p className="store-hero-subtitle">Premium Spices & Salts Delivered Home</p>

          <div className="store-search-bar">
            <Search className="search-icon" size={20} />
            <input
              type="text"
              placeholder="Search for pure spices..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>
        </div>
      </section>

      <div className="store-container">

        {/* CATEGORY BELT */}
        <div className="category-belt">
          <div className="filter-pills">
            {categories.map(category => (
              <button
                key={category}
                className={`filter-pill ${selectedCategory === category ? 'active' : ''}`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>

          <Link to="/cart" className="go-to-cart-bubble">
            <ShoppingCart size={18} />
            <span>Go to Cart ({getCartCount()})</span>
          </Link>
          {/* <Link to="/orders" className="dropdown-item">My Orders</Link> */}
        </div>

        {/* RESULTS COUNT */}
        <div className="results-meta">
          <p>{filteredProducts.length} items available</p>
        </div>

        {/* 4. CONDITIONAL RENDERING */}
        {loading ? (
          // LOADING STATE
          <div className="loading-container" style={{ display: 'flex', justifyContent: 'center', padding: '50px' }}>
            <Loader2 className="animate-spin" size={48} color="#e21f26" />
          </div>
        ) : filteredProducts.length > 0 ? (
          // DATA GRID
          <div className="product-grid">
            {filteredProducts.map(product => (
              <div key={product._id} className="product-card"> {/* MongoDB uses _id, not id */}
                <Link to={`/product/${product._id}`} className="product-link">
                  <div className="product-image-container">
                    <img src={product.img} alt={product.name} className="product-image" />
                  </div>
                </Link>
                <div className="product-info">
                  <span className="product-tag">{product.category}</span>
                  <Link to={`/product/${product._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <h3 className="product-card-name">{product.name}</h3>
                  </Link>

                  {/* Stock Indicator */}
                  <div className={`stock-indicator ${product.stock > 0 ? 'in-stock' : 'out-of-stock'}`}>
                    {product.stock > 0 ? (
                      product.stock < 10
                        ? `Hurry! Only ${product.stock} left`
                        : `In Stock: ${product.stock}`
                    ) : (
                      "Out of Stock"
                    )}
                  </div>

                  <div className="product-price-row">
                    <span className="product-price">₹{product.price}</span>


                    <button
                      className="add-btn"
                      disabled={product.stock === 0}
                      style={product.stock === 0 ? { opacity: 0.5, cursor: 'not-allowed', background: '#ccc' } : {}}
                      onClick={() => {
                        addToCart({
                          id: product._id, // Map MongoDB _id to Cart id
                          name: product.name,
                          price: product.price,
                          img: product.img,
                          category: product.category
                        });
                        toast.success("Added to Cart!");
                      }}
                    >
                      <ShoppingCart size={16} /> {product.stock === 0 ? 'SOLD OUT' : 'ADD'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          // NO RESULTS STATE
          <div className="no-results">
            <p>No spices found for "{searchQuery}". Try a different category.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OnlineStore;