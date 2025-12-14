import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import './admin.css';

const EditProduct = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [inputs, setInputs] = useState({
        name: '',
        desc: '',
        price: '',
        category: '',
        img: '',
        color: ''
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/products/find/${id}`);
                setInputs(res.data);
                setLoading(false);
            } catch (err) {
                console.error(err);
                toast.error("Failed to load product");
            }
        };
        fetchProduct();
    }, [id]);

    const handleChange = (e) => {
        setInputs(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            // Standardizing PUT route: /api/products/:id
            await axios.put(`${import.meta.env.VITE_API_BASE_URL}/api/products/${id}`, inputs, {
                headers: { token: `Bearer ${user.accessToken}` }
            });
            toast.success("Product Updated Successfully!");
            navigate('/admin/products');
        } catch (err) {
            console.error(err);
            toast.error("Error updating product");
        }
    };

    if (loading) return <div className="admin-content">Loading...</div>;

    return (
        <div>
            <div className="admin-header">
                <h1>Edit Product</h1>
            </div>
            <div className="admin-form">
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Product Name</label>
                        <input name="name" type="text" value={inputs.name || ''} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>Description</label>
                        <textarea name="desc" rows="3" value={inputs.desc || ''} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>Price (₹)</label>
                        <input name="price" type="number" value={inputs.price || ''} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>Category</label>
                        <select name="category" value={inputs.category || ''} onChange={handleChange} required>
                            <option value="">Select Category</option>
                            <option value="KITCHEN ESSENTIALS">KITCHEN ESSENTIALS</option>
                            <option value="SPICES">SPICES</option>
                            <option value="SALTS">SALTS</option>
                            <option value="BLENDED MASALAS">BLENDED MASALAS</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Image URL</label>
                        <input name="img" type="text" value={inputs.img || ''} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>Color Code (Hex)</label>
                        <input name="color" type="text" value={inputs.color || ''} onChange={handleChange} />
                    </div>

                    <button type="submit" className="admin-btn">Update Product</button>
                </form>
            </div>
        </div>
    );
};

export default EditProduct;
