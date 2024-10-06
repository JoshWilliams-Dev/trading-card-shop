import React, { createContext, useContext, useState } from 'react';
import ToastNotification from '../components/ToastNotification';

// Create a context for the toast
const ToastContext = createContext();

// Create a provider component
export const ToastProvider = ({ children }) => {
    const [toastMessage, setToastMessage] = useState('');
    const [showToast, setShowToast] = useState(false);

    const showToastMessage = (message) => {
        setToastMessage(message);
        setShowToast(true);

        // Automatically hide the toast after 3 seconds
        setTimeout(() => {
            setShowToast(false);
        }, 3000);
    };

    return (
        <ToastContext.Provider value={showToastMessage}>
            {children}
            <ToastNotification
                message={toastMessage}
                show={showToast}
                onClose={() => setShowToast(false)}
            />
        </ToastContext.Provider>
    );
};

// Create a custom hook to use the Toast context
export const useToast = () => {
    return useContext(ToastContext);
};