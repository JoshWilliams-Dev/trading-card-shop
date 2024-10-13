import React from 'react';
import { useCart } from '../contexts/CartContext';
import CartItem from '../components/CartItem';



const Cart = () => {
    const { cartItems, isCartLoading, adjustCartQuantity, removeFromCart } = useCart();

    if (isCartLoading) {
        return <div>Loading your cart...</div>;
    }


    const itemCount = cartItems.length;

    let itemTotal = 0;
    cartItems.forEach(cartItem => {
        itemTotal = itemTotal + (cartItem.quantity * cartItem.card.price);
    });

    const estimatedShipping = 10.00;

    const estimatedTaxes = itemTotal * 0.08;

    const cartSubtotal = itemTotal + estimatedShipping + estimatedTaxes;

    const usdNumberFormat = new Intl.NumberFormat(undefined, {
        style: 'currency',
        currency: 'USD',
    });

    const formattedItemTotal = usdNumberFormat.format(itemTotal);
    const formattedEstimatedShipping = usdNumberFormat.format(estimatedShipping);
    const formattedEstimatedTaxes = usdNumberFormat.format(estimatedTaxes);
    const formattedCartSubtotal = usdNumberFormat.format(cartSubtotal);

    return (
        <div className="row">
            <div className="cart-items col-9">
                {cartItems.map(cartItem => (
                    <CartItem key={cartItem.id} item={cartItem} />
                ))}
            </div>
            <div className="col-3">
                <div className="row">
                    <div className="col-8 text-start">
                        Items
                    </div>
                    <div className="col-4 text-end">{itemCount}</div>
                </div>
                <div className="row">
                    <div className="col-8 text-start">
                        Item Total
                    </div>
                    <div className="col-4 text-end">{formattedItemTotal}</div>
                </div>
                <div className="row">
                    <div className="col-8 text-start">
                        Estimated Shipping
                    </div>
                    <div className="col-4 text-end">{formattedEstimatedShipping}</div>
                </div>
                <div className="row">
                    <div className="col-8 text-start">
                        Estimated Taxes
                    </div>
                    <div className="col-4 text-end">{formattedEstimatedTaxes}</div>
                </div>
                <div className="row mt-3">
                    <div className="col-8 text-start">
                        Cart Subtotal
                    </div>
                    <div className="col-4 text-end">{formattedCartSubtotal}</div>
                </div>
            </div>
        </div>
    );
};


export default Cart;