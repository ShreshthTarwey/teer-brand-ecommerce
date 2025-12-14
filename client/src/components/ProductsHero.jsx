import React from 'react';
import './ProductsHero.css';
import { motion } from 'framer-motion';

const productImages = [
    "/images/Products/Dhania_Powder.png",
    "/images/Products/Sabji_Mix.png",
    "/images/Products/Turmeric_Powder.png",
    "/images/Products/Mirch_Powder.png",
    "/images/Products/Sarso.png", // Replaced Jeera
    "/images/Products/Golki_Powder.png",
    "/images/Products/Chatt_Masala.png",
    "/images/Products/Kala_namak.png",
    // Duplicates for more density
    "/images/Products/Dhania.png",
    "/images/Products/BlackPepper.png",
    "/images/Products/Turmeric_Powder.png", // Extra Color
    "/images/Products/Mirch_Powder.png", // Extra Color
    "/images/Products/Sabji_Mix.png" // Extra Color
];

const ProductsHero = () => {
    // Generate random safe positions (avoiding center 40%)
    // Function to get random number in range
    const random = (min, max) => Math.random() * (max - min) + min;

    // Generate falling items configurations
    // We'll create more items than images to have a continuous flow
    const fallingItems = Array.from({ length: 30 }).map((_, i) => { // Increased to 30 for smoother flow
        const src = productImages[i % productImages.length];

        // Randomize side: Left (0-30%) or Right (70-100%)
        const side = Math.random() > 0.5 ? 'left' : 'right';
        const xPos = side === 'left' ? random(2, 28) : random(72, 98); // % values

        // Fix Bundling: Use semi-deterministic delay to spacing them out
        const baseDelay = i * 0.8; // Uniform stagger to prevent initial clumping
        const randomOffset = random(0, 5);
        // We use a negative delay for some to simulate they are already falling,
        // but framer-motion delay must be positive.
        // Instead, we just space them out significantly.
        const delay = baseDelay + randomOffset;

        const duration = random(4, 9); // Fast falling (User requested speed)
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
        <section className="products-hero-container">
            <div className="hero-title-wrapper">
                <motion.h1
                    className="hero-title"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                >
                    Our Collection
                </motion.h1>
            </div>

            {fallingItems.map((item) => (
                <motion.img
                    key={item.id}
                    src={item.src}
                    className="product-orbiter"
                    style={{
                        position: 'absolute',
                        left: item.x,
                        width: `${item.size}px`,
                        top: '-150px', // Start above container
                        opacity: 1, // Increased visibility
                        mixBlendMode: 'multiply' // Ensure this stays to blend white bg
                    }}
                    animate={{
                        y: [0, 800], // Fall down (assuming container is ~600px + buffer)
                        rotate: [0, 360], // Gentle rotation
                    }}
                    transition={{
                        y: {
                            duration: item.duration,
                            repeat: Infinity,
                            ease: "linear",
                            delay: item.delay
                        },
                        rotate: {
                            duration: item.duration * 1.5,
                            repeat: Infinity,
                            ease: "linear"
                        }
                    }}
                />
            ))}
        </section>
    );
};

export default ProductsHero;
