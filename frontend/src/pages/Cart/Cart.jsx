import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import './Cart.css';

const Cart = () => {
  const [cart, setCart] = useState({ items: [], total: 0 });
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutForm, setCheckoutForm] = useState({
    paymentMethod: 'card',
    address: ''
  });
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      fetchCart();
    }
  }, [user]);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:5001/api/cart/${user.email}`);
      
      if (response.data.success) {
        setCart(response.data.data);
      }
    } catch (error) {
      console.error('Fetch cart error:', error);
      toast.error('Failed to fetch cart');
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (itemId, type) => {
    try {
      const response = await axios.delete(
        `http://localhost:5001/api/cart/${user.email}/remove/${itemId}?type=${type}`
      );
      
      if (response.data.success) {
        setCart(response.data.data);
        toast.success('Item removed from cart');
      }
    } catch (error) {
      console.error('Remove from cart error:', error);
      toast.error('Failed to remove item from cart');
    }
  };

  const handleCheckoutSubmit = async (e) => {
    e.preventDefault();
    
    if (cart.items.length === 0) {
      toast.error('Cart is empty');
      return;
    }

    if (!checkoutForm.address.trim()) {
      toast.error('Please provide an address');
      return;
    }

    try {
      setCheckoutLoading(true);
      const response = await axios.post(`http://localhost:5001/api/cart/${user.email}/checkout`, {
        paymentMethod: checkoutForm.paymentMethod,
        address: checkoutForm.address
      });
      
      if (response.data.success) {
        toast.success('Order placed successfully!');
        setCart({ items: [], total: 0 });
        navigate('/orders');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error('Failed to place order');
    } finally {
      setCheckoutLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCheckoutForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (!user) {
    return (
      <div className="cart-page">
        <div className="container">
          <div className="cart-empty">
            <h2>Please login to view your cart</h2>
            <button onClick={() => navigate('/login')} className="btn btn-primary">
              Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="container">
        <div className="cart-header">
          <h1>🛒 Shopping Cart</h1>
          <p>Review your items and proceed to checkout</p>
        </div>

        {cart.items.length === 0 ? (
          <div className="cart-empty">
            <div className="empty-icon">🛒</div>
            <h2>Your cart is empty</h2>
            <p>Add some services or coaching sessions to get started!</p>
            <div className="empty-actions">
              <button onClick={() => navigate('/services')} className="btn btn-primary">
                Browse Services
              </button>
              <button onClick={() => navigate('/coaches')} className="btn btn-outline">
                Find Coaches
              </button>
            </div>
          </div>
        ) : (
          <div className="cart-content">
            <div className="cart-items">
              <h2>Cart Items ({cart.items.length})</h2>
              
              {cart.items.map((item, index) => (
                <div key={`${item.id}-${item.type}`} className="cart-item">
                  <div className="item-image">
                    <img src={item.image} alt={item.name} />
                  </div>
                  
                  <div className="item-details">
                    <h3>{item.name}</h3>
                    <div className="item-type">
                      {item.type === 'service' ? '🔧 Service' : '🏆 Coaching'}
                    </div>
                    <div className="item-quantity">
                      Quantity: {item.quantity}
                    </div>
                  </div>
                  
                  <div className="item-price">
                    <div className="price">₹{item.price * item.quantity}</div>
                    <div className="unit-price">₹{item.price} each</div>
                  </div>
                  
                  <button 
                    onClick={() => removeFromCart(item.id, item.type)}
                    className="remove-btn"
                    title="Remove from cart"
                  >
                    ❌
                  </button>
                </div>
              ))}
              
              <div className="cart-total">
                <h3>Total: ₹{cart.total}</h3>
              </div>
            </div>

            <div className="checkout-section">
              <h2>Checkout</h2>
              
              <form onSubmit={handleCheckoutSubmit} className="checkout-form">
                <div className="form-group">
                  <label>Payment Method</label>
                  <select
                    name="paymentMethod"
                    value={checkoutForm.paymentMethod}
                    onChange={handleInputChange}
                    className="form-input"
                  >
                    <option value="card">Credit/Debit Card</option>
                    <option value="upi">UPI</option>
                    <option value="netbanking">Net Banking</option>
                    <option value="wallet">Digital Wallet</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label>Delivery Address</label>
                  <textarea
                    name="address"
                    value={checkoutForm.address}
                    onChange={handleInputChange}
                    placeholder="Enter your complete address..."
                    className="form-input"
                    rows="4"
                    required
                  />
                </div>
                
                <div className="order-summary">
                  <div className="summary-row">
                    <span>Subtotal:</span>
                    <span>₹{cart.total}</span>
                  </div>
                  <div className="summary-row">
                    <span>Service Fee:</span>
                    <span>₹{Math.round(cart.total * 0.05)}</span>
                  </div>
                  <div className="summary-row total-row">
                    <span>Total:</span>
                    <span>₹{cart.total + Math.round(cart.total * 0.05)}</span>
                  </div>
                </div>
                
                <button 
                  type="submit" 
                  className="btn btn-primary checkout-btn"
                  disabled={checkoutLoading}
                >
                  {checkoutLoading ? 'Processing...' : 'Place Order'}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;