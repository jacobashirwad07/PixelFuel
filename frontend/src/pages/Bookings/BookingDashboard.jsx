import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import './BookingDashboard.css';

const BookingDashboard = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalBookings: 0
  });

  useEffect(() => {
    fetchBookings();
  }, [activeTab]);

  const fetchBookings = async (page = 1) => {
    try {
      setLoading(true);
      const params = {
        page,
        limit: 10,
        sortBy: 'createdAt',
        sortOrder: 'desc'
      };

      if (activeTab !== 'all') {
        params.status = activeTab;
      }

      const endpoint = user?.role === 'coach' || user?.role === 'service-provider' 
        ? '/api/bookings/provider' 
        : '/api/bookings/user';

      const response = await axios.get(endpoint, { params });
      
      if (response.data.success) {
        setBookings(response.data.data.bookings);
        setPagination(response.data.data.pagination);
      }
    } catch (error) {
      console.error('Fetch bookings error:', error);
      toast.error('Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (bookingId, newStatus) => {
    try {
      const response = await axios.put(`/api/bookings/${bookingId}/status`, {
        status: newStatus
      });

      if (response.data.success) {
        toast.success(`Booking ${newStatus} successfully`);
        fetchBookings();
      }
    } catch (error) {
      console.error('Update status error:', error);
      toast.error(error.response?.data?.message || 'Failed to update booking status');
    }
  };

  const handleCancelBooking = async (bookingId, reason) => {
    try {
      const response = await axios.put(`/api/bookings/${bookingId}/cancel`, {
        reason
      });

      if (response.data.success) {
        toast.success('Booking cancelled successfully');
        fetchBookings();
      }
    } catch (error) {
      console.error('Cancel booking error:', error);
      toast.error(error.response?.data?.message || 'Failed to cancel booking');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'pending': '#ffc107',
      'confirmed': '#007bff',
      'in-progress': '#17a2b8',
      'completed': '#28a745',
      'cancelled': '#dc3545',
      'refunded': '#6c757d'
    };
    return colors[status] || '#6c757d';
  };

  const getStatusActions = (booking) => {
    const isProvider = user?.role === 'coach' || user?.role === 'service-provider';
    const isUser = !isProvider;

    switch (booking.status) {
      case 'pending':
        return isProvider ? (
          <div className="status-actions">
            <button
              onClick={() => handleStatusUpdate(booking._id, 'confirmed')}
              className="btn btn-sm btn-success"
            >
              Accept
            </button>
            <button
              onClick={() => handleCancelBooking(booking._id, 'Provider unavailable')}
              className="btn btn-sm btn-danger"
            >
              Decline
            </button>
          </div>
        ) : (
          <button
            onClick={() => handleCancelBooking(booking._id, 'User cancellation')}
            className="btn btn-sm btn-outline"
          >
            Cancel
          </button>
        );

      case 'confirmed':
        return isProvider ? (
          <button
            onClick={() => handleStatusUpdate(booking._id, 'in-progress')}
            className="btn btn-sm btn-primary"
          >
            Start Session
          </button>
        ) : (
          <button
            onClick={() => handleCancelBooking(booking._id, 'User cancellation')}
            className="btn btn-sm btn-outline"
          >
            Cancel
          </button>
        );

      case 'in-progress':
        return isProvider ? (
          <button
            onClick={() => handleStatusUpdate(booking._id, 'completed')}
            className="btn btn-sm btn-success"
          >
            Mark Complete
          </button>
        ) : (
          <span className="status-text">Session in progress...</span>
        );

      case 'completed':
        return isUser && !booking.rating?.score ? (
          <Link
            to={`/bookings/${booking._id}/review`}
            className="btn btn-sm btn-primary"
          >
            Rate & Review
          </Link>
        ) : (
          <span className="status-text">Completed</span>
        );

      default:
        return null;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
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

  const tabs = [
    { id: 'all', label: 'All Bookings', count: pagination.totalBookings },
    { id: 'pending', label: 'Pending', count: 0 },
    { id: 'confirmed', label: 'Confirmed', count: 0 },
    { id: 'completed', label: 'Completed', count: 0 },
    { id: 'cancelled', label: 'Cancelled', count: 0 }
  ];

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="booking-dashboard">
      <div className="container">
        <div className="dashboard-header">
          <h1>🎮 My Bookings</h1>
          <p>Manage your gaming service bookings</p>
        </div>

        {/* Tabs */}
        <div className="booking-tabs">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
            >
              {tab.label}
              {tab.count > 0 && <span className="tab-count">{tab.count}</span>}
            </button>
          ))}
        </div>

        {/* Bookings List */}
        <div className="bookings-list">
          {bookings.length === 0 ? (
            <div className="no-bookings">
              <div className="no-bookings-icon">📅</div>
              <h3>No bookings found</h3>
              <p>You haven't made any bookings yet.</p>
              <Link to="/services" className="btn btn-primary">
                Browse Services
              </Link>
            </div>
          ) : (
            <>
              {bookings.map(booking => (
                <div key={booking._id} className="booking-card">
                  <div className="booking-header">
                    <div className="booking-info">
                      <h3>{booking.service.name}</h3>
                      <div className="booking-ref">#{booking.bookingRef}</div>
                    </div>
                    <div 
                      className="booking-status"
                      style={{ backgroundColor: getStatusColor(booking.status) }}
                    >
                      {booking.status.replace('-', ' ').toUpperCase()}
                    </div>
                  </div>

                  <div className="booking-details">
                    <div className="detail-item">
                      <span className="detail-label">
                        {user?.role === 'coach' || user?.role === 'service-provider' ? 'Customer:' : 'Provider:'}
                      </span>
                      <span className="detail-value">
                        {user?.role === 'coach' || user?.role === 'service-provider' 
                          ? booking.user.name 
                          : booking.provider.user.name}
                      </span>
                    </div>

                    <div className="detail-item">
                      <span className="detail-label">Date:</span>
                      <span className="detail-value">{formatDate(booking.scheduledDate)}</span>
                    </div>

                    <div className="detail-item">
                      <span className="detail-label">Time:</span>
                      <span className="detail-value">
                        {formatTime(booking.scheduledTime.start)} - {formatTime(booking.scheduledTime.end)}
                      </span>
                    </div>

                    <div className="detail-item">
                      <span className="detail-label">Amount:</span>
                      <span className="detail-value price">₹{booking.price.totalPrice}</span>
                    </div>

                    {booking.gameDetails?.gameName && (
                      <div className="detail-item">
                        <span className="detail-label">Game:</span>
                        <span className="detail-value">
                          {booking.gameDetails.gameName} ({booking.gameDetails.platform})
                        </span>
                      </div>
                    )}

                    {booking.rating?.score && (
                      <div className="detail-item">
                        <span className="detail-label">Rating:</span>
                        <span className="detail-value">
                          {'⭐'.repeat(booking.rating.score)} ({booking.rating.score}/5)
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="booking-actions">
                    {getStatusActions(booking)}
                    <Link
                      to={`/bookings/${booking._id}`}
                      className="btn btn-sm btn-outline"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              ))}

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="pagination">
                  <button
                    onClick={() => fetchBookings(pagination.currentPage - 1)}
                    disabled={!pagination.hasPrev}
                    className="btn btn-outline"
                  >
                    Previous
                  </button>
                  
                  <span className="pagination-info">
                    Page {pagination.currentPage} of {pagination.totalPages}
                  </span>
                  
                  <button
                    onClick={() => fetchBookings(pagination.currentPage + 1)}
                    disabled={!pagination.hasNext}
                    className="btn btn-outline"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingDashboard;