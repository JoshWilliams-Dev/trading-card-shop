import React, { createContext, useContext, useReducer } from 'react';



const CartContext = createContext();


const cartReducer = (state, action) => {
    switch (action.type) {
        case 'ADD_TO_CART':
            return { ...state, cartItems: [...state.cartItems, action.payload] };
        case 'UPDATE_CART':
            return {
                ...state,
                cartItems: state.cartItems.map(item =>
                    item.id === action.payload.id ? { ...item, quantity: action.payload.quantity } : item
                ),
            };
        case 'REMOVE_FROM_CART':
            return {
                ...state,
                cartItems: state.cartItems.filter(item => item.id !== action.payload.id),
            };
        default:
            return state;
    }
};



export const CartProvider = ({ children }) => {
    const [state, dispatch] = useReducer(cartReducer, { cartItems: [] });

    return (
        <CartContext.Provider value={{ state, dispatch }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    return useContext(CartContext);
};