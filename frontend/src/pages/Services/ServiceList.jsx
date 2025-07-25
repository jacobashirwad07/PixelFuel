import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import './ServiceList.css';

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

      const response = await axios.get('/api/services', { params });
      
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
      'gaming-coaching': 'Gaming Coaching',
      'pc-building': 'PC Building',
      'console-repair': 'Console Repair',
      'streaming-setup': 'Streaming Setup',
      'pc-optimization': 'Gaming Optimization',
      'tournament-organization': 'Tournament Organization'
    };
    return categories[categoryId] || 'All Services';
  };

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
          
          {services.length === 0 ? (
            <div className="no-services">
              <h3>No services found</h3>
              <p>Try adjusting your filters or search terms</p>
            </div>
          ) : (
            <div className="services-grid">
              {services.map(service => (
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
                    <Link 
                      to={`/services/${service._id}`} 
                      className="btn btn-outline"
                    >
                      View Details
                    </Link>
                    <Link 
                      to={`/services/${service._id}/book`} 
                      className="btn btn-primary"
                    >
                      Book Now
                    </Link>
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