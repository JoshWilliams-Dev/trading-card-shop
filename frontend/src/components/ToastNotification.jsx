import React from 'react';

const ToastNotification = ({ message, show, onClose }) => {
    return (
        <div
            className={`toast position-fixed bottom-0 end-0 p-3 ${show ? 'show' : ''}`}
            style={{ zIndex: 1050 }}
            role="alert"
            aria-live="assertive"
            aria-atomic="true"
        >
            <div className="toast-header">
                <strong className="me-auto">Notification</strong>
                <button type="button" className="btn-close" onClick={onClose}></button>
            </div>
            <div className="toast-body">
                {message}
            </div>
        </div>
    );
};

export default ToastNotification;