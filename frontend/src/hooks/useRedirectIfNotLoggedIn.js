import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAccessToken } from '../api/tokenService';

const useRedirectIfLoggedIn = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const checkLoginStatus = async () => {
            const token = await getAccessToken();

            if (!token) {
                navigate('/login');
            }
        };

        checkLoginStatus();
    }, [navigate]);
};

export default useRedirectIfLoggedIn;