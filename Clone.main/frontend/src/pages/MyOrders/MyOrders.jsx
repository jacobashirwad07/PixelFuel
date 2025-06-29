import React, { useEffect, useState } from 'react';
import './MyOrders.css';

const MyOrders = () => {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('bookings') || '[]');
    setBookings(stored.reverse());
  }, []);

  return (
    <div className="my-orders-section">
      <h2>My Bookings</h2>
      {bookings.length === 0 ? (
        <p className="no-bookings">You have no bookings yet.</p>
      ) : (
        <div className="bookings-list">
          {bookings.map((b) => (
            <div className="booking-card" key={b.id}>
              <h3>{b.service}</h3>
              <p><b>Name:</b> {b.name}</p>
              <p><b>Email:</b> {b.email}</p>
              <p><b>Date:</b> {b.date}</p>
              <p><b>Time:</b> {b.time}</p>
              <p><b>Status:</b> {b.status}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrders;
