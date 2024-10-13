import { useState, useEffect } from 'react';
import { isLoggedIn } from '../api/loginService';

const useAuthDetection = () => {
    const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);

    useEffect(() => {
        const checkLoginStatus = async () => {
            const loginStatus = await isLoggedIn();
            
            setIsUserLoggedIn(loginStatus);
        };

        checkLoginStatus();
    }, []);

    return { isUserLoggedIn };
};

export default useAuthDetection;