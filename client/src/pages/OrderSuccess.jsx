import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Confetti from 'react-confetti';
import { CheckCircle, ShoppingBag, Home } from 'lucide-react';

const OrderSuccess = () => {
    const navigate = useNavigate();
    const [windowDimension, setWindowDimension] = useState({ width: window.innerWidth, height: window.innerHeight });

    // Update confetti size on window resize
    const detectSize = () => {
        setWindowDimension({ width: window.innerWidth, height: window.innerHeight });
    };

    useEffect(() => {
        window.addEventListener('resize', detectSize);
        return () => window.removeEventListener('resize', detectSize);
    }, []);

    // Redirect to home after 10 seconds (optional, but good UX)
    // useEffect(() => {
    //     setTimeout(() => navigate('/'), 10000);
    // }, []);

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '80vh',
            textAlign: 'center',
            padding: '20px'
        }}>
            <Confetti width={windowDimension.width} height={windowDimension.height} numberOfPieces={200} recycle={false} />

            <div style={{
                background: '#fff',
                padding: '40px',
                borderRadius: '15px',
                boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                maxWidth: '500px',
                width: '100%',
                borderTop: '5px solid #e21f26'
            }}>
                <div style={{ marginBottom: '20px' }}>
                    <CheckCircle size={64} color="#28a745" />
                </div>

                <h1 style={{ color: '#333', marginBottom: '10px' }}>Order Confirmed!</h1>
                <p style={{ color: '#666', marginBottom: '30px', fontSize: '1.1rem' }}>
                    Yay! Payment successful. Your spices are being packed with care and will be on their way soon.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <Link to="/orders" style={{
                        textDecoration: 'none',
                        backgroundColor: '#e21f26',
                        color: 'white',
                        padding: '12px 20px',
                        borderRadius: '30px',
                        fontWeight: 'bold',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '10px',
                        transition: '0.3s'
                    }}>
                        <ShoppingBag size={20} /> View My Order
                    </Link>

                    <Link to="/" style={{
                        textDecoration: 'none',
                        color: '#333',
                        padding: '12px 20px',
                        borderRadius: '30px',
                        border: '2px solid #eee',
                        fontWeight: 'bold',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '10px'
                    }}>
                        <Home size={20} /> Back to Home
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default OrderSuccess;
