import { postJsonData } from './api';
import { clearTokens, setTokens, getAccessToken } from './tokenService';


export const login = async (email, password) => {

    try {
        const response = await postJsonData('/authenticate', { email, password }, false);

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
export const logout = async () => {

    let response;

    try {
        let access_token = getAccessToken();

        if (access_token !== null) {
            response = await postJsonData('/logout', {}, true, {});

            if (!response.ok && response.status !== 401) {
                const data = await response.json();

                console.log('data', data);
            }
        }


    } catch (error) {
        console.error('Error during logout:', error);
        response = false;
    }

    clearTokens();

    return response;
};