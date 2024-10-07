import { getAccessToken, refreshAccessToken, clearTokens } from './tokenService';


const API_BASE_URL = process.env.REACT_APP_BACKEND_URL;


const makeRequest = async (url, options = {}, requiresAuthentication = true) => {

    let headers = {
        ...options.headers
    };

    const LOGIN_URL = '/login';

    const createUnauthorizedResult = () => {
        return { ok: false, status: 401, json: async () => ({ message: 'Unauthorized' }) };
    }

    if (requiresAuthentication) {
        // Get access token (may refresh it if expired)
        let accessToken = await getAccessToken();

        // If no valid token, redirect to login
        if (!accessToken) {
            console.error('Request requires authentication, but no authorization token is present.');
            window.location.href = LOGIN_URL;
            return createUnauthorizedResult();
        }

        // Add Authorization header to request
        headers['Authorization'] = `Bearer ${accessToken}`;
    }

    let api_url = `${API_BASE_URL}${url}`;

    let request_init = {
        ...options,
        headers,
    };

    try {
        const startTime = Date.now();

        // Make the API request with the appropriate headers
        const response = await fetch(api_url, request_init);

        let timeTaken = Date.now() - startTime;

        // Handle token expiration and retry logic if authentication is required
        if (requiresAuthentication && response.status === 401) {
            console.log('Access token expired. Trying to refresh.');

            // Attempt to refresh the access token
            let accessToken = await refreshAccessToken();

            if (!accessToken) {
                // If refresh fails, clear tokens and redirect to login
                clearTokens();
                window.location.href = LOGIN_URL;
                return createUnauthorizedResult();
            }

            // Retry the original request with the new token
            headers['Authorization'] = `Bearer ${accessToken}`;
            const retryResponse = await fetch(api_url, request_init);

            timeTaken = Date.now() - startTime;

            return {
                ok: retryResponse.ok,
                status: retryResponse.status,
                statusText: retryResponse.statusText,
                headers: retryResponse.headers,
                redirected: retryResponse.redirected,
                timeTaken,
                json: async () => await retryResponse.json(),
            };
        }

        // Return JSON response
        return {
            ok: response.ok,
            status: response.status,
            statusText: response.statusText,
            headers: response.headers,
            redirected: response.redirected,
            timeTaken,
            json: async () => await response.json(),
        };
    } catch (error) {
        console.error('Error making API request:', error);
        return { ok: false, status: 500, json: async () => ({ message: 'Internal Server Error' }), error: error instanceof Error ? error : new Error('An unknown error occurred') };
    }
};



export const postJsonData = async (url, body, requiresAuthentication = true, options = {}) => {

    let headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    let request_options = {
        ...options,
        method: 'POST',
        body: JSON.stringify(body),
        headers: headers
    };

    return await makeRequest(url, request_options, requiresAuthentication);
};



export const createCard = async (formData) => {

    let request_options = {
        method: 'POST',
        body: formData
    };

    return await makeRequest("/cards", request_options, true);
};



export const getJsonData = async (url, requiresAuthentication = true, options = {}) => {

    let headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    let request_options = {
        ...options,
        method: 'GET',
        headers: headers
    };

    return await makeRequest(url, request_options, requiresAuthentication);
};



export const getCards = async (pageIndex, pageSize, filterByLoggedInUser) => {

    const queryString = new URLSearchParams({
        "page_index": pageIndex,
        "page_size": pageSize
    }).toString();

    let endpoint;
    let requiresAuthentication;

    if (filterByLoggedInUser) {
        endpoint = `/cards/list/mine?${queryString}`;
        requiresAuthentication = true;
    } else {
        endpoint = `/cards/list?${queryString}`;
        requiresAuthentication = false;
    }

    return await getJsonData(endpoint, requiresAuthentication);
};



export const addToCart = async (cardId, quantity) => {

    const response = await postJsonData('/cart', { card_id: cardId, quantity: quantity }, false);

    return response;
};



export const getCart = async () => {

    let endpoint = "/cart";
    let requiresAuthentication = true;

    return await getJsonData(endpoint, requiresAuthentication);
};



export const updateCartItem = async (itemId, quantity) => {

    let headers = {
        'Content-Type': 'application/json'
    };


    let body = { quantity: quantity };

    let request_options = {
        method: 'PUT',
        body: JSON.stringify(body),
        headers: headers
    };

    let endpoint = `/cart/${itemId}`
    let requiresAuthentication = true;

    return await makeRequest(endpoint, request_options, requiresAuthentication);
};



export const removeCartItem = async (itemId) => {

    let headers = {
        'Content-Type': 'application/json'
    };

    let request_options = {
        method: 'DELETE',
        body: {},
        headers: headers
    };

    let endpoint = `/cart/${itemId}`
    let requiresAuthentication = true;

    return await makeRequest(endpoint, request_options, requiresAuthentication);
};