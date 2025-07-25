import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import './ServiceList.css';

// Dummy services for demo if API returns nothing
const dummyServicesByCategory = {
  '1': [
    {
      _id: 'd1',
      name: '1v1 Pro Coaching Session',
      description: 'Get personalized coaching from a pro gamer for 1 hour.',
      basePrice: 499,
      duration: 60,
      availableProviders: 5,
      tags: ['Coaching', '1v1', 'Pro'],
    },
    {
      _id: 'd2',
      name: 'Team Training Bootcamp',
      description: 'Intensive team training for competitive squads.',
      basePrice: 1499,
      duration: 180,
      availableProviders: 2,
      tags: ['Team', 'Training', 'Esports'],
    },
  ],
  '2': [
    {
      _id: 'd3',
      name: 'Custom Gaming PC Build',
      description: 'We build your dream gaming PC with top-tier components.',
      basePrice: 2999,
      duration: 120,
      availableProviders: 3,
      tags: ['PC', 'Build', 'Custom'],
    },
  ],
  '3': [
    {
      _id: 'd4',
      name: 'Console Repair Express',
      description: 'Fast and reliable repair for your PlayStation or Xbox.',
      basePrice: 799,
      duration: 90,
      availableProviders: 4,
      tags: ['Repair', 'Console', 'Express'],
    },
  ],
  '4': [
    {
      _id: 'd5',
      name: 'Streaming Setup Starter',
      description: 'Complete setup for your first professional stream.',
      basePrice: 999,
      duration: 60,
      availableProviders: 2,
      tags: ['Streaming', 'Setup', 'Starter'],
    },
  ],
  '5': [
    {
      _id: 'd6',
      name: 'FPS Optimization',
      description: 'Boost your game performance and frame rates.',
      basePrice: 399,
      duration: 45,
      availableProviders: 3,
      tags: ['Optimization', 'FPS', 'Performance'],
    },
  ],
  '6': [
    {
      _id: 'd7',
      name: 'Tournament Bracket Management',
      description: 'Professional bracket management for your esports event.',
      basePrice: 599,
      duration: 120,
      availableProviders: 1,
      tags: ['Tournament', 'Bracket', 'Esports'],
    },
  ],
  'all': [
    // Add a few from each for the all category
    {
      _id: 'd1',
      name: '1v1 Pro Coaching Session',
      description: 'Get personalized coaching from a pro gamer for 1 hour.',
      basePrice: 499,
      duration: 60,
      availableProviders: 5,
      tags: ['Coaching', '1v1', 'Pro'],
    },
    {
      _id: 'd3',
      name: 'Custom Gaming PC Build',
      description: 'We build your dream gaming PC with top-tier components.',
      basePrice: 2999,
      duration: 120,
      availableProviders: 3,
      tags: ['PC', 'Build', 'Custom'],
    },
    {
      _id: 'd4',
      name: 'Console Repair Express',
      description: 'Fast and reliable repair for your PlayStation or Xbox.',
      basePrice: 799,
      duration: 90,
      availableProviders: 4,
      tags: ['Repair', 'Console', 'Express'],
    },
    {
      _id: 'd5',
      name: 'Streaming Setup Starter',
      description: 'Complete setup for your first professional stream.',
      basePrice: 999,
      duration: 60,
      availableProviders: 2,
      tags: ['Streaming', 'Setup', 'Starter'],
    },
  ],
};

import { useCart } from '../../context/CartContext';

