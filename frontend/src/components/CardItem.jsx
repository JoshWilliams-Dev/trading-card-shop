import React from 'react';
import './CardItem.css';

const CardItem = ({ card }) => {
    return (
        <div className="card-item card">
            <div className="panel">
                <img
                    src={`data:image/jpeg;base64,${card.base64_image}`}
                    className="card-img-top"
                    alt={card.title}
                />
                <div className="card-body">
                    <h5 className="card-title">{card.title}</h5>
                    <p className="card-text">{card.description}</p>
                    <p className="card-text">Price: ${card.price}</p>
                </div>
            </div>


        </div>
    );
};

export default CardItem;