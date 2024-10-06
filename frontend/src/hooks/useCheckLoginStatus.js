import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAccessToken } from '../api/tokenService';

const useCheckLoginStatus = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const checkLoginStatus = async () => {
            const token = await getAccessToken();

            if (token) {
                // If a valid token is found, redirect to dashboard
                navigate('/dashboard');
            }
        };

        checkLoginStatus();
    }, [navigate]);
};

export default useCheckLoginStatus;