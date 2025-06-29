import React, { useContext } from 'react';
import './ExploreMenu.css';
import { StoreContext } from '../../Context/StoreContext';

const ExploreMenu = ({ category, setCategory, onBrowseGames }) => {
  const { category_list } = useContext(StoreContext);

  const handleMenuClick = (item) => {
    if (category === item.category_name) {
      setCategory("All");
      if (onBrowseGames) onBrowseGames();
    } else {
      setCategory(item.category_name);
    }
  };

  return (
    <div className='explore-menu' id='explore-menu'>
      <h1>Explore Game Categories</h1>
      <p className='explore-menu-text'>
        Browse through a wide selection of game genres — from heart-pounding action and immersive RPGs to strategic simulations and indie gems. Find your next favorite game now.
      </p>
      <div className="explore-menu-list">
        {category_list.map((item, index) => (
          <div
            key={index}
            onClick={() => handleMenuClick(item)}
            className='explore-menu-list-item'
          >
            <img
              src={item.category_image}
              className={category === item.category_name ? "active" : ""}
              alt={item.category_name}
            />
            <p>{item.category_name}</p>
          </div>
        ))}
      </div>
      <hr />
    </div>
  );
};

export default ExploreMenu;
