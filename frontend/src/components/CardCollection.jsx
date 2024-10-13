import React, { useEffect, useState } from 'react';
import CardItem from './CardItem';
import Pagination from './Pagination';
import './CardCollection.css';

import { getCards } from '../api/api';
import LoadingButton from './LoadingButton';
import Alert from './Alert';

const CardCollection = ({ filterByLoggedInUser, cartEnabled }) => {
    const [cards, setCards] = useState([]);
    const [pageIndex, setPageIndex] = useState(1);
    const [pageSize, setPageSize] = useState(12);
    const [totalCards, setTotalCards] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [availablePageSizes] = useState([5, 10, 20, 50]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);


    useEffect(() => {
        const fetchCards = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await getCards(pageIndex, pageSize, filterByLoggedInUser);
                if (!response.ok) {
                    throw new Error('Failed to fetch cards');
                }

                let data;
                try {
                    data = await response.json();
                }
                catch {
                    data = {
                        cards: [],
                        total_pages: 1,
                        total_cards: 0
                    };
                }

                setCards(data.cards);
                setTotalPages(data.total_pages);
                setTotalCards(data.total_cards);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchCards();
    }, [pageIndex, pageSize, filterByLoggedInUser]);

    const startEntry = (pageIndex - 1) * pageSize + 1;
    const endEntry = Math.min(startEntry + pageSize - 1, totalCards);

    const handlePageSizeChange = (e) => {
        const newPageSize = parseInt(e.target.value, 10);
        if (newPageSize > 0) {
            setPageSize(newPageSize);
            setPageIndex(1);
        }
    };

    if (loading) {
        return <LoadingButton />
    }
    if (error) {
        return <div>Error: {error}</div>;
    }

    if (totalCards < 1) {
        return <>
            <div className="card-collection container">
                <Alert messageText="You have not yet created or purchased any cards." />
            </div>
        </>
    }

    return (
        <div className="card-collection container">

            {/* Row for message and pagination above the Card Items */}
            <div className="row mb-3">
                <div className="col-6">
                    <div>
                        <p className="mb-sm-0">Showing {startEntry} to {endEntry} of {totalCards} entries.</p>
                    </div>
                </div>
                <div className="col-6 text-end">
                    <Pagination
                        currentPage={pageIndex}
                        totalPages={totalPages}
                        onPageChange={setPageIndex}
                    />
                </div>
            </div>

            {/* Display Card Items */}
            <div className="card-items">
                {cards.map(card => (
                    <CardItem key={card.id} card={card} cartEnabled={cartEnabled} />
                ))}
            </div>

            {/* Row for message and pagination below the Card Items */}
            <div className="row g-0 align-items-center pb-4 mt-3">
                <div className="col-6">
                    <div className="mb-sm-0">
                        <span>Displaying a maximum of </span>
                        <select
                            value={pageSize}
                            onChange={handlePageSizeChange}
                            className="form-select"
                            style={{ display: 'inline-block', width: 'auto', marginLeft: '5px', marginRight: '5px' }}
                        >
                            {availablePageSizes.map(size => (
                                <option key={size} value={size}>{size}</option>
                            ))}

                            {/* Allow custom values */}
                            <option value={pageSize}>{pageSize}</option>
                        </select>
                        <span> items.</span>
                    </div>
                </div>
                <div className="col-6 text-end"> {/* Right align the pagination */}
                    <Pagination
                        currentPage={pageIndex}
                        totalPages={totalPages}
                        onPageChange={setPageIndex}
                    />
                </div>
            </div>
        </div>
    );
};

export default CardCollection;