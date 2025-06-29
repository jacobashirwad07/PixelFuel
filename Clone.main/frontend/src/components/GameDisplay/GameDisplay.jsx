import React, { useContext } from 'react'
import './GameDisplay.css'
import GameItem from '../GameItem/GameItem'
import { StoreContext } from '../../Context/StoreContext'

const GameDisplay = ({category, showTopGamesHeading}) => {

  const {game_list} = useContext(StoreContext);
  console.log('GameDisplay showTopGamesHeading:', showTopGamesHeading);

  return (
    <div className='game-display' id='game-display'>
      {showTopGamesHeading && <h2>Top Games For You</h2>}
      <div className='game-display-list'>
        {game_list.map((item)=>{
          if (category==="All" || category===item.category) {
            return <GameItem key={item._id} image={item.image} name={item.name} desc={item.description} price={item.price} id={item._id}/>
          }
          return null;
        })}
      </div>
    </div>
  )
}

export default GameDisplay
