import React from 'react';
import { useCart } from '../contexts/CartContext';

import './CartItem.css';



const CartItem = ({ item }) => {

    const { cartItems, adjustCartQuantity, removeFromCart } = useCart();


    const handleIncrementQuantity = () => {
        adjustCartQuantity(item.card, 1);
    };

    const handleDecrementQuantity = () => {
        adjustCartQuantity(item.card, -1);
    };

    const handleRemoveFromCart = () => {
        removeFromCart(item.id);
    };

    const formattedPrice = new Intl.NumberFormat(undefined, {
        style: 'currency',
        currency: 'USD',
    }).format(item.card.price);


    return (
        <div className="cart-item row">
            <div className="col-2">
                <img
                    src={`data:image/jpeg;base64,${item.card.base64_image}`}
                    className="item-img-top"
                    alt={item.card.image_filename}
                    title={item.card.image_filename}
                />
            </div>
            <div className="col-8 ms-3">
                <div className="row">
                    <div className="col-10">
                        <h5 className="item-title text-start">{item.card.image_filename}</h5>
                    </div>
                    <div className="col-2">
                        <div className="text-end">{formattedPrice}</div>
                    </div>
                </div>
                <div className="row">
                    <p className="item-text">{item.card.description}</p>
                </div>
                <div className="row">
                    <div>
                        <button onClick={handleIncrementQuantity} className="btn btn-primary me-3">
                            Add One
                            <svg className="bi ms-2"><use href="#bag-plus-fill"></use></svg>
                        </button>
                        <button onClick={handleDecrementQuantity} className="btn btn-primary me-3">
                            Remove One
                            <svg className="bi ms-2"><use href="#bag-dash-fill"></use></svg>
                        </button>
                        <button onClick={handleRemoveFromCart} className="btn btn-primary">
                            Remove All
                            <svg className="bi ms-2"><use href="#bag-x-fill"></use></svg>
                        </button>
                    </div>
                    <div className="text-end"><p>Quantity in Cart: {item.quantity}</p></div>
                </div>
            </div>
        </div>
    );
};

export default CartItem;