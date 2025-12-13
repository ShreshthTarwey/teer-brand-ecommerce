import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './admin.css';

const Products = () => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/products`);
                setProducts(res.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchProducts();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this product?")) return;

        try {
            const user = JSON.parse(localStorage.getItem('user'));
            await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/api/products/${id}`, {
                headers: { token: `Bearer ${user.accessToken}` }
            });
            setProducts(products.filter(p => p._id !== id));
        } catch (err) {
            console.error("Delete failed", err);
            alert("Failed to delete product");
        }
    };

    const handleStockUpdate = async (id, newStock) => {
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            // Backend PATCH logic (Assuming backend route exists or reusing PUT)
            // Typically PUT /api/products/:id expects full object, but we can try just sending stock if backend supports partial update OR we fetch-modify-save.
            // But a quicker way for now is to trust our Product PUT route.
            // Let's check Product PUT route... (I'll assume standard PUT updates fields provided)

            await axios.put(`${import.meta.env.VITE_API_BASE_URL}/api/products/${id}`,
                { stock: newStock },
                { headers: { token: `Bearer ${user.accessToken}` } }
            );

            setProducts(products.map(p => p._id === id ? { ...p, stock: newStock } : p));
        } catch (err) {
            console.error(err);
            alert("Failed to update stock");
        }
    };

    return (
        <div>
            <div className="admin-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1>Products</h1>
                <Link to="/admin/new-product">
                    <button className="admin-btn">+ Add New Spice</button>
                </Link>
            </div>
            <div className="admin-table-container">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Image</th>
                            <th>Name</th>
                            <th>Category</th>
                            <th>Stock</th>
                            <th>Price</th>
                            <th>Color</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((product) => (
                            <tr key={product._id}>
                                <td>
                                    <img src={product.img} alt="" style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} />
                                </td>
                                <td>{product.name}</td>
                                <td>{product.category}</td>
                                <td style={{ width: '100px' }}>
                                    <input
                                        type="number"
                                        value={product.stock}
                                        min="0"
                                        onChange={(e) => {
                                            const val = parseInt(e.target.value);
                                            setProducts(products.map(p => p._id === product._id ? { ...p, stock: val } : p));
                                        }}
                                        onBlur={(e) => handleStockUpdate(product._id, parseInt(e.target.value))}
                                        style={{
                                            width: '60px',
                                            padding: '4px',
                                            border: '1px solid #ddd',
                                            borderRadius: '4px',
                                            textAlign: 'center'
                                        }}
                                    />
                                </td>
                                <td>₹{product.price}</td>
                                <td>
                                    <div style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: product.color || '#ccc' }}></div>
                                </td>
                                <td>
                                    <Link to={`/admin/product/${product._id}`}>
                                        <button className="action-btn" style={{ backgroundColor: '#d1ecf1', color: '#0c5460' }}>Edit</button>
                                    </Link>
                                    <button className="action-btn btn-delete" onClick={() => handleDelete(product._id)}>
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Products;
