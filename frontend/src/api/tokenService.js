import { postJsonData } from './api';



const isTokenExpired = (expiresAt) => {
    return Date.now() >= expiresAt * 1000;
};


export const getAccessToken = async () => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
        return null;
    }
    console.log('getAccessToken token', token);

    const expiration = localStorage.getItem('accessTokenExpiry');
    if (isTokenExpired(expiration)) {
        console.log('getAccessToken isTokenExpired', isTokenExpired);
        // If the token has expired, try to refresh it
        return await refreshAccessToken();
    }

    // Return valid access token
    return token;
};



// Refresh access token by calling the backend refresh endpoint
export const refreshAccessToken = async () => {
    const refresh_token = localStorage.getItem('refreshToken');
    const refresh_token_expiration = localStorage.getItem('refreshTokenExpiry');
    if (!refresh_token || !refresh_token_expiration || isTokenExpired(refresh_token_expiration)) {
        // If the token has expired or doesn't exist, redirect to login
        console.error('Refresh token has expired.');
        const LOGIN_URL = '/login';
        window.location.href = LOGIN_URL;
        return null;
    }

    try {
        // Refresh access token using the refresh token
        const response = await postJsonData(
            '/refresh_token',
            {
                'refresh_token': refresh_token
            },
            false,
            {
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${refresh_token}`
                }
            }
        );

        if (response.ok) {
            const data = await response.json();
            
            // Update tokens and expiration times
            setTokens(data);

            // Return new access token
            return data.access_token;
        } else {
            console.log(response);
            console.log(await response.json());
            console.error('Failed to refresh access token');
            return null;
        }
    } catch (error) {
        console.error('Error refreshing access token:', error);
        return null;
    }
};



export const setTokens = (data) => {
    localStorage.setItem('accessToken', data.access_token);
    localStorage.setItem('accessTokenExpiry', data.access_token_expires);
    localStorage.setItem('refreshToken', data.refresh_token);
    localStorage.setItem('refreshTokenExpiry', data.refresh_token_expires);
};



export const clearTokens = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('accessTokenExpiry');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('refreshTokenExpiry');
};