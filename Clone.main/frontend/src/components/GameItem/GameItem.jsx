import React, { useContext } from 'react'
import './GameItem.css'
import { assets } from '../../assets/assets'
import { StoreContext } from '../../Context/StoreContext';
import { toast } from 'react-toastify';

const GameItem = ({ image, name, price, desc , id }) => {
    const {cartItems,addToCart,removeFromCart,currency} = useContext(StoreContext);

    const handleAdd = () => {
        addToCart(id);
        toast.success('✔️ Added to cart!', { position: 'top-center', autoClose: 1000, hideProgressBar: true });
    };

    return (
        <div className='game-item'>
            <div className='game-item-img-container'>
                <img className='game-item-image' src={image} alt={name} />
            </div>
            <div className="game-item-info">
                <div className="game-item-name-rating">
                    <p>{name}</p> <img src={assets.rating_starts} alt="Rating" />
                </div>
                <p className="game-item-desc">{desc}</p>
                <p className="game-item-price">{currency}{price}</p>
            </div>
            <div className="game-item-controls">
                {!cartItems[id]
                ?<img className='add' onClick={handleAdd} src={assets.add_icon_white} alt="Add to cart" />
                :<div className="game-item-counter-horizontal">
                        <img src={assets.remove_icon_red} onClick={()=>removeFromCart(id)} alt="Remove from cart" />
                        <span className="game-item-qty">{cartItems[id]}</span>
                        <img src={assets.add_icon_green} onClick={handleAdd} alt="Add more" />
                    </div>
                }
            </div>
        </div>
    )
}

export default GameItem
