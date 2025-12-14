import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom'; // useLocation for future use if needed
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { Star, ShoppingCart } from 'lucide-react';
import toast from 'react-hot-toast';
import './ProductDetails.css'; // We will create this CSS file
import Loader from '../components/Loader';

const ProductDetails = () => {
    const { id } = useParams();
    const { addToCart } = useCart();
    const [product, setProduct] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    // Review Form State
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const fetchProductAndReviews = async () => {
            try {
                const [prodRes, revRes] = await Promise.all([
                    axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/products/find/${id}`),
                    axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/products/${id}/reviews`)
                ]);
                setProduct(prodRes.data);
                setReviews(revRes.data);
                setLoading(false);
            } catch (err) {
                console.error(err);
                setLoading(false);
            }
        };
        fetchProductAndReviews();
    }, [id]);

    const handleSubmitReview = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            if (!user) {
                toast.error("Please login to verify your purchase and leave a review.");
                setSubmitting(false);
                return;
            }

            const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/products/${id}/reviews`,
                { rating, comment },
                { headers: { token: `Bearer ${user.accessToken}` } }
            );

            // Add new review to list
            setReviews([res.data, ...reviews]);
            setComment("");
            toast.success("Review submitted successfully!");
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data || "Failed to submit review. Have you purchased this item?");
        }
        setSubmitting(false);
    };

    if (loading) return <Loader />;
    if (!product) return <div className="error">Product not found</div>;

    // Calculate Average Rating
    const avgRating = reviews.length > 0
        ? (reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length).toFixed(1)
        : "New";

    return (
        <div className="product-details-container">
            {/* PRODUCT HERO */}
            <div className="product-hero">
                <div className="product-image-section">
                    <img src={product.img} alt={product.name} className="main-img" />
                </div>
                <div className="product-info-section">
                    <h1 className="product-title">{product.name}</h1>
                    <div className="product-meta">
                        <span className="category-tag">{product.category}</span>
                        <div className="rating-badge">
                            <Star size={16} fill="#FFD700" color="#FFD700" /> {avgRating} ({reviews.length} reviews)
                        </div>
                    </div>

                    <p className="product-desc">{product.desc}</p>

                    <h2 className="price-tag">₹{product.price}</h2>

                    <div className="stock-status">
                        {product.stock > 0 ? (
                            <span className="in-stock">In Stock: {product.stock}</span>
                        ) : (
                            <span className="out-of-stock">Out of Stock</span>
                        )}
                    </div>

                    <button
                        className="add-cart-btn-large"
                        disabled={product.stock === 0}
                        onClick={() => addToCart({
                            id: product._id,
                            name: product.name,
                            price: product.price,
                            img: product.img,
                            category: product.category
                        })}
                    >
                        <ShoppingCart style={{ marginRight: '10px' }} />
                        {product.stock === 0 ? "SOLD OUT" : "ADD TO CART"}
                    </button>
                </div>
            </div>

            {/* REVIEWS SECTION */}
            <div className="reviews-section">
                <h3>Customer Reviews</h3>

                {/* WRITE REVIEW FORM */}
                <div className="write-review-card">
                    <h4>Write a Review</h4>
                    <form onSubmit={handleSubmitReview}>
                        <div className="rating-select">
                            <span>Rating: </span>
                            {[1, 2, 3, 4, 5].map(star => (
                                <Star
                                    key={star}
                                    size={24}
                                    onClick={() => setRating(star)}
                                    fill={star <= rating ? "#FFD700" : "none"}
                                    color="#FFD700"
                                    style={{ cursor: 'pointer' }}
                                />
                            ))}
                        </div>
                        <textarea
                            placeholder="Share your experience (Verified Purchase Only)"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            required
                            rows="4"
                        ></textarea>
                        <button type="submit" disabled={submitting}>
                            {submitting ? "Submitting..." : "Submit Review"}
                        </button>
                    </form>
                </div>

                {/* REVIEWS LIST */}
                <div className="reviews-list">
                    {reviews.length === 0 && <p>No reviews yet. Be the first!</p>}
                    {reviews.map(review => (
                        <div key={review._id} className="review-card">
                            <div className="review-header">
                                <span className="reviewer-name">{review.username}</span>
                                <span className="review-date">{new Date(review.createdAt).toLocaleDateString()}</span>
                            </div>
                            <div className="review-rating">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        size={14}
                                        fill={i < review.rating ? "#FFD700" : "none"}
                                        color="#FFD700"
                                    />
                                ))}
                            </div>
                            <p className="review-text">{review.comment}</p>
                            <span className="verified-badge">✓ Verified Purchase</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;
