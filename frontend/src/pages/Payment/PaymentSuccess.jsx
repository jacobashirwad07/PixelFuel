import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import './PaymentSuccess.css';

const PaymentSuccess = () => {
  const { bookingId } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookingDetails();
  }, [bookingId]);

  const fetchBookingDetails = async () => {
    try {
      const response = await axios.get(`/api/bookings/${bookingId}`);
      if (response.data.success) {
        setBooking(response.data.data.booking);
      }
    } catch (error) {
      console.error('Fetch booking error:', error);
    } finally {
      setLoading(false);
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

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="payment-success-page">
      <div className="container">
        <div className="success-content">
          <div className="success-animation">
            <div className="checkmark">✓</div>
          </div>
          
          <h1>🎉 Payment Successful!</h1>
          <p className="success-message">
            Your booking has been confirmed and payment processed successfully.
          </p>

          {booking && (
            <div className="booking-details">
              <div className="detail-card">
                <h3>Booking Confirmation</h3>
                <div className="confirmation-info">
                  <div className="info-row">
                    <span className="label">Booking Reference:</span>
                    <span className="value">#{booking.bookingRef}</span>
                  </div>
                  <div className="info-row">
                    <span className="label">Service:</span>
                    <span className="value">{booking.service.name}</span>
                  </div>
                  <div className="info-row">
                    <span className="label">Provider:</span>
                    <span className="value">{booking.provider.user.name}</span>
                  </div>
                  <div className="info-row">
                    <span className="label">Date:</span>
                    <span className="value">{formatDate(booking.scheduledDate)}</span>
                  </div>
                  <div className="info-row">
                    <span className="label">Time:</span>
                    <span className="value">
                      {formatTime(booking.scheduledTime.start)} - {formatTime(booking.scheduledTime.end)}
                    </span>
                  </div>
                  <div className="info-row">
                    <span className="label">Amount Paid:</span>
                    <span className="value amount">₹{booking.price.totalPrice}</span>
                  </div>
                </div>
              </div>

              <div className="next-steps">
                <h3>What's Next?</h3>
                <div className="steps-list">
                  <div className="step">
                    <div className="step-icon">📧</div>
                    <div className="step-text">
                      <h4>Confirmation Email</h4>
                      <p>You'll receive a confirmation email with all booking details</p>
                    </div>
                  </div>
                  <div className="step">
                    <div className="step-icon">📱</div>
                    <div className="step-text">
                      <h4>Provider Contact</h4>
                      <p>Your service provider will contact you before the scheduled time</p>
                    </div>
                  </div>
                  <div className="step">
                    <div className="step-icon">🎮</div>
                    <div className="step-text">
                      <h4>Enjoy Your Service</h4>
                      <p>Get ready for an amazing gaming experience!</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="action-buttons">
            <Link to={`/bookings/${bookingId}`} className="btn btn-primary">
              View Booking Details
            </Link>
            <Link to="/bookings" className="btn btn-outline">
              My Bookings
            </Link>
            <Link to="/services" className="btn btn-outline">
              Book Another Service
            </Link>
          </div>

          <div className="support-info">
            <p>Need help? Contact our support team at support@pixelfuel.com</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;