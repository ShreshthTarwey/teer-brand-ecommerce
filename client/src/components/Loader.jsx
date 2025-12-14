import React from 'react';
import { motion } from 'framer-motion';

const Loader = () => {
    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            flexDirection: 'column',
            backgroundColor: '#fff'
        }}>
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                style={{
                    width: '80px',
                    height: '80px',
                    border: '8px solid #f3f3f3',
                    borderTop: '8px solid #e21f26',
                    borderRadius: '50%',
                    marginBottom: '20px'
                }}
            />
            <motion.h2
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                style={{ color: '#e21f26', fontWeight: 'bold', fontFamily: "'Open Sans', sans-serif" }}
            >
                TEER BRAND...
            </motion.h2>
        </div>
    );
};

export default Loader;
