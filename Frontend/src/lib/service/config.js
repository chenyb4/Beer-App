// Get backend url form .env file
const backendURL = `http://${import.meta.env.VITE_APIURL}:${import.meta.env.VITE_APIPORT}`;

/**
 * @param params string for parameters and query
 * @param method GET/PUT/POST/DELETE
 * @param body body of fetch request in json
 * @param auth When true use authToken, when false don't use authentication
 * @returns {Promise<Response>} Response of fetch
 */
export async function request(params, method, body, auth) {
    const headers = {
        'Content-Type': 'application/json',
        ...(auth && { 'Authorization': getCookie("authToken") })
    };
    const requestOptions = {
        method: method,
        headers: headers,
    };

    if (body) {
        requestOptions.body = body;
    }

    return await fetch(backendURL + params, requestOptions);
}


/**
 * @param name key of cookies
 * @returns {null|string} value of cookie
 */
export function getCookie(name) {
    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
        const [cookieName, cookieValue] = cookie.trim().split('=');
        if (cookieName === name) {
            return cookieValue;
        }
    }
    return null;
}