import React, { useEffect, useState } from 'react';
import CardItem from './CardItem';
import PaginationComponent from './Pagination';

const CardCollection = () => {
    const [cards, setCards] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [totalCards, setTotalCards] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const cardsPerPage = 12; // 4 cards per row, 3 rows

    useEffect(() => {
        const fetchCards = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch(`https://api.example.com/cards?page=${currentPage}&limit=${cardsPerPage}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch cards');
                }
                const data = await response.json();

                setCards(data.cards); // assuming the API returns an array of cards
                setTotalPages(data.totalPages);
                setTotalCards(data.totalItems);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchCards();
    }, [currentPage]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="container">
            <h5>Total Cards: {totalCards}</h5>
            <div className="row">
                {cards.map((card, index) => (
                    <div className="col-sm-6 col-md-4 col-lg-3" key={index}>
                        <CardItem card={card} />
                    </div>
                ))}
            </div>
            <PaginationComponent
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
            />
        </div>
    );
};

export default CardCollection;