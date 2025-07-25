import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Orders.css';

const Orders = () => {
  const navigate = useNavigate();

  return (
    <div className="orders-page">
      <div className="container">
        <div className="order-success">
          <div className="success-icon">✅</div>
          <h1>Order Placed Successfully!</h1>
          <p>Thank you for your order. We'll get in touch with you soon to schedule your services.</p>
          
          <div className="order-details">
            <h3>What happens next?</h3>
            <div className="next-steps">
              <div className="step">
                <div className="step-icon">📞</div>
                <div className="step-content">
                  <h4>Contact Confirmation</h4>
                  <p>Our team will contact you within 24 hours to confirm your order details</p>
                </div>
              </div>
              
              <div className="step">
                <div className="step-icon">📅</div>
                <div className="step-content">
                  <h4>Schedule Services</h4>
                  <p>We'll help you schedule your services at your preferred time</p>
                </div>
              </div>
              
              <div className="step">
                <div className="step-icon">🎮</div>
                <div className="step-content">
                  <h4>Service Delivery</h4>
                  <p>Enjoy your gaming services and coaching sessions!</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="order-actions">
            <button onClick={() => navigate('/services')} className="btn btn-primary">
              Browse More Services
            </button>
            <button onClick={() => navigate('/coaches')} className="btn btn-outline">
              Find More Coaches
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Orders;