const ServiceList = () => {
  const { category } = useParams();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    minPrice: '',
    maxPrice: '',
    search: '',
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalServices: 0
  });
  const { user } = useAuth();
  const { addToCart } = useCart();

  useEffect(() => {
    fetchServices();
  }, [category, filters]);

  const fetchServices = async (page = 1) => {
    try {
      setLoading(true);
      const params = {
        page,
        limit: 12,
        ...filters
      };
      
      if (category && category !== 'all') {
        params.category = category;
      }

      const response = await axios.get('http://localhost:5001/api/services', { params });
      
      if (response.data.success) {
        setServices(response.data.data.services);
        setPagination(response.data.data.pagination);
      }
    } catch (error) {
      console.error('Fetch services error:', error);
      toast.error('Failed to fetch services');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchServices(1);
  };

  const getCategoryName = (categoryId) => {
    const categories = {
      '1': 'Gaming Coaching',
      '2': 'PC Building', 
      '3': 'Console Repair',
      '4': 'Streaming Setup',
      '5': 'Gaming Optimization',
      '6': 'Tournament Organization'
    };
    return categories[categoryId] || 'All Services';
  };

  // Use dummy services if API returns nothing
  const displayServices = services.length === 0
    ? (dummyServicesByCategory[category] || dummyServicesByCategory['all'])
    : services;

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="service-list-page">
      <div className="container">
        <div className="service-list-header">
          <h1>🎮 {getCategoryName(category)}</h1>
          <p>Find the perfect gaming service for your needs</p>
        </div>

        {/* Filters */}
        <div className="filters-section">
          <form onSubmit={handleSearch} className="filters-form">
            <div className="filter-group">
              <input
                type="text"
                name="search"
                value={filters.search}
                onChange={handleFilterChange}
                placeholder="Search services..."
                className="form-input"
              />
            </div>
            
            <div className="filter-group">
              <input
                type="number"
                name="minPrice"
                value={filters.minPrice}
                onChange={handleFilterChange}
                placeholder="Min Price"
                className="form-input"
              />
            </div>
            
            <div className="filter-group">
              <input
                type="number"
                name="maxPrice"
                value={filters.maxPrice}
                onChange={handleFilterChange}
                placeholder="Max Price"
                className="form-input"
              />
            </div>
            
            <div className="filter-group">
              <select
                name="sortBy"
                value={filters.sortBy}
                onChange={handleFilterChange}
                className="form-input"
              >
                <option value="createdAt">Newest</option>
                <option value="basePrice">Price</option>
                <option value="name">Name</option>
                <option value="duration">Duration</option>
              </select>
            </div>
            
            <button type="submit" className="btn btn-primary">
              Search
            </button>
          </form>
        </div>

        {/* Services Grid */}
        <div className="services-results">
          <div className="results-header">
            <h3>{pagination.totalServices} Services Found</h3>
          </div>
          
          {displayServices.length === 0 ? (
            <div className="no-services">
              <h3>No services found</h3>
              <p>Try adjusting your filters or search terms</p>
            </div>
          ) : (
            <div className="services-grid">
              {displayServices.map(service => (
                <div key={service._id} className="service-card">
                  <div className="service-header">
                    <h3>{service.name}</h3>
                    <div className="service-price">₹{service.basePrice}</div>
                  </div>
                  
                  <p className="service-description">{service.description}</p>
                  
                  <div className="service-details">
                    <div className="service-duration">
                      ⏱️ {service.duration} minutes
                    </div>
                    <div className="service-providers">
                      👥 {service.availableProviders} providers
                    </div>
                  </div>
                  
                  <div className="service-tags">
                    {service.tags.slice(0, 3).map((tag, index) => (
                      <span key={index} className="service-tag">
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  <div className="service-actions">
                    <button 
                      onClick={() => addToCart(service._id)}
                      className="btn btn-primary"
                    >
                      Add to Cart
                    </button>
                    <button 
                      onClick={() => addToCart(service._id)}
                      className="btn btn-outline"
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="pagination">
              <button
                onClick={() => fetchServices(pagination.currentPage - 1)}
                disabled={!pagination.hasPrev}
                className="btn btn-outline"
              >
                Previous
              </button>
              
              <span className="pagination-info">
                Page {pagination.currentPage} of {pagination.totalPages}
              </span>
              
              <button
                onClick={() => fetchServices(pagination.currentPage + 1)}
                disabled={!pagination.hasNext}
                className="btn btn-outline"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ServiceList;