import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { User, MapPin, Save, Trash2, Plus } from 'lucide-react';
import './UserProfile.css';

const UserProfile = () => {
    const [user, setUser] = useState({});
    const [activeTab, setActiveTab] = useState('profile'); // 'profile' or 'address'
    const [loading, setLoading] = useState(true);

    // Profile Form State
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: ''
    });

    // Address Form State
    const [showAddressForm, setShowAddressForm] = useState(false);
    const [newAddress, setNewAddress] = useState({
        street: '', city: '', state: '', pin: '', isDefault: false
    });

    const getAuthHeader = () => {
        const user = JSON.parse(localStorage.getItem("user"));
        return user ? { headers: { token: `Bearer ${user.accessToken}` } } : null;
    };

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const currentUser = JSON.parse(localStorage.getItem("user"));
                if (!currentUser) return;

                const res = await axios.get(`http://localhost:5000/api/users/find/${currentUser._id}`, getAuthHeader());
                setUser(res.data);
                setFormData({ username: res.data.username, email: res.data.email, password: '' });
                setLoading(false);
            } catch (err) {
                console.error(err);
                setLoading(false);
            }
        };
        fetchUser();
    }, []);

    // UPDATE PROFILE
    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        try {
            const currentUser = JSON.parse(localStorage.getItem("user"));
            const updateData = { ...formData };
            if (!updateData.password) delete updateData.password; // Don't send empty password

            const res = await axios.put(`http://localhost:5000/api/users/${currentUser._id}`, updateData, getAuthHeader());
            alert("Profile Updated Successfully!");

            // Update Local Storage (name might have changed)
            const updatedLocal = { ...currentUser, ...res.data, accessToken: currentUser.accessToken };
            localStorage.setItem("user", JSON.stringify(updatedLocal));
        } catch (err) {
            console.error(err);
            alert("Failed to update profile");
        }
    };

    // ADD ADDRESS
    const handleAddAddress = async (e) => {
        e.preventDefault();
        try {
            const currentUser = JSON.parse(localStorage.getItem("user"));
            const res = await axios.put(`http://localhost:5000/api/users/${currentUser._id}/address`, newAddress, getAuthHeader());

            setUser(prev => ({ ...prev, addresses: res.data.addresses }));
            setShowAddressForm(false);
            setNewAddress({ street: '', city: '', state: '', pin: '', isDefault: false });
            alert("Address Added!");
        } catch (err) {
            console.error(err);
            alert("Failed to add address");
        }
    };

    // DELETE ADDRESS
    const handleDeleteAddress = async (addressId) => {
        if (!window.confirm("Delete this address?")) return;
        try {
            const currentUser = JSON.parse(localStorage.getItem("user"));
            await axios.delete(`http://localhost:5000/api/users/${currentUser._id}/address/${addressId}`, getAuthHeader());

            setUser(prev => ({
                ...prev,
                addresses: prev.addresses.filter(a => a._id !== addressId)
            }));
        } catch (err) {
            console.error(err);
            alert("Failed to delete address");
        }
    };

    if (loading) return <div className="loading">Loading Profile...</div>;

    return (
        <div className="profile-container">
            <h1 className="profile-title">My Account</h1>

            <div className="profile-tabs">
                <button
                    className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
                    onClick={() => setActiveTab('profile')}
                >
                    <User size={18} /> Profile Details
                </button>
                <button
                    className={`tab-btn ${activeTab === 'address' ? 'active' : ''}`}
                    onClick={() => setActiveTab('address')}
                >
                    <MapPin size={18} /> Address Book
                </button>
            </div>

            <div className="profile-content">
                {activeTab === 'profile' && (
                    <div className="profile-form-card">
                        <h3>Edit Profile</h3>
                        <form onSubmit={handleProfileUpdate}>
                            <div className="form-group">
                                <label>Username</label>
                                <input
                                    type="text"
                                    value={formData.username}
                                    onChange={e => setFormData({ ...formData, username: e.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <label>Email</label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    disabled // Email change usually requires verification
                                    style={{ backgroundColor: '#e9ecef' }}
                                />
                            </div>
                            <div className="form-group">
                                <label>New Password (Leave blank to keep current)</label>
                                <input
                                    type="password"
                                    placeholder="********"
                                    value={formData.password}
                                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                                />
                            </div>
                            <button type="submit" className="save-btn"><Save size={16} /> Save Changes</button>
                        </form>
                    </div>
                )}

                {activeTab === 'address' && (
                    <div className="address-book-section">
                        <div className="address-header">
                            <h3>Saved Addresses</h3>
                            <button className="add-addr-btn" onClick={() => setShowAddressForm(!showAddressForm)}>
                                <Plus size={16} /> Add New
                            </button>
                        </div>

                        {showAddressForm && (
                            <form className="new-address-form" onSubmit={handleAddAddress}>
                                <input required placeholder="Street / Flat / Building" value={newAddress.street} onChange={e => setNewAddress({ ...newAddress, street: e.target.value })} />
                                <div className="row">
                                    <input required placeholder="City" value={newAddress.city} onChange={e => setNewAddress({ ...newAddress, city: e.target.value })} />
                                    <input required placeholder="State" value={newAddress.state} onChange={e => setNewAddress({ ...newAddress, state: e.target.value })} />
                                    <input required placeholder="PIN Code" value={newAddress.pin} onChange={e => setNewAddress({ ...newAddress, pin: e.target.value })} />
                                </div>
                                <label>
                                    <input type="checkbox" checked={newAddress.isDefault} onChange={e => setNewAddress({ ...newAddress, isDefault: e.target.checked })} /> Set as Default
                                </label>
                                <button type="submit" className="save-btn-small">Save Address</button>
                            </form>
                        )}

                        <div className="address-list">
                            {user.addresses && user.addresses.length > 0 ? (
                                user.addresses.map(addr => (
                                    <div key={addr._id} className={`address-card ${addr.isDefault ? 'default' : ''}`}>
                                        {addr.isDefault && <span className="default-badge">DEFAULT</span>}
                                        <p><strong>{addr.street}</strong></p>
                                        <p>{addr.city}, {addr.state} - {addr.pin}</p>
                                        <button className="delete-btn" onClick={() => handleDeleteAddress(addr._id)}>
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                ))
                            ) : (
                                <p>No addresses saved yet.</p>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserProfile;
