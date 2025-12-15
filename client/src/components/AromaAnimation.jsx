import React from 'react';
import { motion } from 'framer-motion';
import './AromaAnimation.css';

const AromaAnimation = () => {
    // Configuration for the 4 spices
    const spices = [
        {
            id: 'star-anise',
            src: '/images/Spices/ChakraPhool.webp',
            alt: 'Star Anise',
            left: '10%',
            delay: 0,
            duration: 14,
            size: '90px'
        },
        {
            id: 'cinnamon',
            src: '/images/Spices/Cinnemon.webp',
            alt: 'Cinnamon Stick',
            left: '30%',
            delay: 2,
            duration: 18,
            size: '110px'
        },
        {
            id: 'clove',
            src: '/images/Spices/Long.webp',
            alt: 'Clove',
            left: '70%',
            delay: 1,
            duration: 12,
            size: '60px'
        },
        {
            id: 'cardamom-placeholder',
            src: '/images/Spices/Green_Cardamom.webp',
            alt: 'Cardamom',
            left: '85%',
            delay: 3,
            duration: 16,
            size: '80px'
        }
    ];

    return (
        <div className="aroma-animation-container">
            {spices.map((spice) => {
                const instances = [0, 0.5];

                return instances.map((offset, index) => {
                    // RANDOMNESS LOGIC:
                    // We use the 'index' (0 or 1) to flip the movement direction.
                    // Instance 1 drifts Right -> Left
                    // Instance 2 drifts Left -> Right
                    const isEven = index % 2 === 0;
                    
                    // Define two different sway patterns (Drift)
                    const swayPath = isEven 
                        ? [0, 40, -30, 0]   // Pattern A: Right first, then Left
                        : [0, -40, 30, 0];  // Pattern B: Left first, then Right

                    // Define two different rotation directions
                    const rotatePath = isEven 
                        ? [0, 45]   // Clockwise
                        : [0, -45]; // Counter-Clockwise

                    return (
                        <motion.img
                            key={`${spice.id}-${index}`}
                            src={spice.src}
                            alt={spice.alt}
                            className="spice-image"
                            style={{
                                left: spice.left,
                                width: spice.size,
                                bottom: '-15%',
                                position: 'absolute',
                                zIndex: 10
                            }}
                            animate={{
                                y: [0, -450],      // Vertical rise (Fixed)
                                x: swayPath,       // Horizontal sway (Variable!)
                                rotate: rotatePath, // Rotation (Variable!)
                                opacity: [0, 1, 1, 0]
                            }}
                            transition={{
                                duration: spice.duration,
                                repeat: Infinity,
                                ease: "easeInOut", // Smooth ease for the sway
                                delay: spice.delay + (spice.duration * offset),
                                times: [0, 0.1, 0.8, 1],
                                // We separate the X axis transition to make it feel more organic (fluid)
                                x: {
                                    duration: spice.duration,
                                    repeat: Infinity,
                                    ease: "easeInOut", // Sine wave feel
                                    times: [0, 0.33, 0.66, 1] // Sway points
                                }
                            }}
                        />
                    );
                });
            })}
        </div>
    );
};

export default AromaAnimation;