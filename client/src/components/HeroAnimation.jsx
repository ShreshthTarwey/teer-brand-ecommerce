import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const HeroAnimation = () => {
  const navigate = useNavigate();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [currentAnim, setCurrentAnim] = useState('fade');
  const [showMascot, setShowMascot] = useState(false);
  // State for periodic blasts
  const [blastParticles, setBlastParticles] = useState([]);

  // Generate a random blast (20 particles)
  const triggerBlast = () => {
    const newBlast = Array.from({ length: 20 }).map((_, i) => ({
      id: Date.now() + i,
      x: (Math.random() - 0.5) * 600, // Spread nicely
      y: (Math.random() - 0.5) * 600,
      color: spiceColors[Math.floor(Math.random() * spiceColors.length)],
      size: 10 + Math.random() * 20,
    }));
    setBlastParticles(newBlast);
    // Cleanup after animation
    setTimeout(() => setBlastParticles([]), 2000);
  };

  // Periodic Blast Loop (8-10 seconds)
  useEffect(() => {
    const blastInterval = setInterval(() => {
      triggerBlast();
    }, 9000); // 9 seconds
    return () => clearInterval(blastInterval);
  }, []);

  // Animation Variants (Mature & Cinematic)
  const animations = {
    fade: {
      initial: { opacity: 0, y: 30 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -20 },
      transition: { duration: 1.2, ease: "easeOut" }
    },
    zoom: {
      initial: { opacity: 0, scale: 1.1 },
      animate: { opacity: 1, scale: 1 },
      exit: { opacity: 0, scale: 0.95 },
      transition: { duration: 1.5, ease: "easeOut" }
    },
    slide: {
      initial: { x: -40, opacity: 0 },
      animate: { x: 0, opacity: 1 },
      exit: { x: 40, opacity: 0 },
      transition: { duration: 1.0, ease: "circOut" }
    },
    blur: {
      initial: { opacity: 0, filter: 'blur(10px)' },
      animate: { opacity: 1, filter: 'blur(0px)' },
      exit: { opacity: 0, filter: 'blur(10px)' },
      transition: { duration: 1.2, ease: "easeInOut" }
    }
  };

  // Toggle between Logo and Mascot every 7 seconds
  useEffect(() => {
    const keys = Object.keys(animations);
    const interval = setInterval(() => {
      setShowMascot(prev => !prev);
      // Pick random animation
      const randomKey = keys[Math.floor(Math.random() * keys.length)];
      setCurrentAnim(randomKey);
    }, 7000);
    return () => clearInterval(interval);
  }, []);

  // Spice Colors: Red (Chilli), Yellow (Turmeric), Green (Coriander), Brown (Cumin), Beige (Ginger)
  const spiceColors = ['#E21F26', '#FFD700', '#228B22', '#D2691E', '#F5DEB3'];
  // Mascot Colors: Magical Gold & White
  const mascotColors = ['#FFD700', '#FFFFFF', '#FFA500'];

  // Generate random particles for the splash explosion (BIGGER & SPLASHIER)
  const splashParticles = Array.from({ length: 80 }).map((_, i) => ({
    id: `splash-${i}`,
    color: spiceColors[Math.floor(Math.random() * spiceColors.length)],
    angle: Math.random() * 360,
    distance: 200 + Math.random() * 800, // Explode further!
    size: 15 + Math.random() * 35, // Bigger chunks
    delay: Math.random() * 0.1
  }));

  // Floating particles (background)
  const floatingParticles = [
    { id: 1, color: '#E21F26', size: 35, top: '15%', left: '10%', depth: 2 },
    { id: 2, color: '#FFD700', size: 40, top: '60%', left: '15%', depth: 1 },
    { id: 3, color: '#228B22', size: 25, top: '20%', left: '85%', depth: 3 },
    { id: 4, color: '#D2691E', size: 45, top: '70%', left: '80%', depth: 1 },
    { id: 5, color: '#F5DEB3', size: 30, top: '85%', left: '45%', depth: 2 },
    { id: 6, color: '#E21F26', size: 28, top: '10%', left: '60%', depth: 3 },
    { id: 7, color: '#FFD700', size: 22, top: '40%', left: '90%', depth: 4 },
    { id: 8, color: '#228B22', size: 32, top: '45%', left: '5%', depth: 4 },
    { id: 9, color: '#D2691E', size: 38, top: '30%', left: '30%', depth: 2 },
    { id: 10, color: '#F5DEB3', size: 26, top: '55%', left: '70%', depth: 3 },
    { id: 11, color: '#E21F26', size: 34, top: '5%', left: '40%', depth: 5 },
    { id: 12, color: '#FFD700', size: 24, top: '90%', left: '20%', depth: 2 },
    // Adding more for density
    { id: 13, color: '#228B22', size: 20, top: '10%', left: '30%', depth: 3 },
    { id: 14, color: '#D2691E', size: 40, top: '80%', left: '10%', depth: 1 },
    // Edge Fillers (Energetic Sides)
    { id: 15, color: '#FFD700', size: 25, top: '50%', left: '2%', depth: 4 },
    { id: 16, color: '#E21F26', size: 30, top: '30%', left: '95%', depth: 2 },
    { id: 17, color: '#F5DEB3', size: 15, top: '70%', left: '5%', depth: 3 },
    { id: 18, color: '#228B22', size: 28, top: '90%', left: '90%', depth: 1 },
    { id: 19, color: '#D2691E', size: 35, top: '10%', left: '85%', depth: 5 },
    { id: 20, color: '#FFD700', size: 22, top: '40%', left: '8%', depth: 2 },
  ];

  // Extra "Magic" particles for Mascot phase
  const magicParticles = Array.from({ length: 20 }).map((_, i) => ({
    id: `magic-${i}`,
    color: mascotColors[i % mascotColors.length],
    size: 5 + Math.random() * 15,
    top: `${20 + Math.random() * 60}%`,
    left: `${20 + Math.random() * 60}%`,
  }));

  // Handle mouse movement for Parallax effect
  const handleMouseMove = (e) => {
    // Calculate mouse position relative to the center of the screen
    // Values range from -1 to 1
    const x = (e.clientX / window.innerWidth) * 2 - 1;
    const y = (e.clientY / window.innerHeight) * 2 - 1;
    setMousePosition({ x, y });
  };

  return (
    <div
      style={{
        position: 'relative',
        height: '600px',
        width: '100%',
        overflow: 'hidden',
        background: 'radial-gradient(circle at center, #2b0c0c 0%, #000000 100%)', // Slightly lighter center for visibility
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        perspective: '1000px'
      }}
      onMouseMove={handleMouseMove}
    >

      {/* --- SPLASH EXPLOSION LAYER (Runs once on mount) --- */}
      {splashParticles.map((p) => (
        <motion.div
          key={p.id}
          initial={{ x: 0, y: 0, opacity: 1, scale: 0 }}
          animate={{
            x: Math.cos(p.angle * Math.PI / 180) * p.distance,
            y: Math.sin(p.angle * Math.PI / 180) * p.distance,
            opacity: 0,
            scale: [0, 2, 0] // Pulse bigger
          }}
          transition={{ duration: 3.5, ease: "easeOut", delay: p.delay }}
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            borderRadius: '50%',
            boxShadow: `0 0 15px ${p.color}`,
            zIndex: 20
          }}
        />
      ))}

      {/* --- PERIODIC BLAST LAYER (Every 9s) --- */}
      {blastParticles.map((p) => (
        <motion.div
          key={p.id}
          initial={{ x: 0, y: 0, opacity: 1, scale: 0 }}
          animate={{
            x: p.x,
            y: p.y,
            opacity: 0,
            scale: [0.5, 1.5, 0]
          }}
          transition={{ duration: 1.8, ease: "easeOut" }}
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            borderRadius: '50%',
            boxShadow: `0 0 15px ${p.color}`,
            zIndex: 15
          }}
        />
      ))}

      {/* --- STANDARD FLOATING SPICES (Cinematic Drift) --- */}
      {floatingParticles.map((p) => (
        <motion.div
          key={p.id}
          animate={{
            // Mature, slow, continuous drift
            y: [0, -40, 0],
            x: [0, 30, 0],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 10 + Math.random() * 5, // Slow & Elegant
            repeat: Infinity,
            ease: "easeInOut",
            delay: Math.random() * 5
          }}
          style={{
            position: 'absolute',
            top: p.top,
            left: p.left,
            width: p.size,
            height: p.size,
            x: mousePosition.x * 40 * p.depth,
            y: mousePosition.y * 40 * p.depth,
            zIndex: 1,
            backgroundColor: p.color,
            borderRadius: '40% 60% 70% 30% / 40% 50% 60% 50%',
            opacity: 0.8,
            boxShadow: `0 0 20px ${p.color}`
          }}
        />
      ))}

      {/* --- MASCOT MAGIC PARTICLES (Only when Mascot is show) --- */}
      <AnimatePresence>
        {showMascot && magicParticles.map((p, i) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: [0, 0.8, 0],
              scale: [0, 1, 0], // Subtle sparkle
              y: -40
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1 }}
            style={{
              position: 'absolute',
              top: p.top,
              left: p.left,
              width: p.size,
              height: p.size,
              backgroundColor: p.color,
              borderRadius: '50%',
              boxShadow: `0 0 15px ${p.color}`,
              zIndex: 5
            }}
          />
        ))}
      </AnimatePresence>

      {/* --- HERO CONTENT LAYER (Switcher) --- */}
      <div style={{ zIndex: 10, textAlign: 'center', position: 'relative', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>

        <AnimatePresence mode="wait">
          {!showMascot ? (
            /* --- LOGO PHASE --- */
            <motion.div
              key="logo"
              {...animations[currentAnim]}
            >
              <img
                src="/images/Teer_Brand_Main_Logo.png"
                alt="Teer Brand"
                style={{
                  height: '350px',
                  width: 'auto',
                  maxWidth: '90vw',
                  // Combined White Outline + GOLD GLOW
                  filter: 'drop-shadow(2px 0 0 white) drop-shadow(-2px 0 0 white) drop-shadow(0 2px 0 white) drop-shadow(0 -2px 0 white) drop-shadow(0 0 25px rgba(255, 215, 0, 0.8))'
                }}
              />
            </motion.div>
          ) : (
            /* --- MASCOT PHASE --- */
            <motion.div
              key="mascot"
              {...animations[currentAnim]}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
            >
              <img
                src="/images/Teer_Brand_Mascot_v3-removebg-preview.png"
                alt="Teer Mascot"
                style={{
                  height: '350px',
                  width: 'auto',
                  filter: 'drop-shadow(0 0 25px rgba(255, 215, 0, 0.6))' // Gold Glow
                }}
              />
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                style={{
                  fontFamily: "'Merriweather', serif",
                  color: '#FFD700',
                  fontSize: '2rem',
                  marginTop: '20px',
                  textShadow: '0 2px 5px rgba(0,0,0,0.8)'
                }}
              >
                "Original Taste of India"
              </motion.h2>
            </motion.div>
          )}
        </AnimatePresence>

      </div>

      {/* Dark Overlay Vignette */}
      <div style={{
        position: 'absolute',
        top: 0, left: 0, width: '100%', height: '100%',
        background: 'radial-gradient(transparent 40%, rgba(0,0,0,0.8) 100%)',
        pointerEvents: 'none',
        zIndex: 2
      }}></div>

    </div>
  );
};

export default HeroAnimation;