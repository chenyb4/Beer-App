import {jwtDecode} from "jwt-decode";
import {getRoles} from "$lib/service/administration.js";
import {request} from "$lib/service/config.js";

/**
 * 
 * @param {*} param0 
 * @returns 
 */
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

/**
 * 
 * @param {*} name 
 * @param {*} value 
 * @param {*} expires 
 */
export function setCookie(name, value, expires = 3) { // Expires in 7 days by default
    const date = new Date();
    date.setTime(date.getTime() + (expires * 60 * 60 * 1000));
    const expiresString = "expires=" + date.toUTCString();
    document.cookie = name + "=" + value + ";" + expiresString + ";path=/";
}
/**
 * 
 * @param {*} token 
 */
async function handleLogin(token) {
    setCookie('authToken', token);
    const decodedUser = jwtDecode(token)
    setCookie('username', decodedUser.user.username);
    const rolesData = await getRoles();
    setCookie('roleName', rolesData.data[decodedUser.user.roleId -1].name)

}