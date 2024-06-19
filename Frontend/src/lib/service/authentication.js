import {jwtDecode} from "jwt-decode";
import {getRoles} from "$lib/service/administration.js";
import {getCookie, request} from "$lib/service/config.js";


export async function login({username, password}) {
    const response = await request("/login", "post", JSON.stringify({ username, password }), false);

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
    }

    const data = await response.json();
    await handleLogin(data.token)

    return response.status
}

export function setCookie(name, value, expires = 3) { // Expires in 7 days by default
    const date = new Date();
    date.setTime(date.getTime() + (expires * 60 * 60 * 1000));
    const expiresString = "expires=" + date.toUTCString();
    document.cookie = name + "=" + value + ";" + expiresString + ";path=/";
}

async function handleLogin(token) {
    setCookie('authToken', token);
    const decodedUser = jwtDecode(token)
    setCookie('username', decodedUser.user.username);
    const rolesData = await getRoles();
    setCookie('roleName', rolesData.data[decodedUser.user.roleId -1].name)

}

export async function register(username, password, email, date_of_birth) {
    const response = await fetch(`http://${import.meta.env.VITE_APIURL}:${import.meta.env.VITE_APIPORT}/register`, {
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
