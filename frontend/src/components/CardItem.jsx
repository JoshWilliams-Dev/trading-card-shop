import React from 'react';
import { useCart } from '../contexts/CartContext';

import './CardItem.css';



const CardItem = ({ card, cartEnabled }) => {

    const { cartItems, adjustCartQuantity, removeFromCart } = useCart();


    const cartItem = cartItems.find(item => item.card_id === card.id);

    const handleIncrementQuantity = () => {
        adjustCartQuantity(card, 1);
    };

    const handleDecrementQuantity = () => {
        adjustCartQuantity(card, -1);
    };

    const handleRemoveFromCart = () => {
        removeFromCart(cartItem.id);
    };

    const formattedPrice = new Intl.NumberFormat(undefined, {
        style: 'currency',
        currency: 'USD',
    }).format(card.price);


    return (
        <div className="card-item card">
            <div className="panel">
                <img
                    src={`data:image/jpeg;base64,${card.base64_image}`}
                    className="card-img-top"
                    alt={card.image_filename}
                    title={card.image_filename}
                />
                <div className="card-body">
                    <h5 className="card-title">{card.image_filename}</h5>
                    <p className="card-text">{card.description}</p>
                    <p className="card-text">Price: {formattedPrice}</p>
                </div>
                {cartEnabled && (
                    <div className="card-footer">
                        {cartItem ? (
                            <div>
                                <button onClick={handleIncrementQuantity} className="btn btn-primary">
                                    <svg className="bi"><use href="#bag-plus-fill"></use></svg>
                                </button>
                                <button onClick={handleDecrementQuantity} className="btn btn-primary">
                                    <svg className="bi"><use href="#bag-dash-fill"></use></svg>
                                </button>
                                <button onClick={handleRemoveFromCart} className="btn btn-primary">
                                    <svg className="bi"><use href="#bag-x-fill"></use></svg>
                                </button>
                                <p>Quantity in Cart: {cartItem.quantity}</p>
                            </div>
                        ) : (
                            <button onClick={handleIncrementQuantity} className="btn btn-primary">
                                <svg className="bi"><use href="#bag-plus-fill"></use></svg>
                            </button>
                        )}
                    </div>
                )}
            </div>


        </div>
    );
};

export default CardItem;