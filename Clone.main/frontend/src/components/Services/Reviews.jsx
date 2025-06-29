import React, { useEffect, useState } from 'react';
import './Reviews.css';

const services = [
  'PC Cleaning',
  'Gaming PC Upgrade',
  'Custom Gaming Setup',
];

const dummyReviews = [
  {
    service: 'PC Cleaning',
    rating: 5,
    text: 'Excellent service! My PC runs like new.',
    date: '2024-06-28 10:00 AM',
  },
  {
    service: 'Gaming PC Upgrade',
    rating: 4,
    text: 'Upgrade was quick and smooth. Recommended.',
    date: '2024-06-27 3:30 PM',
  },
  {
    service: 'Custom Gaming Setup',
    rating: 5,
    text: 'Amazing custom setup, fits my room perfectly!',
    date: '2024-06-26 7:45 PM',
  },
];

const getAllReviews = () => {
  let all = [];
  services.forEach(service => {
    const reviews = JSON.parse(localStorage.getItem(`reviews-${service}`) || '[]');
    all = all.concat(reviews.map(r => ({ ...r, service })));
  });
  return all;
};

const Reviews = () => {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    // Add dummy reviews if none exist
    let hasAny = false;
    services.forEach(service => {
      if (localStorage.getItem(`reviews-${service}`)) hasAny = true;
    });
    if (!hasAny) {
      dummyReviews.forEach(r => {
        localStorage.setItem(
          `reviews-${r.service}`,
          JSON.stringify([r])
        );
      });
    }
    setReviews(getAllReviews());
  }, []);

  return (
    <div className="reviews-section">
      <h2>Customer Reviews</h2>
      {reviews.length === 0 ? (
        <p className="no-reviews">No reviews yet.</p>
      ) : (
        <div className="reviews-list">
          {reviews.map((rev, i) => (
            <div className="review-card" key={i}>
              <div className="review-header">
                <span className="review-service">{rev.service}</span>
                <span className="review-stars">{'★'.repeat(rev.rating)}{'☆'.repeat(5-rev.rating)}</span>
                <span className="review-date">{rev.date}</span>
              </div>
              <p className="review-text">{rev.text}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Reviews;
