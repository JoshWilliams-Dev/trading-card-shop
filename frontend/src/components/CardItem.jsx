import React from 'react';

const CardItem = ({ card }) => {
    return (
        <div className="card m-2" style={{ width: '18rem' }}>
            <img src={card.image} className="card-img-top" alt={card.title} />
            <div className="card-body">
                <h5 className="card-title">{card.title}</h5>
                <p className="card-text">{card.description}</p>
                <p className="card-text">Price: ${card.price}</p>
            </div>
        </div>
    );
};

export default CardItem;