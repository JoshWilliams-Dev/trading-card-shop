import React from 'react';

const LoadingButton = ({ messageText }) => {
    return (
        <div className="alert alert-info d-inline" role="alert">
            {messageText}
          </div>
    );
};

export default LoadingButton;