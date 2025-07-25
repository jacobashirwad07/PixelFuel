import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import './PaymentPage.css';

const PaymentPage = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchBookingDetails();
  }, [bookingId]);

  const fetchBookingDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/bookings/${bookingId}`);
      
      if (response.data.success) {
        setBooking(response.data.data.booking);
        
        // Redirect if already paid
        if (response.data.data.booking.paymentStatus === 'paid') {
          toast.success('Booking already paid!');
          navigate(`/bookings/${bookingId}`);
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

  const handlePayment = async () => {
    try {
      setProcessing(true);
      
      // Create payment order
      const orderResponse = await axios.post('/api/payments/create-order', {
        bookingId
      });
      
      if (!orderResponse.data.success) {
        throw new Error(orderResponse.data.message);
      }
      
      const { orderId, amount, currency, isDevelopment } = orderResponse.data.data;
      
      if (isDevelopment) {
        // Simulate payment success in development
        setTimeout(async () => {
          try {
            const verifyResponse = await axios.post('/api/payments/verify', {
              razorpay_order_id: orderId,
              razorpay_payment_id: `pay_${Date.now()}`,
              razorpay_signature: 'dev_signature',
              bookingId,
              isDevelopment: true
            });
            
            if (verifyResponse.data.success) {
              toast.success('Payment successful! (Development Mode)');
              navigate(`/bookings/${bookingId}/success`);
            }
          } catch (error) {
            toast.error('Payment verification failed');
          } finally {
            setProcessing(false);
          }
        }, 2000);
        
        return;
      }
      
      // Production Razorpay integration would go here
      // For now, we'll use development mode
      toast.info('Razorpay integration requires valid API keys');
      setProcessing(false);
      
    } catch (error) {
      console.error('Payment error:', error);
      toast.error(error.response?.data?.message || 'Payment failed');
      setProcessing(false);
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
    <div className="payment-page">
      <div className="container">
        <div className="payment-header">
          <h1>💳 Complete Payment</h1>
          <p>Secure payment for your gaming service booking</p>
        </div>

        <div className="payment-content">
          <div className="payment-details">
            <div className="booking-summary">
              <h3>Booking Summary</h3>
              
              <div className="summary-item">
                <div className="item-header">
                  <h4>🎮 {booking.service.name}</h4>
                  <div className="booking-ref">#{booking.bookingRef}</div>
                </div>
                <p className="service-category">{booking.service.category.replace('-', ' ').toUpperCase()}</p>
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
                <h4>📅 Schedule</h4>
                <div className="schedule-info">
                  <div className="schedule-date">{formatDate(booking.scheduledDate)}</div>
                  <div className="schedule-time">
                    {formatTime(booking.scheduledTime.start)} - {formatTime(booking.scheduledTime.end)}
                  </div>
                </div>
              </div>

              {booking.gameDetails?.gameName && (
                <div className="summary-item">
                  <h4>🎯 Game Details</h4>
                  <div className="game-info">
                    <div>Game: {booking.gameDetails.gameName}</div>
                    <div>Platform: {booking.gameDetails.platform}</div>
                    {booking.gameDetails.currentRank && (
                      <div>Current Rank: {booking.gameDetails.currentRank}</div>
                    )}
                    {booking.gameDetails.targetRank && (
                      <div>Target Rank: {booking.gameDetails.targetRank}</div>
                    )}
                  </div>
                </div>
              )}

              <div className="summary-item">
                <h4>📍 Service Location</h4>
                <div className="location-info">
                  {booking.serviceDetails.location === 'online' && '🌐 Online Session'}
                  {booking.serviceDetails.location === 'home-visit' && '🏠 Home Visit'}
                  {booking.serviceDetails.location === 'service-center' && '🏢 Service Center'}
                </div>
              </div>
            </div>

            <div className="pricing-card">
              <h3>💰 Payment Details</h3>
              
              <div className="price-breakdown">
                <div className="price-item">
                  <span>Service Fee:</span>
                  <span>₹{booking.price.basePrice}</span>
                </div>
                <div className="price-item">
                  <span>Taxes (18% GST):</span>
                  <span>₹{booking.price.taxes}</span>
                </div>
                <div className="price-item total">
                  <span>Total Amount:</span>
                  <span>₹{booking.price.totalPrice}</span>
                </div>
              </div>

              <div className="payment-status">
                <div className={`status-badge ${booking.paymentStatus}`}>
                  {booking.paymentStatus === 'pending' && '⏳ Payment Pending'}
                  {booking.paymentStatus === 'paid' && '✅ Payment Completed'}
                  {booking.paymentStatus === 'failed' && '❌ Payment Failed'}
                </div>
              </div>
            </div>
          </div>

          <div className="payment-actions">
            {booking.paymentStatus === 'pending' && (
              <div className="payment-buttons">
                <button
                  onClick={handlePayment}
                  disabled={processing}
                  className="btn btn-primary payment-btn"
                >
                  {processing ? (
                    <>
                      <div className="btn-spinner"></div>
                      Processing Payment...
                    </>
                  ) : (
                    <>
                      💳 Pay ₹{booking.price.totalPrice}
                    </>
                  )}
                </button>
                
                <button
                  onClick={() => navigate(`/bookings/${bookingId}`)}
                  className="btn btn-outline"
                  disabled={processing}
                >
                  View Booking Details
                </button>
              </div>
            )}

            {booking.paymentStatus === 'paid' && (
              <div className="payment-success">
                <div className="success-icon">✅</div>
                <h3>Payment Successful!</h3>
                <p>Your booking has been confirmed.</p>
                <button
                  onClick={() => navigate(`/bookings/${bookingId}`)}
                  className="btn btn-primary"
                >
                  View Booking Details
                </button>
              </div>
            )}

            <div className="security-info">
              <div className="security-badge">
                🔒 Secure Payment
              </div>
              <p>Your payment information is encrypted and secure. We use industry-standard security measures to protect your data.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;