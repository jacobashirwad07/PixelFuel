import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Home.css';

const Home = () => {
  const { isAuthenticated, user } = useAuth();

  const services = [
    {
      id: 1,
      name: 'PC Building',
      description: 'Custom gaming PC builds and assembly',
      icon: '🖥️',
      category: 'pc-building'
    },
    {
      id: 2,
      name: 'Gaming Coaching',
      description: 'Professional esports coaching and training',
      icon: '🎮',
      category: 'gaming-coaching'
    },
    {
      id: 3,
      name: 'Console Repair',
      description: 'Expert console and hardware repair services',
      icon: '🔧',
      category: 'console-repair'
    },
    {
      id: 4,
      name: 'PC Optimization',
      description: 'Performance tuning and system optimization',
      icon: '⚡',
      category: 'pc-optimization'
    },
    {
      id: 5,
      name: 'Gaming Setup',
      description: 'Complete gaming room and equipment setup',
      icon: '🎯',
      category: 'gaming-setup'
    },
    {
      id: 6,
      name: 'Streaming Setup',
      description: 'Professional streaming equipment configuration',
      icon: '📺',
      category: 'streaming-setup'
    }
  ];

  const featuredGames = [
    { id: 1, title: 'Cyberpunk 2077', genre: 'RPG', price: 59.99, image: '🌃' },
    { id: 2, title: 'Valorant Coaching', genre: 'FPS Training', price: 25.00, image: '🎯' },
    { id: 3, title: 'Elden Ring', genre: 'Action RPG', price: 49.99, image: '⚔️' },
    { id: 4, title: 'League of Legends Coaching', genre: 'MOBA Training', price: 30.00, image: '🏆' }
  ];

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h1>Your Ultimate Gaming Marketplace</h1>
            <p>
              Discover amazing games, hire professional gaming coaches, and book gaming services. 
              Level up your gaming experience with PixelFuel.
            </p>
            {!isAuthenticated ? (
              <div className="hero-actions">
                <Link to="/register" className="btn btn-primary">
                  Get Started
                </Link>
                <Link to="/games" className="btn btn-outline">
                  Browse Games
                </Link>
              </div>
            ) : (
              <div className="hero-actions">
                <Link to="/games" className="btn btn-primary">
                  Shop Games
                </Link>
                <Link to="/coaches" className="btn btn-outline">
                  Find Coaches
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Featured Games Section */}
      <section className="featured-games">
        <div className="container">
          <h2 className="section-title">Featured Games & Services</h2>
          <div className="games-grid">
            {featuredGames.map(game => (
              <div key={game.id} className="game-card">
                <div className="game-image">{game.image}</div>
                <h3>{game.title}</h3>
                <p className="game-genre">{game.genre}</p>
                <div className="game-price">${game.price}</div>
                <Link to="/games" className="game-link">
                  View Details →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="services-preview">
        <div className="container">
          <h2 className="section-title">Gaming Services</h2>
          <div className="services-grid">
            {services.map(service => (
              <div key={service.id} className="service-card">
                <div className="service-icon">{service.icon}</div>
                <h3>{service.name}</h3>
                <p>{service.description}</p>
                <Link to={`/services?category=${service.category}`} className="service-link">
                  Book Now →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="container">
          <h2 className="section-title">Why Choose PixelFuel?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🎮</div>
              <h3>Verified Gamers</h3>
              <p>All coaches and service providers are verified gaming professionals</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">⭐</div>
              <h3>Rated & Reviewed</h3>
              <p>Choose from highly-rated professionals based on real gaming reviews</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💳</div>
              <h3>Secure Payments</h3>
              <p>Safe and secure payment options with transparent gaming pricing</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🏆</div>
              <h3>Pro Gaming Focus</h3>
              <p>Specialized platform designed specifically for gaming enthusiasts</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {!isAuthenticated && (
        <section className="cta">
          <div className="container">
            <div className="cta-content">
              <h2>Ready to level up?</h2>
              <p>Join thousands of gamers who trust PixelFuel for their gaming needs</p>
              <div className="cta-actions">
                <Link to="/register" className="btn btn-primary">
                  Join Now
                </Link>
                <Link to="/register?role=coach" className="btn btn-outline">
                  Become a Coach
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default Home;