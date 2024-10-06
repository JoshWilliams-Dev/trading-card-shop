import { postData } from './api';
import { clearTokens, setTokens } from './tokenService';


export const login = async (email, password) => {

    try {
        const response = await postData('/authenticate', { email, password }, false);
        
        if (response.ok) {
            const data = await response.json();

            setTokens(data);
        }

        return response;
    } catch (error) {
        console.error('Error during login:', error);
        return false;
    }
};

// Function to log out (clear token)
export const logout = () => {
    clearTokens();

    const LOGIN_URL = '/login';
    window.location.href = LOGIN_URL;
};