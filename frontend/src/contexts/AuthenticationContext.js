import React, { createContext, useContext, useState, useEffect } from 'react';
import { isLoggedIn } from '../api/loginService';


const AuthenticationContext = createContext();

export const AuthenticationProvider = ({ children }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);

    useEffect(() => {
        const checkLoginStatus = async () => {
            const loginStatus = await isLoggedIn();
            setIsUserLoggedIn(loginStatus);
            setIsLoading(false);
        };

        checkLoginStatus();
    }, []);

    return (
        <AuthenticationContext.Provider value={{ isUserLoggedIn, isLoading }}>
            {children}
        </AuthenticationContext.Provider>
    );
};


export const useAuth = () => useContext(AuthenticationContext);