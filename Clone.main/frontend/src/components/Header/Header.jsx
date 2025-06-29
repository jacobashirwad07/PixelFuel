import React from 'react';
import './Header.css';

const Header = () => {
    return (
        <div className='header'>
            {/* Video background */}
            <video
                className="header-video-bg"
                src="/header_video.mp4"
                autoPlay
                loop
                muted
                playsInline
            />
            <div className='header-contents'>
                <h2>Fuel Your Game. Anytime, Anywhere.</h2>
                <p>
                    Explore a massive collection of top-rated games and pro-level gaming services. Whether you're into fast-paced action, immersive RPGs, or strategic multiplayer showdowns — PixelFuel powers your play.
                </p>
            </div>
        </div>
    );
};

export default Header;
