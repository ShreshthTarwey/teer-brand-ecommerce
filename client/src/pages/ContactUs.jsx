import React, { useEffect } from 'react';
import './ContactUs.css';
import { Phone, Globe, Mail, MapPin, Send } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const ContactUs = () => {
    useEffect(() => {
        // Animation Logic
        const textContent = document.querySelector('.text-content');
        const mapContainer = document.querySelector('.map-container');
        const parallaxBg = document.getElementById('parallax-bg');
        const shine = document.getElementById('shine');
        const dotsContainer = document.getElementById('parallax-dots');
        const section = document.querySelector('.contact-section-wrapper');

        if (!dotsContainer) return;

        // Create dots
        for (let i = 0; i < 30; i++) {
            const dot = document.createElement('div');
            dot.classList.add('dot');
            const size = Math.random() * 25 + 5;
            dot.style.width = `${size}px`;
            dot.style.height = `${size}px`;
            dot.style.left = `${Math.random() * 100}%`;
            dot.style.top = `${Math.random() * 100}%`;
            dot.style.opacity = Math.random() * 0.4 + 0.1;
            dotsContainer.appendChild(dot);
        }

        setTimeout(() => {
            if (textContent) textContent.classList.add('animate');
            if (mapContainer) mapContainer.classList.add('animate');
        }, 500);

        const handleMouseMove = (e) => {
            if (!section) return;
            const rect = section.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const offsetX = (mouseX - centerX) / centerX;
            const offsetY = (mouseY - centerY) / centerY;

            if (parallaxBg) parallaxBg.style.transform = `translate(${-offsetX * 15}px, ${-offsetY * 15}px)`;
            if (shine) shine.style.transform = `translate(${mouseX - 150}px, ${mouseY - 150}px)`;

            document.querySelectorAll('.dot').forEach((dot, index) => {
                const depth = index % 5 + 1;
                dot.style.transform = `translate(${offsetX * depth * 15}px, ${offsetY * depth * 15}px)`;
            });
        };

        if (section) section.addEventListener('mousemove', handleMouseMove);

        return () => {
            if (section) section.removeEventListener('mousemove', handleMouseMove);
            if (dotsContainer) dotsContainer.innerHTML = ''; // Cleanup
        };
    }, []);

    return (
        <div>




            {/* Hero Section */}
            <section className="contact-hero">
                <div className="hero-overlay"></div>

                {/* Animated Particles */}
                {/* Animated Particles - Brightness Increased */}
                {/* 1. Gold - Top Left */}
                <motion.div
                    className="particle"
                    style={{
                        position: 'absolute',
                        top: '15%',
                        left: '10%',
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        background: 'rgba(255, 215, 0, 0.8)', // Alpha 0.8
                        zIndex: 1,
                        boxShadow: '0 0 25px rgba(255, 215, 0, 0.9)' // Stronger glow
                    }}
                    animate={{ y: [0, -30, 0], opacity: [0.6, 1, 0.6] }} // Ranges 0.6 - 1.0
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                />

                {/* 2. Red - Bottom Right */}
                <motion.div
                    className="particle"
                    style={{
                        position: 'absolute',
                        bottom: '25%',
                        right: '10%',
                        width: '70px',
                        height: '70px',
                        borderRadius: '50%',
                        background: 'rgba(226, 31, 38, 0.7)', // Alpha 0.7
                        zIndex: 1,
                        boxShadow: '0 0 30px rgba(226, 31, 38, 0.8)' // Stronger glow
                    }}
                    animate={{ y: [0, 40, 0], opacity: [0.5, 0.9, 0.5] }}
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                />

                {/* 3. White/Gold Small - Top Right (New) */}
                <motion.div
                    className="particle"
                    style={{
                        position: 'absolute',
                        top: '30%',
                        right: '25%',
                        width: '20px',
                        height: '20px',
                        borderRadius: '50%',
                        background: 'rgba(255, 255, 255, 0.6)',
                        zIndex: 1,
                        boxShadow: '0 0 15px rgba(255, 255, 255, 0.8)'
                    }}
                    animate={{ y: [0, -15, 0], x: [0, 10, 0], opacity: [0.4, 0.9, 0.4] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                />

                {/* 4. Red Small - Bottom Left (New) */}
                <motion.div
                    className="particle"
                    style={{
                        position: 'absolute',
                        bottom: '40%',
                        left: '20%',
                        width: '30px',
                        height: '30px',
                        borderRadius: '50%',
                        background: 'rgba(226, 31, 38, 0.6)',
                        zIndex: 1,
                        boxShadow: '0 0 15px rgba(226, 31, 38, 0.7)'
                    }}
                    animate={{ y: [0, 20, 0], x: [0, -10, 0], opacity: [0.5, 0.9, 0.5] }}
                    transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                />

                {/* 5. Center Gold (New) */}
                <motion.div
                    className="particle"
                    style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        width: '10px',
                        height: '10px',
                        borderRadius: '50%',
                        background: 'rgba(255, 215, 0, 0.8)',
                        zIndex: 1,
                        boxShadow: '0 0 12px rgba(255, 215, 0, 1)'
                    }}
                    animate={{ scale: [1, 2, 1], opacity: [0, 0.8, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                />

                <div className="hero-content" style={{ position: 'relative', zIndex: 10 }}>
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1.5, ease: "easeOut" }} // Adjusted to 1.5s
                    >
                        Contact Us
                    </motion.h1>

                    {/* Subtle Underline Animation */}
                    <motion.div
                        style={{
                            height: '4px',
                            background: '#e21f26',
                            margin: '10px auto',
                            borderRadius: '2px'
                        }}
                        initial={{ width: 0 }}
                        animate={{ width: '100px' }}
                        transition={{ delay: 0.8, duration: 1.5, ease: "easeOut" }} // Adjusted to 1.5s, delay 0.8s
                    />
                </div>
            </section>

            {/* Parallax Section */}
            <section className="contact-section-wrapper" id="contact-section">
                <div className="parallax-bg" id="parallax-bg"></div>
                <div className="shine" id="shine"></div>
                <div className="parallax-dots" id="parallax-dots"></div>

                <div className="content-wrapper">
                    <div className="text-content">
                        <h2>Want to meet us</h2>
                        <p>Our Address is Tara Tand Road, Koderma, Jharkhand-India</p>
                    </div>
                    <div className="map-container">
                        <div className="map-card">
                            <div className="map-header">
                                <h3>Teer Brand</h3>
                                <p>Ward-13, Tara Tand, Koderma, Jharkhand 825409</p>
                                <div className="rating">
                                    <span className="rating-score">1.0</span>
                                    <span className="stars">★☆☆☆☆</span>
                                    <a href="#" className="review-count">1 review</a>
                                </div>
                                <a href="https://maps.google.com" target="_blank" rel="noreferrer" className="view-map">View larger map</a>
                            </div>
                            <div className="map-image">
                                <iframe
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14529.18183150562!2d85.52602393348658!3d24.440532496402398!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39f375115ba931ff%3A0x3b2bb04b09e9571!2sPankaj%20salt%20mill!5e0!3m2!1sen!2sin!4v1743319759766!5m2!1sen!2sin"
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0 }}
                                    allowFullScreen=""
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                    title="Google Map"
                                ></iframe>
                                <a href="https://maps.google.com" target="_blank" rel="noreferrer" className="directions-btn">Directions</a>
                            </div>
                            <div className="map-footer">
                                <span>Keyboard shortcuts</span>
                                <span>Map data ©2025</span>
                                <span>Terms</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Contact Details Section */}
            {/* <section className="contact-details-section">
                <h2>Contact <span className="us-red">Us</span></h2>
                <div style={{ marginBottom: '20px' }}>
                    <svg
                        width="60%" height="8" viewBox="0 0 500 8" preserveAspectRatio="none"
                        style={{ maxWidth: '600px', margin: '0 auto', display: 'block' }}
                    >
                        <polygon points="0,0 500,8 0,8" fill="#e21f26" />
                    </svg>
                </div>

                <div className="contact-container">
                    <div className="contact-column">
                        <h3>CONTACT</h3>
                        <div className="contact-info">
                            <div className="contact-icon">
                                <Phone color="#ec3136" size={40} />
                            </div>
                            <div className="contact-detail">
                                <p>+91 9934530784</p>
                                <p>+91 9835760370</p>
                            </div>
                        </div>
                        <div className="contact-info">
                            <div className="contact-icon">
                                <Globe color="#ec3136" size={40} />
                            </div>
                            <div className="contact-detail">
                                <p>www.teermasala.com</p>
                            </div>
                        </div>
                    </div>

                    <div className="contact-column">
                        <h3>CUSTOMER CARE</h3>
                        <div className="contact-info">
                            <div className="contact-icon">
                                <Phone color="#ec3136" size={40} />
                            </div>
                            <div className="contact-detail">
                                <p>(Toll Free) xxxx xxx xxx xxx</p>
                            </div>
                        </div>
                        <div className="contact-info">
                            <div className="contact-icon">
                                <Mail color="#ec3136" size={40} />
                            </div>
                            <div className="contact-detail">
                                <p>pankaj.salt74@gmail.com</p>
                            </div>
                        </div>
                    </div>

                    <div className="contact-column">
                        <h3>ADDRESS</h3>
                        <div className="contact-info">
                            <div className="contact-icon">
                                <MapPin color="#ec3136" size={40} />
                            </div>
                            <div className="contact-detail">
                                <p><b>Teer Brand(Pankaj Salt Mill)</b>, Tara Tand, Jhumri Telaiya, Koderma, Jharkhand, Ward 13, PIN - 825409</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section> */}
        </div>
    );
};

export default ContactUs;
