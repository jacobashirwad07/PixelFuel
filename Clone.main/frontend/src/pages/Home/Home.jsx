import React, { useState, useEffect } from 'react'
import Header from '../../components/Header/Header'
import ExploreMenu from '../../components/ExploreMenu/ExploreMenu'
import GameDisplay from '../../components/GameDisplay/GameDisplay'
import GameDetails from '../../components/GameDisplay/GameDetails'
import Services from '../../components/Services/Services'
import Reviews from '../../components/Services/Reviews'

const Home = () => {
  const [category, setCategory] = useState("All")
  const [showTopGamesHeading, setShowTopGamesHeading] = useState(false)
  const [browseGamesActive, setBrowseGamesActive] = useState(false)

  // Expose setBrowseGamesActive globally for Navbar
  useEffect(() => {
    window.setBrowseGamesActive = setBrowseGamesActive;
  }, []);

  // Debug log
  useEffect(() => {
    console.log('category:', category, 'showTopGamesHeading:', showTopGamesHeading, 'browseGamesActive:', browseGamesActive);
  }, [category, showTopGamesHeading, browseGamesActive]);

  // Hide services if a category is selected or browseGamesActive is true
  const showServices = !browseGamesActive && category === "All";
  const showGames = browseGamesActive || category !== "All";

  return (
    <>
      <Header />
      <ExploreMenu setCategory={setCategory} category={category} />
      {showGames && (
        <GameDisplay category={category} showTopGamesHeading={false} />
      )}
      {showServices && <Services />}
      {showServices && <Reviews />}
    </>
  )
}

export default Home
