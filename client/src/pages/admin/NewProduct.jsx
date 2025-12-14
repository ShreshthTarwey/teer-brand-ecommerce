import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import './admin.css';

const NewProduct = () => {
    const [inputs, setInputs] = useState({});
    const navigate = useNavigate();

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
            await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/products`, inputs, {
                headers: { token: `Bearer ${user.accessToken}` }
            });
            toast.success("Product Created Successfully!");
            navigate('/admin/products');
        } catch (err) {
            console.error(err);
            toast.error("Failed to create product");
        }
    };

    return (
        <div>
            <div className="admin-header">
                <h1>Add New Spice</h1>
            </div>
            <div className="admin-form">
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Product Name</label>
                        <input name="name" type="text" placeholder="e.g. Kashmiri Red Chilli" onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>Description</label>
                        <textarea name="desc" rows="3" placeholder="Description of the spice..." onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>Price (₹)</label>
                        <input name="price" type="number" placeholder="500" onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>Stock Quantity</label>
                        <input name="stock" type="number" placeholder="50" onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>Category</label>
                        <select name="category" onChange={handleChange} required>
                            <option value="">Select Category</option>
                            <option value="KITCHEN ESSENTIALS">KITCHEN ESSENTIALS</option>
                            <option value="SPICES">SPICES</option>
                            <option value="SALTS">SALTS</option>
                            <option value="BLENDED MASALAS">BLENDED MASALAS</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Image URL</label>
                        <input name="img" type="text" placeholder="https://..." onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>Color Code (Hex)</label>
                        <input name="color" type="text" placeholder="#e21f26" onChange={handleChange} />
                    </div>

                    <button type="submit" className="admin-btn">Create Product</button>
                </form>
            </div>
        </div>
    );
};

export default NewProduct;
