import React, { createContext, useContext, useReducer, useEffect } from 'react';
import useAuthDetection from '../hooks/useAuthDetection';
import { addCartItem, getCart, removeCartItem } from '../api/api';



const initialState = {
    cartItems: [],
    isCartLoading: false,
};


const CartContext = createContext();


const cartReducer = (state, action) => {
    switch (action.type) {
        case 'LOAD_CART':
            return { ...state, cartItems: action.payload, isCartLoading: false };
        case 'ADD_ITEM':
            return { ...state, cartItems: [...state.cartItems, action.payload] };
        case 'INCREMENT_ITEM':
        case 'DECREMENT_ITEM':
            return {
                ...state,
                cartItems: state.cartItems.map(item =>
                    item.id === action.payload.id
                        ? action.payload
                        : item
                )
            };
        case 'REMOVE_ITEM':
            return {
                ...state,
                cartItems: state.cartItems.filter(item => item.id !== action.payload)
            };
        case 'SET_LOADING':
            return { ...state, isCartLoading: action.payload };
        default:
            return state;
    }
};



export const CartProvider = ({ children }) => {
    const { isUserLoggedIn } = useAuthDetection();
    const [state, dispatch] = useReducer(cartReducer, initialState);

    useEffect(() => {
        const loadCartData = async () => {
            try {
                dispatch({ type: 'SET_LOADING', payload: true });
                const getCartResponse = await getCart();

                if (getCartResponse.ok) {
                    const cartData = await getCartResponse.json();
                    dispatch({ type: 'LOAD_CART', payload: cartData });
                }
            } catch (error) {
                console.error('Failed to load cart:', error);
                dispatch({ type: 'SET_LOADING', payload: false });
            }
        };

        if (isUserLoggedIn) {
            loadCartData();
        }
    }, [isUserLoggedIn]);


    const adjustCartQuantity = async (card, quantity) => {
        
        let addCartItemResponse = await addCartItem(card.id, quantity);
        if (addCartItemResponse.ok)
        {
            if (addCartItemResponse.status === 200) {
                let data = await addCartItemResponse.json();
                if (quantity > 0) {
                    dispatch({ type: 'INCREMENT_ITEM', payload: data });
                }
                else {
                    dispatch({ type: 'DECREMENT_ITEM', payload: data });
                }
            } else if (addCartItemResponse.status === 201) {
                let data = await addCartItemResponse.json();
                dispatch({ type: 'ADD_ITEM', payload: data });
            } else if (addCartItemResponse.status === 204) {
                const existingItem = state.cartItems.find(item => item.card_id === card.id);
                dispatch({ type: 'REMOVE_ITEM', payload: existingItem.id });
            }
        }
    };


    const removeFromCart = async (itemId) => {
        try {
            await removeCartItem(itemId);
            dispatch({ type: 'REMOVE_ITEM', payload: itemId });
        } catch (error) {
            console.error('Failed to remove cart item:', error);
        }
    };

    return (
        <CartContext.Provider
            value={{
                cartItems: state.cartItems,
                isCartLoading: state.isCartLoading,
                adjustCartQuantity,
                removeFromCart,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};



export const useCart = () => {
    return useContext(CartContext);
};