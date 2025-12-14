import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext'; // Import Cart Context
import toast from 'react-hot-toast';

const ProductGallery = () => {
  const [category, setCategory] = useState('ALL');
  const [modalImage, setModalImage] = useState(null);
  const [products, setProducts] = useState([]);

  // Get Add to Cart function
  const { addToCart } = useCart();

  // FETCH DATA
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // The 'cat' variable is not defined in this scope.
        // Assuming 'cat' was intended to be passed as an argument or derived within this function,
        // but for faithful replacement, we'll use a placeholder or assume it's meant to be 'category' state.
        // However, the original fetch was for all products, and the new line introduces a conditional.
        // To make the provided line syntactically correct and functional in its current context,
        // we'll interpret 'cat' as the current 'category' state for the query parameter,
        // and fix the trailing `(res.data);` to `setProducts(res.data);`.
        const currentCategoryForFetch = category === 'ALL' ? '' : category; // Only add category param if not 'ALL'

        const res = await axios.get(currentCategoryForFetch ? `${import.meta.env.VITE_API_BASE_URL}/api/products?category=${currentCategoryForFetch}` : `${import.meta.env.VITE_API_BASE_URL}/api/products`);
        setProducts(res.data);
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    };
    fetchProducts();
  }, [category]); // Added category to dependency array to refetch when category changes

  // URL PARAMETER LOGIC (Updated to wait for Products)
  const location = useLocation();

  useEffect(() => {
    // 1. Safety Check: If products aren't loaded yet, DON'T scroll.
    // The effect will run again once 'products' changes (see dependency array).
    if (products.length === 0) return;

    const params = new URLSearchParams(location.search);
    const catParam = params.get('category');

    if (catParam) {
      const map = {
        'kitchen': 'KITCHEN ESSENTIALS',
        'spices': 'SPICES',
        'salts': 'SALTS',
        'blended': 'BLENDED MASALAS'
      };
      if (map[catParam]) {
        setCategory(map[catParam]);

        // 2. Scroll logic with a tiny delay to ensure layout is stable
        setTimeout(() => {
          const element = document.getElementById('category-section');
          if (element) element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);
      }
    } else {
      setCategory('ALL');
    }
  }, [location, products]); // <--- CRITICAL: 'products' added here

  // FILTER LOGIC
  const filteredProducts = category === 'ALL'
    ? products
    : products.filter(p => p.category === category);

  return (
    <div className="products-page">

      {/* 1. TOP BANNER */}
      <section className="products-banner" style={{ backgroundImage: "url('/images/Product_Page.png')" }}>
        <h1>Our Collection</h1>
      </section>

      <div className="heading">Product <span style={{ fontSize: '60px', color: '#e21f26', fontFamily: 'sans-serif' }}>Showcase</span></div>

      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '50px' }}>
        <svg xmlns="http://www.w3.org/2000/svg" fill="#ec3136" width="40%" height="90" viewBox="0 0 50 40" stroke="#ec3136" strokeWidth="1" preserveAspectRatio="none" style={{ height: '10px' }}>
          <polygon points="0,0 0,50 50,50"></polygon>
        </svg>
      </div>

      {/* 2. INFINITE SCROLLER (3 ROWS RESTORED) */}
      <section className="scroller-section-container">
        {products.length > 0 && (
          <div className="wrapper">

            {/* Row 1: Right to Left */}
            <div className="container">
              <div className="scroll">
                {products.map((p) => (
                  <img key={p._id} src={p.img} alt={p.name} loading="lazy" onClick={() => setModalImage(p.img)} style={{ cursor: 'pointer' }} />
                ))}
              </div>
              <div className="scroll">
                {products.map((p) => (
                  <img key={`dup-${p._id}`} src={p.img} alt={p.name} loading="lazy" onClick={() => setModalImage(p.img)} style={{ cursor: 'pointer' }} />
                ))}
              </div>
            </div>

            {/* Row 2: Left to Right (Reverse) */}
            <div className="container">
              <div className="scroll reverse">
                {products.map((p) => (
                  <img key={p._id} src={p.img} alt={p.name} loading="lazy" onClick={() => setModalImage(p.img)} style={{ cursor: 'pointer' }} />
                ))}
              </div>
              <div className="scroll reverse">
                {products.map((p) => (
                  <img key={`dup-${p._id}`} src={p.img} alt={p.name} loading="lazy" onClick={() => setModalImage(p.img)} style={{ cursor: 'pointer' }} />
                ))}
              </div>
            </div>

            {/* Row 3: Right to Left */}
            <div className="container">
              <div className="scroll">
                {products.map((p) => (
                  <img key={p._id} src={p.img} alt={p.name} loading="lazy" onClick={() => setModalImage(p.img)} style={{ cursor: 'pointer' }} />
                ))}
              </div>
              <div className="scroll">
                {products.map((p) => (
                  <img key={`dup-${p._id}`} src={p.img} alt={p.name} loading="lazy" onClick={() => setModalImage(p.img)} style={{ cursor: 'pointer' }} />
                ))}
              </div>
            </div>

          </div>
        )}
      </section>

      {/* 3. CATEGORY NAV */}
      <section className="our-products" id="category-section">
        <h2>Explore <span style={{ color: '#e21f26' }}>Categories</span></h2>
        <div className="red-line"></div>

        <div className="product-categories">
          <div className="category-nav">
            {['ALL', 'KITCHEN ESSENTIALS', 'SPICES', 'SALTS', 'BLENDED MASALAS'].map(cat => (
              <button
                key={cat}
                className={category === cat ? 'active' : ''}
                onClick={() => setCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 4. PRODUCT GRID (With Add to Cart) */}
      <section className="products">
        {filteredProducts.map((product) => (
          <div key={product._id} className="product-card" style={{ backgroundColor: product.color }}>
            <img src={product.img} alt={product.name} />
            <div className="overlay">
              <h3 className="animated-text">{product.name}</h3>
              <div className="icons">
                <button className="icon search" onClick={() => setModalImage(product.img)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>🔍</button>


                {/* ADD TO CART */}
                <button
                  className="icon link"
                  title="Add to Cart"
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'white' }}
                  onClick={() => {
                    addToCart({
                      id: product._id, // Map MongoDB _id
                      name: product.name,
                      price: product.price,
                      img: product.img,
                      category: product.category
                    });
                    toast.success("Added to Cart!");
                  }}
                >
                  🛒
                </button>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* 5. ZOOM MODAL */}
      {modalImage && (
        <div id="zoomModal" style={{ display: 'flex' }} onClick={() => setModalImage(null)}>
          <span className="close-modal">&times;</span>
          <img id="zoomedImage" src={modalImage} alt="Zoomed Product" onClick={(e) => e.stopPropagation()} />
        </div>
      )}

    </div>
  );
};

export default ProductGallery;