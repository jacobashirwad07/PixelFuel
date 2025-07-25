import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import './Coaches.css';

const Coaches = () => {
  const [coaches, setCoaches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    specialization: '',
    minRate: '',
    maxRate: ''
  });
  const { user } = useAuth();

  useEffect(() => {
    fetchCoaches();
  }, [filters]);

  const fetchCoaches = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5001/api/coaches', {
        params: filters
      });
      
      if (response.data.success) {
        setCoaches(response.data.data);
      }
    } catch (error) {
      console.error('Fetch coaches error:', error);
      toast.error('Failed to fetch coaches');
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

  const addToCart = async (coachId) => {
    if (!user) {
      toast.error('Please login to add items to cart');
      return;
    }

    try {
      const response = await axios.post(`http://localhost:5001/api/cart/${user.email}/add`, {
        coachId,
        quantity: 1
      });

      if (response.data.success) {
        toast.success('Coach added to cart!');
      }
    } catch (error) {
      console.error('Add to cart error:', error);
      toast.error('Failed to add coach to cart');
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="coaches-page">
      <div className="container">
        <div className="coaches-header">
          <h1>🏆 Gaming Coaches</h1>
          <p>Find expert gaming coaches to improve your skills and climb the ranks</p>
        </div>

        {/* Filters */}
        <div className="filters-section">
          <div className="filters-form">
            <div className="filter-group">
              <select
                name="specialization"
                value={filters.specialization}
                onChange={handleFilterChange}
                className="form-input"
              >
                <option value="">All Specializations</option>
                <option value="FPS">FPS Games</option>
                <option value="MOBA">MOBA Games</option>
                <option value="Battle Royale">Battle Royale</option>
                <option value="PC Optimization">PC Optimization</option>
              </select>
            </div>
            
            <div className="filter-group">
              <input
                type="number"
                name="minRate"
                value={filters.minRate}
                onChange={handleFilterChange}
                placeholder="Min Rate (₹/hour)"
                className="form-input"
              />
            </div>
            
            <div className="filter-group">
              <input
                type="number"
                name="maxRate"
                value={filters.maxRate}
                onChange={handleFilterChange}
                placeholder="Max Rate (₹/hour)"
                className="form-input"
              />
            </div>
          </div>
        </div>

        {/* Coaches Grid */}
        <div className="coaches-grid">
          {coaches.map(coach => (
            <div key={coach._id} className="coach-card">
              <div className="coach-image">
                <img src={coach.image} alt={coach.name} />
                <div className="coach-rating">
                  ⭐ {coach.rating}
                </div>
              </div>
              
              <div className="coach-info">
                <h3>{coach.name}</h3>
                <div className="coach-specialization">
                  🎮 {coach.specialization}
                </div>
                <div className="coach-experience">
                  📅 {coach.experience} experience
                </div>
                <div className="coach-rate">
                  💰 ₹{coach.hourlyRate}/hour
                </div>
                
                <div className="coach-games">
                  <h4>Games:</h4>
                  <div className="games-list">
                    {coach.games.map((game, index) => (
                      <span key={index} className="game-tag">
                        {game}
                      </span>
                    ))}
                  </div>
                </div>
                
                <p className="coach-bio">{coach.bio}</p>
                
                <div className="coach-availability">
                  🕒 {coach.availability}
                </div>
                
                <div className="coach-actions">
                  <button 
                    onClick={() => addToCart(coach._id)}
                    className="btn btn-primary"
                  >
                    Add to Cart
                  </button>
                  <button className="btn btn-outline">
                    View Profile
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {coaches.length === 0 && (
          <div className="no-coaches">
            <h3>No coaches found</h3>
            <p>Try adjusting your filters</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Coaches;