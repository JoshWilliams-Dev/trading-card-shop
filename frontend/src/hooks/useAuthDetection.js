import { useState, useEffect } from 'react';
import { isLoggedIn } from '../api/loginService';

const useAuthDetection = () => {
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

    return { isLoading, isUserLoggedIn };
};

export default useAuthDetection;