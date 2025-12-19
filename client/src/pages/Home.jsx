import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import HeroAnimation from '../components/HeroAnimation';
import Loader from '../components/Loader';
import CountUp from '../components/CountUp';

const Home = () => {
    // --- SLIDER LOGIC ---
    const [currentSlide, setCurrentSlide] = useState(0);
    const slides = [
        "/images/Logo_animation.gif",
        "/images/Front_image1.png",
        "/images/Front_Page2.png"
    ];

    useEffect(() => {
        const slideInterval = setInterval(() => {
            setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
        }, 3000); // Change slide every 3 seconds

        return () => clearInterval(slideInterval);
    }, [slides.length]);

    const nextSlide = () => {
        setCurrentSlide(currentSlide === slides.length - 1 ? 0 : currentSlide + 1);
    };

    const prevSlide = () => {
        setCurrentSlide(currentSlide === 0 ? slides.length - 1 : currentSlide - 1);
    };
    // --------------------

    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/products`);
                // ONLY TAKE THE FIRST 12 PRODUCTS
                setFeaturedProducts(res.data.slice(0, 12));
                setLoading(false);
            } catch (err) {
                console.log(err);
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    return (
        <div className="home-page">

            {/* 1. SLIDER SECTION */}
            {/* <div className="slider-container">
                <div className="slider-nav">
                    <button className="prev" onClick={prevSlide}>❮</button>
                    <button className="next" onClick={nextSlide}>❯</button>
                </div>
                <div className="slider" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
                    {slides.map((src, index) => (
                        <div className="slide" key={index}>
                            <img src={src} alt={`Slide ${index + 1}`} style={{ height: '820px' }} loading="lazy" />
                        </div>
                    ))}
                </div>
            </div> */}

            <HeroAnimation />

            {/* 2. HERO SECTION */}
            <section className="hero-section">
                <div className="hero-container">
                    <div className="hero-image">
                        <img src="/images/Hero_image.png" alt="Teer Mascot" className="ambassador-img" loading="lazy" />
                    </div>
                    <div className="hero-content">
                        <div className="hero-header">
                            <h2>Welcome To <img src="/images/Teer_Brand_Logo_Large.png" alt="Teer Logo" className="inline-logo" /></h2>
                            <div className="red-line"></div>
                        </div>
                        <div className="hero-text">
                            <p>Established with a passion for authenticity, <b>Teer Brand</b> has become a trusted name in the world of spices. Over the years, we have grown into a leading producer of <b>premium-quality spices and food products</b> in India. Our commitment to <b>tradition, purity, and taste</b> sets us apart, ensuring that every blend we create enhances the flavors of your kitchen.</p>

                            <p>With a <b>robust network of spice cultivators</b> and a <b>strong distribution system</b>, Teer Brand takes pride in delivering <b>aromatic, rich, and high-quality</b> masalas straight from the finest sources. As we continue to expand, our dedication remains the same—to bring <b>authentic taste and purity</b> to every household...</p>
                            <div className="read-more-button">
                                <Link to="/who-we-are">read more</Link>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="spices-section">
                    <div className="spices-content">
                        <h2>Spices and Salt</h2>
                        <h3>Products</h3>
                        <div className="red-line-small"></div>
                    </div>
                    <div className="spices-image">
                        <img src="/images/Index_spices_in_bowls.jpg" alt="Various spices in bowls" loading="lazy" />
                    </div>
                </div>
            </section>

            {/* 3. FIXED BACKGROUND */}
            <div className="fixed-background">
                <div className="background-content">
                    <h2>Teer Brand<br />represents the<br />essence of purity,<br />tradition, and<br />excellence...</h2>
                    <Link to="/products" className="products-button">Our Products</Link>
                </div>
            </div>

            {/* 4. WHY TEER SECTION */}
            <section className="why-teer">
                <div className="why-teer-header">
                    <h2>
                        Why <img src="images/Teer_Brand_Main_Logo.png" alt="Teer Logo" className="goldiee-inline-logo" height="1000px" width="180px" />
                    </h2>
                    <div className="red-line"></div>
                </div>

                <div className="why-teer-content">

                    <div className="why-teer-left">
                        <div className="why-point">
                            <div className="check-box">
                                <span className="checkmark">✓</span>
                            </div>
                            <div className="point-content">
                                <h3>Uncompromising Quality</h3>
                                <p>We use <b>advanced grinding technology</b> to ensure that our spices retain <b>maximum freshness, aroma, and natural oils</b>.</p>
                            </div>
                        </div>

                        <div className="why-point">
                            <div className="check-box">
                                <span className="checkmark">✓</span>
                            </div>
                            <div className="point-content">
                                <h3>In-House Quality Testing</h3>
                                <p>Every batch is <strong>rigorously tested</strong> in our dedicated lab to maintain purity and safety standards.</p>
                            </div>
                        </div>

                        <div className="why-point">
                            <div className="check-box">
                                <span className="checkmark">✓</span>
                            </div>
                            <div className="point-content">
                                <h3>Growing Network</h3>
                                <p>With a <strong>steadily expanding distribution network</strong>, we are reaching more homes every day with our trusted spices.</p>
                            </div>
                        </div>

                        <div className="why-point">
                            <div className="check-box">
                                <span className="checkmark">✓</span>
                            </div>
                            <div className="point-content">
                                <h3>A Legacy of Trust</h3>
                                <p>Founded with a <b>vision to deliver purity</b>, Teer Brand is built on <strong>years of dedication and customer trust</strong>.</p>
                            </div>
                        </div>

                        <div className="why-point">
                            <div className="check-box">
                                <span className="checkmark">✓</span>
                            </div>
                            <div className="point-content">
                                <h3>Efficient Supply Chain</h3>
                                <p>We utilize <b>modern inventory and supply chain management</b> to ensure timely delivery of fresh products.</p>
                            </div>
                        </div>
                    </div>

                    <div className="why-teer-center">
                        <img src="images/Teer_Brand_Mascot_v3-removebg-preview.png" alt="Teer Mascot" className="mascot-img" />
                    </div>

                    <div className="why-teer-right">
                        <div className="why-point">
                            <div className="check-box">
                                <span className="checkmark">✓</span>
                            </div>
                            <div className="point-content">
                                <h3>Hygienic Manufacturing</h3>
                                <p>We follow <strong>strict hygiene protocols</strong>, ensuring minimal human contact during the production process.</p>
                            </div>
                        </div>

                        <div className="why-point">
                            <div className="check-box">
                                <span className="checkmark">✓</span>
                            </div>
                            <div className="point-content">
                                <h3>Advanced Technology</h3>
                                <p>Our production facility is equipped with <b>automated systems and precision control technology</b> for consistency.</p>
                            </div>
                        </div>

                        <div className="why-point">
                            <div className="check-box">
                                <span className="checkmark">✓</span>
                            </div>
                            <div className="point-content">
                                <h3>Diverse Product Range</h3>
                                <p>From <strong>pure spices to blended masalas</strong>, Teer Brand offers a carefully curated range for every kitchen.</p>
                            </div>
                        </div>

                        <div className="why-point">
                            <div className="check-box">
                                <span className="checkmark">✓</span>
                            </div>
                            <div className="point-content">
                                <h3>Recognized for Quality</h3>
                                <p>Our commitment to <strong>high standards</strong> has earned us a reputation as a <b>trusted spice brand</b>.</p>
                            </div>
                        </div>

                        <div className="why-point">
                            <div className="check-box">
                                <span className="checkmark">✓</span>
                            </div>
                            <div className="point-content">
                                <h3>FSSAI Certified</h3>
                                <p>All our products are <strong>approved and certified</strong> by the Food Safety and Standards Authority of India (FSSAI).</p>
                            </div>
                        </div>
                    </div>

                </div>
            </section>



            {/* Stats Section */}
            <section className="stats-section">
                <div className="stats-background">
                    <div className="stats-container">

                        <div className="stat-item">
                            <div className="stat-icon">
                                <i
                                    aria-hidden="true"
                                    className="fas fa-calendar-alt"
                                    style={{ fontSize: "80px" }}
                                ></i>
                            </div>
                            <div className="stat-content">
                                <h3><CountUp from={1900} to={1992} duration={6} /></h3>
                                <p>Since</p>
                            </div>
                        </div>

                        <div className="stat-item">
                            <div className="stat-icon">
                                <i
                                    className="premium-drawable-icon fa fa-industry premium-svg-nodraw"
                                    aria-hidden="true"
                                    style={{ fontSize: "80px" }}
                                ></i>
                            </div>
                            <div className="stat-content">
                                <h3><CountUp from={0} to={4} duration={6} suffix="+" /></h3>
                                <p>Different Industries</p>
                            </div>
                        </div>

                        <div className="stat-item">
                            <div className="stat-icon">
                                <i
                                    className="premium-drawable-icon fa fa-cube premium-svg-nodraw"
                                    aria-hidden="true"
                                    style={{ fontSize: "80px" }}
                                ></i>
                            </div>
                            <div className="stat-content">
                                <h3><CountUp from={0} to={12} duration={6} suffix="+" /></h3>
                                <p>Products</p>
                            </div>
                        </div>

                        <div className="stat-item">
                            <div className="stat-icon">
                                <i
                                    className="premium-drawable-icon fa fa-globe premium-svg-nodraw"
                                    aria-hidden="true"
                                    style={{ fontSize: "80px" }}
                                ></i>
                            </div>
                            <div className="stat-content">
                                <h3><CountUp from={0} to={0} duration={6} suffix="+" /></h3>
                                <p>Export Countries</p>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* 5. DYNAMIC PRODUCTS SECTION (The Upgrade) */}
            <section className="products-main-section">
                <h2>Bestselling Products</h2>
                <svg
                    width="60%"
                    height="8"
                    viewBox="0 0 500 8"
                    preserveAspectRatio="none"
                    style={{ maxWidth: '600px', height: '8px', marginBottom: '20px', display: 'block', margin: '0 auto 20px auto' }}
                >
                    <polygon points="0,0 500,8 0,8" fill="#e21f26" />
                </svg>

                <p className="products-tagline">
                    The secret to irresistible flavors—enhancing taste with an aroma that lingers.
                </p>

                <div className="products-color-bar"></div>

                {loading ? (
                    <Loader />
                ) : (
                    /* DYNAMIC GRID */
                    <div className="products-grid-container">
                        {featuredProducts.map((product) => (
                            <div
                                className="product-grid-item"
                                key={product._id}
                                // DYNAMIC COLOR from Database! No more IDs needed.
                                style={{ backgroundColor: product.color }}
                            >
                                <div className="product-image">
                                    <Link to={`/product/${product._id}`}>
                                        <img src={product.img} alt={product.name} />
                                    </Link>
                                </div>
                                <div className="product-title">
                                    <Link to={`/product/${product._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                        {product.name}
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* VIEW ALL BUTTON */}
                <div style={{ marginTop: '40px' }}>
                    <Link to="/products" className="products-button" >View All Products</Link>
                </div>
            </section>

            {/* Benchmark Section */}
            <section className="benchmark-section">
                <h2>Benchmark</h2>

                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    version="1.1"
                    fill="#ec3136"
                    width="20%"
                    height="90"
                    viewBox="0 -4 30 30"
                    stroke="#ec3136"
                    strokeWidth="1"
                    preserveAspectRatio="none"
                    style={{ height: "10px" }}
                >
                    <polygon points="0,0 0,50 50,50"></polygon>
                </svg>

                <p className="benchmark-tagline">
                    <b>Setting the standard for quality</b>—our commitment to excellence in every spice we produce.
                </p>

                <div className="quality-standards">
                    <div className="standard-item">
                        <i className="fas fa-certificate"></i>
                        <h3>FSSAI Certified</h3>
                        <p>Licensed and approved by the Food Safety and Standards Authority of India</p>
                    </div>

                    <div className="standard-item">
                        <i className="fas fa-users"></i>
                        <h3>Locally Trusted</h3>
                        <p>Loved by generations for authenticity and consistent quality</p>
                    </div>

                    <div className="standard-item">
                        <i className="fas fa-leaf"></i>
                        <h3>Natural Ingredients</h3>
                        <p>100% natural, no artificial additives</p>
                    </div>

                    <div className="standard-item">
                        <i className="fas fa-industry"></i>
                        <h3>Traditional Grinding Methods</h3>
                        <p>Processed using large rotating motor grinders to retain aroma and flavor</p>
                    </div>
                </div>
            </section>


            {/* 6. CONTACT SECTION (Merged into Home for now)
      <section className="contact-section">
         <h2>Contact <span className="us-red">Us</span></h2>
         <div className="contact-container">
            <div className="contact-column">
               <h3>CONTACT</h3>
               <div className="contact-info">
                  <div className="contact-icon"><i className="fas fa-phone-alt"></i></div>
                  <div className="contact-detail"><p>+91 993453xxxx</p></div>
               </div>
            </div>
            <div className="contact-column">
               <h3>ADDRESS</h3>
               <div className="contact-info">
                  <div className="contact-icon"><i className="fas fa-map-marker-alt"></i></div>
                  <div className="contact-detail"><p><b>Teer Brand</b>, Jhumri Telaiya, Jharkhand</p></div>
               </div>
            </div>
         </div>
      </section> */}
        </div>
    );
};

export default Home;