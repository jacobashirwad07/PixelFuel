import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Services.css';

const Services = () => {
  const serviceCategories = [
    {
      id: 1,
      name: 'Gaming Coaching',
      description: 'Professional esports coaching and skill improvement',
      icon: '🎮',
      services: ['1v1 Coaching', 'Team Training', 'Rank Boosting', 'Strategy Sessions']
    },
    {
      id: 2,
      name: 'PC Building',
      description: 'Custom gaming PC builds and hardware setup',
      icon: '🖥️',
      services: ['Custom Builds', 'Hardware Installation', 'Cable Management', 'Testing']
    },
    {
      id: 3,
      name: 'Console Repair',
      description: 'Professional console and gaming hardware repair',
      icon: '🔧',
      services: ['PlayStation Repair', 'Xbox Repair', 'Controller Fix', 'Hardware Diagnosis']
    },
    {
      id: 4,
      name: 'Streaming Setup',
      description: 'Complete streaming and content creation setup',
      icon: '📹',
      services: ['OBS Configuration', 'Audio Setup', 'Lighting Setup', 'Overlay Design']
    },
    {
      id: 5,
      name: 'Gaming Optimization',
      description: 'Performance tuning and game optimization',
      icon: '⚡',
      services: ['FPS Optimization', 'Driver Updates', 'System Cleanup', 'Overclocking']
    },
    {
      id: 6,
      name: 'Tournament Organization',
      description: 'Local gaming tournaments and esports events',
      icon: '🏆',
      services: ['Event Planning', 'Bracket Management', 'Prize Distribution', 'Live Streaming']
    }
  ];

  return (
    <div className="services-page">
      <div className="container">
        <div className="services-header">
          <h1>🎮 Gaming Services</h1>
          <p>Professional gaming services and support for all your gaming needs</p>
        </div>
        
        <div className="services-grid">
          {serviceCategories.map(category => (
            <div key={category.id} className="service-category-card">
              <div className="category-icon">{category.icon}</div>
              <h3>{category.name}</h3>
              <p>{category.description}</p>
              <div className="service-list">
                {category.services.map((service, index) => (
                  <span key={index} className="service-tag">
                    {service}
                  </span>
                ))}
              </div>
              <Link to={`/services/category/${category.id}`} className="btn btn-primary category-btn">
                View Services
              </Link>
            </div>
          ))}
        </div>
        
        <div className="services-info">
          <div className="info-content">
            <h2>🎯 Why Choose Our Gaming Services?</h2>
            <div className="features-grid">
              <div className="feature-item">
                <div className="feature-icon">⚡</div>
                <h4>Fast & Reliable</h4>
                <p>Quick service delivery with guaranteed quality</p>
              </div>
              <div className="feature-item">
                <div className="feature-icon">🏆</div>
                <h4>Expert Providers</h4>
                <p>Verified professionals with proven track records</p>
              </div>
              <div className="feature-item">
                <div className="feature-icon">💰</div>
                <h4>Competitive Pricing</h4>
                <p>Best prices with transparent billing</p>
              </div>
              <div className="feature-item">
                <div className="feature-icon">🔒</div>
                <h4>Secure Payments</h4>
                <p>Safe and secure payment processing</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Services;