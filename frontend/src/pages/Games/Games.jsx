import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Games.css';

const Games = () => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    genre: '',
    platform: '',
    priceRange: '',
    search: ''
  });

  // Mock games data for now
  const mockGames = [
    {
      id: 1,
      title: 'Cyberpunk 2077',
      description: 'An open-world, action-adventure RPG set in the dark future of Night City.',
      genre: 'RPG',
      platform: ['PC', 'PlayStation', 'Xbox'],
      price: 2999,
      discountPrice: 1999,
      image: '🌃',
      rating: 4.2,
      developer: 'CD Projekt Red',
      releaseDate: '2020-12-10',
      tags: ['Open World', 'Cyberpunk', 'Action', 'RPG']
    },
    {
      id: 2,
      title: 'Elden Ring',
      description: 'A fantasy action-RPG adventure set within a world created by Hidetaka Miyazaki and George R.R. Martin.',
      genre: 'Action RPG',
      platform: ['PC', 'PlayStation', 'Xbox'],
      price: 3999,
      discountPrice: null,
      image: '⚔️',
      rating: 4.8,
      developer: 'FromSoftware',
      releaseDate: '2022-02-25',
      tags: ['Souls-like', 'Fantasy', 'Action', 'Adventure']
    },
    {
      id: 3,
      title: 'Valorant',
      description: 'A 5v5 character-based tactical FPS where precise gunplay meets unique agent abilities.',
      genre: 'FPS',
      platform: ['PC'],
      price: 0,
      discountPrice: null,
      image: '🎯',
      rating: 4.5,
      developer: 'Riot Games',
      releaseDate: '2020-06-02',
      tags: ['Tactical', 'Competitive', 'Free-to-Play', 'Esports']
    },
    {
      id: 4,
      title: 'God of War',
      description: 'His vengeance against the Gods of Olympus years behind him, Kratos now lives as a man in the realm of Norse Gods.',
      genre: 'Action Adventure',
      platform: ['PC', 'PlayStation'],
      price: 2499,
      discountPrice: 1249,
      image: '🪓',
      rating: 4.9,
      developer: 'Santa Monica Studio',
      releaseDate: '2022-01-14',
      tags: ['Action', 'Adventure', 'Norse', 'Story-Rich']
    },
    {
      id: 5,
      title: 'Apex Legends',
      description: 'A free-to-play battle royale game where legendary competitors fight for glory, fame, and fortune.',
      genre: 'Battle Royale',
      platform: ['PC', 'PlayStation', 'Xbox', 'Mobile'],
      price: 0,
      discountPrice: null,
      image: '🏆',
      rating: 4.3,
      developer: 'Respawn Entertainment',
      releaseDate: '2019-02-04',
      tags: ['Battle Royale', 'Free-to-Play', 'Team-based', 'Competitive']
    },
    {
      id: 6,
      title: 'Minecraft',
      description: 'A sandbox game that allows players to build, explore, and survive in a blocky, procedurally generated world.',
      genre: 'Sandbox',
      platform: ['PC', 'PlayStation', 'Xbox', 'Nintendo', 'Mobile'],
      price: 1999,
      discountPrice: null,
      image: '🧱',
      rating: 4.7,
      developer: 'Mojang Studios',
      releaseDate: '2011-11-18',
      tags: ['Sandbox', 'Creative', 'Survival', 'Multiplayer']
    }
  ];

  useEffect(() => {
    setGames(mockGames);
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const filteredGames = games.filter(game => {
    const matchesGenre = !filters.genre || game.genre.toLowerCase().includes(filters.genre.toLowerCase());
    const matchesPlatform = !filters.platform || game.platform.some(p => p.toLowerCase().includes(filters.platform.toLowerCase()));
    const matchesSearch = !filters.search || 
      game.title.toLowerCase().includes(filters.search.toLowerCase()) ||
      game.description.toLowerCase().includes(filters.search.toLowerCase()) ||
      game.tags.some(tag => tag.toLowerCase().includes(filters.search.toLowerCase()));
    
    let matchesPrice = true;
    if (filters.priceRange) {
      const price = game.discountPrice || game.price;
      switch (filters.priceRange) {
        case 'free':
          matchesPrice = price === 0;
          break;
        case 'under-1000':
          matchesPrice = price > 0 && price < 1000;
          break;
        case '1000-3000':
          matchesPrice = price >= 1000 && price <= 3000;
          break;
        case 'over-3000':
          matchesPrice = price > 3000;
          break;
        default:
          matchesPrice = true;
      }
    }

    return matchesGenre && matchesPlatform && matchesSearch && matchesPrice;
  });

  const formatPrice = (price, discountPrice) => {
    if (price === 0) return 'Free';
    
    if (discountPrice) {
      return (
        <div className="price-container">
          <span className="original-price">₹{price}</span>
          <span className="discount-price">₹{discountPrice}</span>
        </div>
      );
    }
    
    return `₹${price}`;
  };

  return (
    <div className="games-page">
      <div className="container">
        <div className="games-header">
          <h1>🎮 Game Store</h1>
          <p>Discover and purchase amazing games for all platforms</p>
        </div>

        {/* Filters */}
        <div className="filters-section">
          <div className="filters-form">
            <div className="filter-group">
              <input
                type="text"
                name="search"
                value={filters.search}
                onChange={handleFilterChange}
                placeholder="Search games..."
                className="form-input"
              />
            </div>
            
            <div className="filter-group">
              <select
                name="genre"
                value={filters.genre}
                onChange={handleFilterChange}
                className="form-input"
              >
                <option value="">All Genres</option>
                <option value="RPG">RPG</option>
                <option value="FPS">FPS</option>
                <option value="Action">Action</option>
                <option value="Adventure">Adventure</option>
                <option value="Battle Royale">Battle Royale</option>
                <option value="Sandbox">Sandbox</option>
              </select>
            </div>
            
            <div className="filter-group">
              <select
                name="platform"
                value={filters.platform}
                onChange={handleFilterChange}
                className="form-input"
              >
                <option value="">All Platforms</option>
                <option value="PC">PC</option>
                <option value="PlayStation">PlayStation</option>
                <option value="Xbox">Xbox</option>
                <option value="Nintendo">Nintendo</option>
                <option value="Mobile">Mobile</option>
              </select>
            </div>
            
            <div className="filter-group">
              <select
                name="priceRange"
                value={filters.priceRange}
                onChange={handleFilterChange}
                className="form-input"
              >
                <option value="">All Prices</option>
                <option value="free">Free</option>
                <option value="under-1000">Under ₹1,000</option>
                <option value="1000-3000">₹1,000 - ₹3,000</option>
                <option value="over-3000">Over ₹3,000</option>
              </select>
            </div>
          </div>
        </div>

        {/* Games Grid */}
        <div className="games-results">
          <div className="results-header">
            <h3>{filteredGames.length} Games Found</h3>
          </div>
          
          <div className="games-grid">
            {filteredGames.map(game => (
              <div key={game.id} className="game-card">
                <div className="game-image">
                  <div className="game-icon">{game.image}</div>
                  {game.discountPrice && (
                    <div className="discount-badge">
                      {Math.round(((game.price - game.discountPrice) / game.price) * 100)}% OFF
                    </div>
                  )}
                </div>
                
                <div className="game-content">
                  <div className="game-header">
                    <h3>{game.title}</h3>
                    <div className="game-rating">
                      ⭐ {game.rating}
                    </div>
                  </div>
                  
                  <p className="game-description">{game.description}</p>
                  
                  <div className="game-details">
                    <div className="game-genre">{game.genre}</div>
                    <div className="game-developer">{game.developer}</div>
                  </div>
                  
                  <div className="game-platforms">
                    {game.platform.map((platform, index) => (
                      <span key={index} className="platform-tag">
                        {platform}
                      </span>
                    ))}
                  </div>
                  
                  <div className="game-tags">
                    {game.tags.slice(0, 3).map((tag, index) => (
                      <span key={index} className="game-tag">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="game-footer">
                  <div className="game-price">
                    {formatPrice(game.price, game.discountPrice)}
                  </div>
                  <div className="game-actions">
                    <button className="btn btn-primary">
                      {game.price === 0 ? 'Play Free' : 'Buy Now'}
                    </button>
                    <button className="btn btn-outline">
                      Add to Wishlist
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Games;