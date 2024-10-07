import React, { useEffect } from 'react';
import { getCart, updateCartItem, removeCartItem } from '../api/api';
import { useToast } from '../contexts/ToastContext';
import { useCart } from '../contexts/CartContext';




const Cart = () => {
    const { state, dispatch } = useCart();
    const showToast = useToast();


    useEffect(() => {
        const fetchCartItems = async () => {
            try {
                const response = await getCart();
                response.data.forEach(item => {
                    dispatch({ type: 'ADD_TO_CART', payload: item });
                });
            } catch (error) {
                console.error('Error fetching cart:', error);
            }
        };

        fetchCartItems();
    }, [dispatch]);



    const handleUpdateQuantity = async (itemId, quantity) => {
        try {
            const response = await updateCartItem(itemId, quantity);
            dispatch({ type: 'UPDATE_CART', payload: { id: itemId, quantity } });
            showToast(response.data.message)
        } catch (error) {
            console.error('Error updating quantity:', error);
        }
    };

    const handleRemoveFromCart = async (itemId) => {
        try {
            const response = await removeCartItem(itemId);
            dispatch({ type: 'REMOVE_FROM_CART', payload: { id: itemId } });
            showToast(response.data.message)
        } catch (error) {
            console.error('Error removing from cart:', error);
        }
    };

    return (
        <div>
            <h2>Your Cart</h2>
            <ul>
                {state.cartItems.map(item => (
                    <li key={item.id}>
                        {item.card.description} - Quantity: {item.quantity}
                        <button onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}>+</button>
                        <button onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}>-</button>
                        <button onClick={() => handleRemoveFromCart(item.id)}>Remove</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};


export default Cart;