import React from 'react';
import './ProductsHero.css';
import { motion } from 'framer-motion';

const productImages = [
    "/images/Products/Dhania_Powder_thumb.webp",
    "/images/Products/Sabji_Mix_thumb.webp",
    "/images/Products/Turmeric_Powder_thumb.webp",
    "/images/Products/Mirch_Powder_thumb.webp",
    "/images/Products/Sarso_thumb.webp", // Replaced Jeera
    "/images/Products/Golki_Powder_thumb.webp",
    "/images/Products/Chatt_Masala_thumb.webp",
    "/images/Products/Kala_namak_thumb.webp",
    // Duplicates for more density
    "/images/Products/Dhania_thumb.webp",
    "/images/Products/BlackPepper_thumb.webp",
    "/images/Products/Turmeric_Powder_thumb.webp", // Extra Color
    "/images/Products/Mirch_Powder_thumb.webp", // Extra Color
    "/images/Products/Sabji_Mix_thumb.webp" // Extra Color
];

const ProductsHero = () => {
    // State to track if the heavy background image has loaded
    const [bgLoaded, setBgLoaded] = React.useState(false);

    // Function to get random number in range
    const random = (min, max) => Math.random() * (max - min) + min;

    // Generate falling items configurations
    // We'll create more items than images to have a continuous flow
    const fallingItems = Array.from({ length: 30 }).map((_, i) => {
        const src = productImages[i % productImages.length];

        // Randomize side: Left (0-30%) or Right (70-100%)
        const side = Math.random() > 0.5 ? 'left' : 'right';
        const xPos = side === 'left' ? random(2, 28) : random(72, 98); // % values

        // Fix Bundling: Use NEGATIVE delay.
        // This makes the animation start as if it has already been running for 'delay' seconds.
        // This ensures items are immediately scattered across the screen height.
        const duration = random(5, 12); // Speed varies
        const delay = -random(0, 20); // Negative delay for "pre-warmed" animation

        const size = random(80, 150); // Varied sizes

        return {
            id: i,
            src,
            x: `${xPos}%`,
            delay,
            duration,
            size
        };
    });

    return (
        <motion.section
            className="products-hero-container"
            initial={{ opacity: 0 }}
            animate={{ opacity: bgLoaded ? 1 : 0 }} // Fade in only when BG is ready
            transition={{ duration: 0.8 }}
        >
            {/* Hidden Image Loader to detect when background is ready */}
            <img
                src="/images/product_animation_banner.webp"
                alt="preload"
                style={{ display: 'none' }}
                onLoad={() => setBgLoaded(true)}
            />

            {!bgLoaded && (
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: '#2c1e12' // Placeholder dark wood color
                }}>
                    {/* Optional: Add a spinner here if desired */}
                    <span style={{ color: '#fdf5e6', opacity: 0.5 }}>Loading...</span>
                </div>
            )}

            <div className="hero-title-wrapper">
                <motion.h1
                    className="hero-title"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: bgLoaded ? 1 : 0, scale: bgLoaded ? 1 : 0.9 }}
                    transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                >
                    Our Collection
                </motion.h1>
            </div>

            {bgLoaded && fallingItems.map((item) => (
                <motion.img
                    key={item.id}
                    src={item.src}
                    className="product-orbiter"
                    style={{
                        position: 'absolute',
                        left: item.x,
                        width: `${item.size}px`,
                        top: '-150px', // Start above container
                        opacity: 1,
                        mixBlendMode: 'multiply'
                    }}
                    animate={{
                        y: [0, 800], // Fall down
                        rotate: [0, 360],
                    }}
                    transition={{
                        y: {
                            duration: item.duration,
                            repeat: Infinity,
                            ease: "linear",
                            delay: item.delay // Negative delay works magic here
                        },
                        rotate: {
                            duration: item.duration * 1.5,
                            repeat: Infinity,
                            ease: "linear"
                        }
                    }}
                />
            ))}
        </motion.section>
    );
};

export default ProductsHero;
