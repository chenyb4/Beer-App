import {request} from "$lib/service/config.js";

export async function createUser(username, email, date_of_birth) {
    try {
        const response = await request("/users", "POST", JSON.stringify({username, email, date_of_birth}), true);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Failed to fetch user data:", error);
    }
}
export async function getUsers(page = 1, pageSize = 6, filterUsername = "", filterEmail = "", filterIsLegalAge = 0, filterLanguage = -1, filterRole = 0) {
    let query = {};
    query.page = page;
    query.pageSize = pageSize;
    if (filterUsername !== "") query.username = filterUsername;
    if (filterEmail !== "") query.email = filterEmail;
    if (filterIsLegalAge !== 0) query.isLegalAge = filterIsLegalAge;
    if (filterLanguage !== -1) query.language = filterLanguage;
    if (filterRole !== 0) query.roleId = filterRole;
    const queryString = new URLSearchParams(query).toString();
    try {
        const response = await request(`/users?` + queryString, "GET", '', true);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Failed to fetch user data:", error);
    }
}

export async function getRoles(){
    try {
        const response = await request("/roles", "GET",'', true);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Failed to fetch user data:", error);
    }
}

export async function deleteUser(user) {
    try {
        const response = await request("/users?id=" + user.id, "DELETE",'', true);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Failed to fetch user data:", error);
    }
}

export async function updateUser({oldUser, username = oldUser.username, date_of_birth = oldUser.date_of_birth, language = oldUser.language, roleId = oldUser.roleId, password = ''}) {
    try {
        const response = await request("/users/?id=" + oldUser.id, "PUT",JSON.stringify({username, date_of_birth, language, roleId, password}), true);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Failed to fetch user data:", error);
    }
}
