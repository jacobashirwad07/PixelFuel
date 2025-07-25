import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import './ReviewForm.css';

const ReviewForm = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    rating: 0,
    review: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchBookingDetails();
  }, [bookingId]);

  const fetchBookingDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/bookings/${bookingId}`);
      
      if (response.data.success) {
        const bookingData = response.data.data.booking;
        setBooking(bookingData);
        
        // Check if booking can be reviewed
        if (bookingData.status !== 'completed') {
          toast.error('Only completed bookings can be reviewed');
          navigate('/bookings');
          return;
        }
        
        if (bookingData.rating?.score) {
          toast.info('This booking has already been reviewed');
          navigate(`/bookings/${bookingId}`);
          return;
        }
      }
    } catch (error) {
      console.error('Fetch booking error:', error);
      toast.error('Failed to fetch booking details');
      navigate('/bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleRatingClick = (rating) => {
    setFormData(prev => ({ ...prev, rating }));
    if (errors.rating) {
      setErrors(prev => ({ ...prev, rating: '' }));
    }
  };

  const handleReviewChange = (e) => {
    const { value } = e.target;
    setFormData(prev => ({ ...prev, review: value }));
    if (errors.review) {
      setErrors(prev => ({ ...prev, review: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.rating || formData.rating < 1 || formData.rating > 5) {
      newErrors.rating = 'Please select a rating from 1 to 5 stars';
    }

    if (!formData.review.trim()) {
      newErrors.review = 'Please write a review';
    } else if (formData.review.trim().length < 10) {
      newErrors.review = 'Review must be at least 10 characters long';
    } else if (formData.review.trim().length > 500) {
      newErrors.review = 'Review cannot exceed 500 characters';
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
      
      const response = await axios.post(`/api/bookings/${bookingId}/rate`, {
        rating: formData.rating,
        review: formData.review.trim()
      });

      if (response.data.success) {
        toast.success('Review submitted successfully!');
        navigate('/bookings');
      }
    } catch (error) {
      console.error('Submit review error:', error);
      toast.error(error.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const getRatingText = (rating) => {
    const texts = {
      1: 'Poor - Very unsatisfied',
      2: 'Fair - Below expectations',
      3: 'Good - Met expectations',
      4: 'Very Good - Exceeded expectations',
      5: 'Excellent - Outstanding service'
    };
    return texts[rating] || 'Select a rating';
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="container">
        <div className="error-message">
          <h2>Booking not found</h2>
          <p>The requested booking could not be found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="review-form-page">
      <div className="container">
        <div className="review-header">
          <h1>⭐ Rate & Review</h1>
          <p>Share your experience with this gaming service</p>
        </div>

        <div className="review-content">
          <div className="booking-summary">
            <h3>Service Details</h3>
            
            <div className="summary-item">
              <div className="service-info">
                <h4>🎮 {booking.service.name}</h4>
                <p className="service-category">
                  {booking.service.category.replace('-', ' ').toUpperCase()}
                </p>
              </div>
              <div className="booking-ref">#{booking.bookingRef}</div>
            </div>

            <div className="summary-item">
              <h4>👨‍💻 Service Provider</h4>
              <div className="provider-info">
                <div className="provider-name">{booking.provider.user.name}</div>
                <div className="provider-rating">
                  ⭐ {booking.provider.rating.average.toFixed(1)} ({booking.provider.rating.count} reviews)
                </div>
              </div>
            </div>

            <div className="summary-item">
              <h4>📅 Session Details</h4>
              <div className="session-info">
                <div>Date: {formatDate(booking.scheduledDate)}</div>
                <div>Time: {formatTime(booking.scheduledTime.start)} - {formatTime(booking.scheduledTime.end)}</div>
                <div>Duration: {booking.duration} minutes</div>
              </div>
            </div>

            {booking.gameDetails?.gameName && (
              <div className="summary-item">
                <h4>🎯 Game Details</h4>
                <div className="game-info">
                  <div>Game: {booking.gameDetails.gameName}</div>
                  <div>Platform: {booking.gameDetails.platform}</div>
                  {booking.gameDetails.currentRank && (
                    <div>Your Rank: {booking.gameDetails.currentRank}</div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="review-form-section">
            <form onSubmit={handleSubmit} className="review-form">
              <div className="rating-section">
                <h3>How would you rate this service?</h3>
                <div className="star-rating">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => handleRatingClick(star)}
                      className={`star ${formData.rating >= star ? 'active' : ''}`}
                    >
                      ⭐
                    </button>
                  ))}
                </div>
                <div className="rating-text">
                  {getRatingText(formData.rating)}
                </div>
                {errors.rating && (
                  <span className="error-message">{errors.rating}</span>
                )}
              </div>

              <div className="review-section">
                <h3>Write your review</h3>
                <textarea
                  value={formData.review}
                  onChange={handleReviewChange}
                  placeholder="Share your experience with this gaming service. What did you like? How was the provider's expertise? Would you recommend this service to other gamers?"
                  className={`review-textarea ${errors.review ? 'error' : ''}`}
                  rows="6"
                />
                <div className="character-count">
                  {formData.review.length}/500 characters
                </div>
                {errors.review && (
                  <span className="error-message">{errors.review}</span>
                )}
              </div>

              <div className="review-guidelines">
                <h4>Review Guidelines</h4>
                <ul>
                  <li>Be honest and constructive in your feedback</li>
                  <li>Focus on the service quality and provider's expertise</li>
                  <li>Mention specific aspects like communication, punctuality, and results</li>
                  <li>Avoid personal attacks or inappropriate language</li>
                  <li>Help other gamers make informed decisions</li>
                </ul>
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  onClick={() => navigate('/bookings')}
                  className="btn btn-secondary"
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={submitting || !formData.rating}
                >
                  {submitting ? (
                    <>
                      <div className="btn-spinner"></div>
                      Submitting Review...
                    </>
                  ) : (
                    'Submit Review'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewForm;