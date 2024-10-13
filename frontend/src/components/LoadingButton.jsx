import React from 'react';

const LoadingButton = ({ messageText = 'Loading...' }) => {
    return (
        <button className="btn btn-primary" type="button" disabled>
            <span className="spinner-border spinner-border-sm me-3" aria-hidden="true"></span>
            <span role="status">{messageText}</span>
        </button>
    );
};

export default LoadingButton;