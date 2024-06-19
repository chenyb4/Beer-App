const backendURL = `http://${import.meta.env.VITE_APIURL}:${import.meta.env.VITE_APIPORT}`;

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