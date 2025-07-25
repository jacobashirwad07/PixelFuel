import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import './Profile.css';

const Profile = () => {
  const { user, updateProfile, loading } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    address: {
      street: user?.address?.street || '',
      city: user?.address?.city || '',
      state: user?.address?.state || '',
      pincode: user?.address?.pincode || ''
    }
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.startsWith('address.')) {
      const addressField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!formData.phone) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[0-9]{10}$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }

    if (!formData.address.city.trim()) {
      newErrors.city = 'City is required';
    }

    if (!formData.address.state.trim()) {
      newErrors.state = 'State is required';
    }

    if (!formData.address.pincode.trim()) {
      newErrors.pincode = 'Pincode is required';
    } else if (!/^[0-9]{6}$/.test(formData.address.pincode)) {
      newErrors.pincode = 'Please enter a valid 6-digit pincode';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const result = await updateProfile(formData);
    
    if (result.success) {
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      phone: user?.phone || '',
      address: {
        street: user?.address?.street || '',
        city: user?.address?.city || '',
        state: user?.address?.state || '',
        pincode: user?.address?.pincode || ''
      }
    });
    setErrors({});
    setIsEditing(false);
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  const getRoleDisplay = (role) => {
    switch (role) {
      case 'coach':
        return { name: 'Gaming Coach', icon: '🎮', color: '#28a745' };
      case 'service-provider':
        return { name: 'Service Provider', icon: '🔧', color: '#007bff' };
      case 'admin':
        return { name: 'Administrator', icon: '👑', color: '#dc3545' };
      default:
        return { name: 'Gamer', icon: '🎯', color: '#6f42c1' };
    }
  };

  const roleInfo = getRoleDisplay(user?.role);

  return (
    <div className="profile-page">
      <div className="container">
        <div className="profile-header">
          <h1>🎮 Gamer Profile</h1>
          <p>Manage your gaming account and preferences</p>
        </div>

        <div className="profile-content">
          <div className="profile-card">
            <div className="profile-info">
              <div className="profile-avatar">
                <div className="avatar-placeholder" style={{ background: roleInfo.color }}>
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
              </div>
              <div className="profile-details">
                <h2>{user?.name}</h2>
                <p className="profile-email">{user?.email}</p>
                <span className="profile-role" style={{ background: roleInfo.color }}>
                  {roleInfo.icon} {roleInfo.name}
                </span>
                <div className="profile-status">
                  <span className={`status-badge ${user?.isVerified ? 'verified' : 'unverified'}`}>
                    {user?.isVerified ? '✓ Verified Gamer' : '⚠ Unverified Account'}
                  </span>
                </div>
              </div>
            </div>

            {!isEditing ? (
              <div className="profile-view">
                <div className="info-section">
                  <h3>🎯 Gaming Information</h3>
                  <div className="info-grid">
                    <div className="info-item">
                      <label>Phone Number</label>
                      <span>{user?.phone || 'Not provided'}</span>
                    </div>
                    <div className="info-item">
                      <label>Account Type</label>
                      <span>{roleInfo.name}</span>
                    </div>
                  </div>
                </div>

                <div className="info-section">
                  <h3>📍 Location</h3>
                  <div className="info-grid">
                    <div className="info-item">
                      <label>Street</label>
                      <span>{user?.address?.street || 'Not provided'}</span>
                    </div>
                    <div className="info-item">
                      <label>City</label>
                      <span>{user?.address?.city || 'Not provided'}</span>
                    </div>
                    <div className="info-item">
                      <label>State</label>
                      <span>{user?.address?.state || 'Not provided'}</span>
                    </div>
                    <div className="info-item">
                      <label>Pincode</label>
                      <span>{user?.address?.pincode || 'Not provided'}</span>
                    </div>
                  </div>
                </div>

                <div className="profile-actions">
                  <button 
                    onClick={() => setIsEditing(true)}
                    className="btn btn-primary"
                  >
                    Edit Profile
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="profile-edit">
                <div className="info-section">
                  <h3>🎯 Gaming Information</h3>
                  <div className="form-group">
                    <label htmlFor="name" className="form-label">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`form-input ${errors.name ? 'error' : ''}`}
                      placeholder="Enter your full name"
                    />
                    {errors.name && (
                      <span className="error-message">{errors.name}</span>
                    )}
                  </div>

                  <div className="form-group">
                    <label htmlFor="phone" className="form-label">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className={`form-input ${errors.phone ? 'error' : ''}`}
                      placeholder="10-digit phone number"
                    />
                    {errors.phone && (
                      <span className="error-message">{errors.phone}</span>
                    )}
                  </div>
                </div>

                <div className="info-section">
                  <h3>📍 Location</h3>
                  <div className="form-group">
                    <label htmlFor="address.street" className="form-label">
                      Street Address
                    </label>
                    <input
                      type="text"
                      id="address.street"
                      name="address.street"
                      value={formData.address.street}
                      onChange={handleChange}
                      className="form-input"
                      placeholder="Enter your street address"
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="address.city" className="form-label">
                        City
                      </label>
                      <input
                        type="text"
                        id="address.city"
                        name="address.city"
                        value={formData.address.city}
                        onChange={handleChange}
                        className={`form-input ${errors.city ? 'error' : ''}`}
                        placeholder="Enter your city"
                      />
                      {errors.city && (
                        <span className="error-message">{errors.city}</span>
                      )}
                    </div>

                    <div className="form-group">
                      <label htmlFor="address.state" className="form-label">
                        State
                      </label>
                      <input
                        type="text"
                        id="address.state"
                        name="address.state"
                        value={formData.address.state}
                        onChange={handleChange}
                        className={`form-input ${errors.state ? 'error' : ''}`}
                        placeholder="Enter your state"
                      />
                      {errors.state && (
                        <span className="error-message">{errors.state}</span>
                      )}
                    </div>

                    <div className="form-group">
                      <label htmlFor="address.pincode" className="form-label">
                        Pincode
                      </label>
                      <input
                        type="text"
                        id="address.pincode"
                        name="address.pincode"
                        value={formData.address.pincode}
                        onChange={handleChange}
                        className={`form-input ${errors.pincode ? 'error' : ''}`}
                        placeholder="6-digit pincode"
                      />
                      {errors.pincode && (
                        <span className="error-message">{errors.pincode}</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="profile-actions">
                  <button 
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button 
                    type="button"
                    onClick={handleCancel}
                    className="btn btn-secondary"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;