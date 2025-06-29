import React, { useContext } from 'react';
import { StoreContext } from '../../Context/StoreContext';
import './GameDetails.css';

const GameDetails = ({ category }) => {
  const { game_list, currency } = useContext(StoreContext);
  const games = game_list.filter(game => game.category === category);

  if (games.length === 0) return null;

  return (
    <div className="game-details">
      <h2>{category} Games</h2>
      <div className="game-details-list">
        {games.map(game => (
          <div className="game-details-item" key={game._id}>
            <img src={game.image} alt={game.name} className="game-details-image" />
            <div className="game-details-info">
              <h3>{game.name}</h3>
              <p>{game.description}</p>
              <p className="game-details-price">{currency}{game.price}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GameDetails; 