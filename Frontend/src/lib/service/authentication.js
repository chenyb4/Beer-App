let env = import.meta.env;

export async function login(username, password) {
    const response = await fetch(`http://${env.VITE_APIURL}:${env.VITE_APIPORT}/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
    }

    const data = await response.json();
    return data.token;
}

export async function register(username, password, email, date_of_birth) {
    const response = await fetch(`http://${env.VITE_APIURL}:${env.VITE_APIPORT}/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password, email, date_of_birth }),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
    }

    const data = await response.json();
    return data.token;
}
