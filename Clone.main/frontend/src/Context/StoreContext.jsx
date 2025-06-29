import { createContext, useState } from "react";
import { game_list as static_game_list, category_list } from "../assets/assets";
export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
    const [game_list, setGameList] = useState(static_game_list);
    const [cartItems, setCartItems] = useState({});
    const [token, setToken] = useState("");
    const currency = "$";
    const shippingCharge = 10;

    const addToCart = (itemId) => {
        if (!cartItems[itemId]) {
            setCartItems((prev) => ({ ...prev, [itemId]: 1 }));
        } else {
            setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));
        }
    };

    const removeFromCart = (itemId) => {
        setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }));
    };

    const getTotalCartAmount = () => {
        let totalAmount = 0;
        for (const item in cartItems) {
            try {
                if (cartItems[item] > 0) {
                    let itemInfo = game_list.find((product) => product._id === item);
                    totalAmount += itemInfo.price * cartItems[item];
                }
            } catch (error) {}
        }
        return totalAmount;
    };

    const contextValue = {
        game_list,
        category_list,
        cartItems,
        addToCart,
        removeFromCart,
        getTotalCartAmount,
        token,
        setToken,
        setCartItems,
        currency,
        shippingCharge
    };

    return (
        <StoreContext.Provider value={contextValue}>
            {props.children}
        </StoreContext.Provider>
    );
};

export default StoreContextProvider;
