import React from 'react';
import { useCart } from '../contexts/CartContext';
import { useToast } from '../contexts/ToastContext';
import { addToCart } from '../api/api';



const AddToCartButton = ({ cardId }) => {
    const { dispatch } = useCart();

    const showToast = useToast();

    const handleAddToCart = async () => {
        const quantity = 1;
        try {
            const response = await addToCart(cardId, quantity);
            dispatch({ type: 'ADD_TO_CART', payload: { cardId, quantity } });
            showToast(response.data.message)
        } catch (error) {
            console.error('Error adding to cart:', error);
        }
    };

    return <button onClick={handleAddToCart}>Add to Cart</button>;
};

export default AddToCartButton;