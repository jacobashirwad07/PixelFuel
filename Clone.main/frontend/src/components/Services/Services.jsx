import React, { useState, useContext, useEffect } from 'react';
import './Services.css';
import StoreFinderModal from './StoreFinderModal';
import { StoreContext } from '../../Context/StoreContext';

const services = [
  {
    name: 'PC Cleaning',
    description: 'Professional cleaning for your PC to keep it running cool and fast.',
  },
  {
    name: 'Gaming PC Upgrade',
    description: 'Upgrade your RAM, SSD, GPU, or CPU for the best gaming experience.',
  },
  {
    name: 'Custom Gaming Setup',
    description: 'Get a custom gaming setup tailored to your needs and space.',
  },
];

const getReviews = (serviceName) => {
  return JSON.parse(localStorage.getItem(`reviews-${serviceName}`) || '[]');
};
const saveReview = (serviceName, review) => {
  const reviews = getReviews(serviceName);
  reviews.push(review);
  localStorage.setItem(`reviews-${serviceName}`, JSON.stringify(reviews));
};

const Services = () => {
  const { token } = useContext(StoreContext);
  const [showModal, setShowModal] = useState(false);
  const [selectedService, setSelectedService] = useState('');
  const [form, setForm] = useState({ name: '', email: '', date: '', time: '' });
  const [confirmation, setConfirmation] = useState('');
  const [showStoreFinder, setShowStoreFinder] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [reviewModal, setReviewModal] = useState({ open: false, service: '', rating: 5, text: '' });
  const [refresh, setRefresh] = useState(false); // to force re-render after review

  // Force re-render when reviews change
  useEffect(() => {
    // This effect will run whenever refresh changes
  }, [refresh]);

  const openModal = (service) => {
    if (!token) {
      setShowLoginPrompt(true);
      return;
    }
    setSelectedService(service);
    setShowModal(true);
    setForm({ name: '', email: '', date: '', time: '' });
    setConfirmation('');
  };

  const closeModal = () => {
    setShowModal(false);
    setConfirmation('');
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const booking = { ...form, service: selectedService, status: 'Pending', id: Date.now() };
    const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    bookings.push(booking);
    localStorage.setItem('bookings', JSON.stringify(bookings));
    setConfirmation('Booking confirmed! You can track your order in My Bookings.');
    setForm({ name: '', email: '', date: '', time: '' });
  };

  // Review logic
  const openReviewModal = (service) => {
    if (!token) {
      setShowLoginPrompt(true);
      return;
    }
    setReviewModal({ open: true, service, rating: 5, text: '' });
  };
  
  const closeReviewModal = () => {
    setReviewModal({ open: false, service: '', rating: 5, text: '' });
  };
  
  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!reviewModal.text.trim()) return;
    saveReview(reviewModal.service, {
      rating: reviewModal.rating,
      text: reviewModal.text,
      date: new Date().toLocaleString(),
    });
    closeReviewModal();
    setRefresh(r => !r); // force re-render
  };

  return (
    <div className="services-section">
      <h2>Our Services</h2>
      <div className="services-list">
        {services.map((service, idx) => {
          const reviews = getReviews(service.name);
          
          return (
            <div className="service-card" key={idx}>
              <h3>{service.name}</h3>
              <p>{service.description}</p>
              <button className="book-btn" onClick={() => openModal(service.name)}>Book Service</button>
              <button className="map-btn" onClick={() => setShowStoreFinder(true)}>Find Nearest Store</button>
              <button className="add-review-btn" onClick={() => openReviewModal(service.name)}>Add a Review</button>
            </div>
          );
        })}
      </div>
      
      {showModal && (
        <div className="booking-modal-overlay">
          <div className="booking-modal">
            <button className="close-modal" onClick={closeModal}>×</button>
            <h3>Book {selectedService}</h3>
            {confirmation ? (
              <div className="booking-confirmation">{confirmation}</div>
            ) : (
              <form onSubmit={handleSubmit} className="booking-form">
                <input name="name" value={form.name} onChange={handleChange} placeholder="Your Name" required />
                <input name="email" value={form.email} onChange={handleChange} placeholder="Your Email" type="email" required />
                <input name="date" value={form.date} onChange={handleChange} type="date" required />
                <input name="time" value={form.time} onChange={handleChange} type="time" required />
                <button type="submit" className="book-btn">Confirm Booking</button>
              </form>
            )}
          </div>
        </div>
      )}
      {showStoreFinder && <StoreFinderModal onClose={() => setShowStoreFinder(false)} />}
      {showLoginPrompt && (
        <div className="booking-modal-overlay">
          <div className="booking-modal">
            <h3>Please log in to book a service or leave a review.</h3>
            <button className="book-btn" onClick={() => window.setShowLogin && window.setShowLogin(true)}>Sign In</button>
            <button className="map-btn" onClick={() => setShowLoginPrompt(false)}>Cancel</button>
          </div>
        </div>
      )}
      {reviewModal.open && (
        <div className="booking-modal-overlay">
          <div className="booking-modal">
            <button className="close-modal" onClick={closeReviewModal}>×</button>
            <h3>Leave a Review for {reviewModal.service}</h3>
            <form onSubmit={handleReviewSubmit} className="review-form">
              <div className="review-stars-select">
                {[1,2,3,4,5].map(star => (
                  <span
                    key={star}
                    className={reviewModal.rating >= star ? 'star selected' : 'star'}
                    onClick={() => setReviewModal(r => ({ ...r, rating: star }))}
                  >★</span>
                ))}
              </div>
              <textarea
                value={reviewModal.text}
                onChange={e => setReviewModal(r => ({ ...r, text: e.target.value }))}
                placeholder="Write your review..."
                required
                rows={3}
                style={{resize:'vertical'}}
              />
              <button type="submit" className="book-btn">Submit Review</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Services;
