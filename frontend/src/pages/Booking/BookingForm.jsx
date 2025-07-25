import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import './BookingForm.css';

const BookingForm = () => {
    const { serviceId } = useParams();
    const navigate = useNavigate();
    const { user, isAuthenticated } = useAuth();

    const [service, setService] = useState(null);
    const [providers, setProviders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        providerId: '',
        scheduledDate: '',
        scheduledTime: {
            start: '',
            end: ''
        },
        gameDetails: {
            gameName: '',
            platform: '',
            currentRank: '',
            targetRank: '',
            specialRequests: ''
        },
        serviceDetails: {
            description: '',
            location: 'online',
            address: {
                street: '',
                city: '',
                state: '',
                pincode: ''
            }
        },
        userNotes: ''
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (!isAuthenticated) {
            toast.error('Please login to book a service');
            navigate('/login');
            return;
        }

        fetchServiceDetails();
    }, [serviceId, isAuthenticated]);

    const fetchServiceDetails = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`/api/services/${serviceId}`);

            if (response.data.success) {
                setService(response.data.data.service);
                setProviders(response.data.data.providers);
            }
        } catch (error) {
            console.error('Fetch service details error:', error);
            toast.error('Failed to fetch service details');
            navigate('/services');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name.startsWith('gameDetails.')) {
            const field = name.split('.')[1];
            setFormData(prev => ({
                ...prev,
                gameDetails: {
                    ...prev.gameDetails,
                    [field]: value
                }
            }));
        } else if (name.startsWith('serviceDetails.')) {
            const field = name.split('.')[1];
            setFormData(prev => ({
                ...prev,
                serviceDetails: {
                    ...prev.serviceDetails,
                    [field]: value
                }
            }));
        } else if (name.startsWith('address.')) {
            const field = name.split('.')[1];
            setFormData(prev => ({
                ...prev,
                serviceDetails: {
                    ...prev.serviceDetails,
                    address: {
                        ...prev.serviceDetails.address,
                        [field]: value
                    }
                }
            }));
        } else if (name.startsWith('scheduledTime.')) {
            const field = name.split('.')[1];
            setFormData(prev => ({
                ...prev,
                scheduledTime: {
                    ...prev.scheduledTime,
                    [field]: value
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

        if (!formData.providerId) {
            newErrors.providerId = 'Please select a service provider';
        }

        if (!formData.scheduledDate) {
            newErrors.scheduledDate = 'Please select a date';
        } else {
            const selectedDate = new Date(formData.scheduledDate);
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            if (selectedDate < today) {
                newErrors.scheduledDate = 'Please select a future date';
            }
        }

        if (!formData.scheduledTime.start) {
            newErrors.startTime = 'Please select start time';
        }

        if (!formData.scheduledTime.end) {
            newErrors.endTime = 'Please select end time';
        }

        if (formData.scheduledTime.start && formData.scheduledTime.end) {
            if (formData.scheduledTime.start >= formData.scheduledTime.end) {
                newErrors.endTime = 'End time must be after start time';
            }
        }

        // Gaming coaching specific validations
        if (service?.category === 'gaming-coaching') {
            if (!formData.gameDetails.gameName) {
                newErrors.gameName = 'Please specify the game';
            }
            if (!formData.gameDetails.platform) {
                newErrors.platform = 'Please select platform';
            }
        }

        // Service location validation
        if (formData.serviceDetails.location === 'home-visit') {
            if (!formData.serviceDetails.address.city) {
                newErrors.city = 'City is required for home visits';
            }
            if (!formData.serviceDetails.address.pincode) {
                newErrors.pincode = 'Pincode is required for home visits';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            setSubmitting(true);

            const bookingData = {
                serviceId,
                ...formData
            };

            const response = await axios.post('/api/bookings', bookingData);

            if (response.data.success) {
                toast.success('Booking created successfully!');
                navigate(`/bookings/${response.data.data.booking._id}/payment`);
            }
        } catch (error) {
            console.error('Create booking error:', error);
            const message = error.response?.data?.message || 'Failed to create booking';
            toast.error(message);
        } finally {
            setSubmitting(false);
        }
    };

    const getSelectedProvider = () => {
        return providers.find(p => p._id === formData.providerId);
    };

    const calculatePrice = () => {
        const provider = getSelectedProvider();
        if (!provider || !service) return { basePrice: 0, taxes: 0, total: 0 };

        const basePrice = provider.services.find(s => s.service === serviceId)?.customPrice || service.basePrice;
        const taxes = Math.round(basePrice * 0.18);
        const total = basePrice + taxes;

        return { basePrice, taxes, total };
    };

    if (loading) {
        return (
            <div className="loading">
                <div className="spinner"></div>
            </div>
        );
    }

    if (!service) {
        return (
            <div className="container">
                <div className="error-message">
                    <h2>Service not found</h2>
                    <p>The requested service could not be found.</p>
                </div>
            </div>
        );
    }

    const pricing = calculatePrice();

    return (
        <div className="booking-form-page">
            <div className="container">
                <div className="booking-header">
                    <h1>🎮 Book Service</h1>
                    <p>Complete your booking for {service.name}</p>
                </div>

                <div className="booking-content">
                    <div className="booking-form-section">
                        <form onSubmit={handleSubmit} className="booking-form">
                            {/* Service Provider Selection */}
                            <div className="form-section">
                                <h3>Select Service Provider</h3>
                                <div className="providers-grid">
                                    {providers.map(provider => (
                                        <div
                                            key={provider._id}
                                            className={`provider-card ${formData.providerId === provider._id ? 'selected' : ''}`}
                                            onClick={() => setFormData(prev => ({ ...prev, providerId: provider._id }))}
                                        >
                                            <div className="provider-info">
                                                <div className="provider-avatar">
                                                    {provider.user.name.charAt(0).toUpperCase()}
                                                </div>
                                                <div className="provider-details">
                                                    <h4>{provider.user.name}</h4>
                                                    <div className="provider-rating">
                                                        ⭐ {provider.rating.average.toFixed(1)} ({provider.rating.count} reviews)
                                                    </div>
                                                    <div className="provider-sessions">
                                                        🎮 {provider.completedSessions} sessions completed
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="provider-price">
                                                ₹{provider.services.find(s => s.service === serviceId)?.customPrice || service.basePrice}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                {errors.providerId && (
                                    <span className="error-message">{errors.providerId}</span>
                                )}
                            </div>

                            {/* Date and Time Selection */}
                            <div className="form-section">
                                <h3>Schedule</h3>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label htmlFor="scheduledDate" className="form-label">
                                            Date
                                        </label>
                                        <input
                                            type="date"
                                            id="scheduledDate"
                                            name="scheduledDate"
                                            value={formData.scheduledDate}
                                            onChange={handleChange}
                                            min={new Date().toISOString().split('T')[0]}
                                            className={`form-input ${errors.scheduledDate ? 'error' : ''}`}
                                        />
                                        {errors.scheduledDate && (
                                            <span className="error-message">{errors.scheduledDate}</span>
                                        )}
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="scheduledTime.start" className="form-label">
                                            Start Time
                                        </label>
                                        <input
                                            type="time"
                                            id="scheduledTime.start"
                                            name="scheduledTime.start"
                                            value={formData.scheduledTime.start}
                                            onChange={handleChange}
                                            className={`form-input ${errors.startTime ? 'error' : ''}`}
                                        />
                                        {errors.startTime && (
                                            <span className="error-message">{errors.startTime}</span>
                                        )}
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="scheduledTime.end" className="form-label">
                                            End Time
                                        </label>
                                        <input
                                            type="time"
                                            id="scheduledTime.end"
                                            name="scheduledTime.end"
                                            value={formData.scheduledTime.end}
                                            onChange={handleChange}
                                            className={`form-input ${errors.endTime ? 'error' : ''}`}
                                        />
                                        {errors.endTime && (
                                            <span className="error-message">{errors.endTime}</span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Gaming Details (for coaching services) */}
                            {service.category === 'gaming-coaching' && (
                                <div className="form-section">
                                    <h3>Gaming Details</h3>
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label htmlFor="gameDetails.gameName" className="form-label">
                                                Game
                                            </label>
                                            <select
                                                id="gameDetails.gameName"
                                                name="gameDetails.gameName"
                                                value={formData.gameDetails.gameName}
                                                onChange={handleChange}
                                                className={`form-input ${errors.gameName ? 'error' : ''}`}
                                            >
                                                <option value="">Select Game</option>
                                                <option value="Valorant">Valorant</option>
                                                <option value="League of Legends">League of Legends</option>
                                                <option value="CS:GO">CS:GO</option>
                                                <option value="Dota 2">Dota 2</option>
                                                <option value="Overwatch 2">Overwatch 2</option>
                                                <option value="Apex Legends">Apex Legends</option>
                                            </select>
                                            {errors.gameName && (
                                                <span className="error-message">{errors.gameName}</span>
                                            )}
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="gameDetails.platform" className="form-label">
                                                Platform
                                            </label>
                                            <select
                                                id="gameDetails.platform"
                                                name="gameDetails.platform"
                                                value={formData.gameDetails.platform}
                                                onChange={handleChange}
                                                className={`form-input ${errors.platform ? 'error' : ''}`}
                                            >
                                                <option value="">Select Platform</option>
                                                <option value="PC">PC</option>
                                                <option value="PlayStation">PlayStation</option>
                                                <option value="Xbox">Xbox</option>
                                                <option value="Mobile">Mobile</option>
                                            </select>
                                            {errors.platform && (
                                                <span className="error-message">{errors.platform}</span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="form-row">
                                        <div className="form-group">
                                            <label htmlFor="gameDetails.currentRank" className="form-label">
                                                Current Rank (Optional)
                                            </label>
                                            <input
                                                type="text"
                                                id="gameDetails.currentRank"
                                                name="gameDetails.currentRank"
                                                value={formData.gameDetails.currentRank}
                                                onChange={handleChange}
                                                className="form-input"
                                                placeholder="e.g., Gold 2, Silver Elite"
                                            />
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="gameDetails.targetRank" className="form-label">
                                                Target Rank (Optional)
                                            </label>
                                            <input
                                                type="text"
                                                id="gameDetails.targetRank"
                                                name="gameDetails.targetRank"
                                                value={formData.gameDetails.targetRank}
                                                onChange={handleChange}
                                                className="form-input"
                                                placeholder="e.g., Platinum, Global Elite"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Service Location */}
                            <div className="form-section">
                                <h3>Service Location</h3>
                                <div className="form-group">
                                    <label htmlFor="serviceDetails.location" className="form-label">
                                        Location Type
                                    </label>
                                    <select
                                        id="serviceDetails.location"
                                        name="serviceDetails.location"
                                        value={formData.serviceDetails.location}
                                        onChange={handleChange}
                                        className="form-input"
                                    >
                                        <option value="online">Online</option>
                                        <option value="home-visit">Home Visit</option>
                                        <option value="service-center">Service Center</option>
                                    </select>
                                </div>

                                {formData.serviceDetails.location === 'home-visit' && (
                                    <div className="address-fields">
                                        <div className="form-group">
                                            <label htmlFor="address.street" className="form-label">
                                                Street Address
                                            </label>
                                            <input
                                                type="text"
                                                id="address.street"
                                                name="address.street"
                                                value={formData.serviceDetails.address.street}
                                                onChange={handleChange}
                                                className="form-input"
                                                placeholder="Enter street address"
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
                                                    value={formData.serviceDetails.address.city}
                                                    onChange={handleChange}
                                                    className={`form-input ${errors.city ? 'error' : ''}`}
                                                    placeholder="Enter city"
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
                                                    value={formData.serviceDetails.address.state}
                                                    onChange={handleChange}
                                                    className="form-input"
                                                    placeholder="Enter state"
                                                />
                                            </div>

                                            <div className="form-group">
                                                <label htmlFor="address.pincode" className="form-label">
                                                    Pincode
                                                </label>
                                                <input
                                                    type="text"
                                                    id="address.pincode"
                                                    name="address.pincode"
                                                    value={formData.serviceDetails.address.pincode}
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
                                )}
                            </div>

                            {/* Additional Notes */}
                            <div className="form-section">
                                <h3>Additional Information</h3>
                                <div className="form-group">
                                    <label htmlFor="userNotes" className="form-label">
                                        Special Requests or Notes (Optional)
                                    </label>
                                    <textarea
                                        id="userNotes"
                                        name="userNotes"
                                        value={formData.userNotes}
                                        onChange={handleChange}
                                        className="form-input"
                                        rows="4"
                                        placeholder="Any special requests or additional information..."
                                    />
                                </div>
                            </div>

                            <div className="form-actions">
                                <button
                                    type="button"
                                    onClick={() => navigate(-1)}
                                    className="btn btn-secondary"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    disabled={submitting || !formData.providerId}
                                >
                                    {submitting ? 'Creating Booking...' : `Book Now - ₹${pricing.total}`}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Booking Summary */}
                    <div className="booking-summary">
                        <div className="summary-card">
                            <h3>Booking Summary</h3>

                            <div className="service-info">
                                <h4>{service.name}</h4>
                                <p>{service.description}</p>
                                <div className="service-duration">
                                    ⏱️ Duration: {service.duration} minutes
                                </div>
                            </div>

                            {formData.providerId && (
                                <div className="provider-info">
                                    <h4>Selected Provider</h4>
                                    <div className="selected-provider">
                                        <div className="provider-name">
                                            {getSelectedProvider()?.user.name}
                                        </div>
                                        <div className="provider-rating">
                                            ⭐ {getSelectedProvider()?.rating.average.toFixed(1)}
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="pricing-breakdown">
                                <h4>Pricing</h4>
                                <div className="price-item">
                                    <span>Base Price:</span>
                                    <span>₹{pricing.basePrice}</span>
                                </div>
                                <div className="price-item">
                                    <span>Taxes (18% GST):</span>
                                    <span>₹{pricing.taxes}</span>
                                </div>
                                <div className="price-item total">
                                    <span>Total Amount:</span>
                                    <span>₹{pricing.total}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookingForm;