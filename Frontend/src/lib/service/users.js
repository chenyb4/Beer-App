import {request} from "$lib/service/config.js";

export async function getUserByQRIdentifier(identifier) {
    try {
        const response = await request( "/users?qr_identifier=" + identifier, "GET", "", true);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Failed to fetch user data:", error);
        throw error;
    }
}

export async function getUserById(userId) {
    try {
        const response = await request( `/users/${userId}`, "GET", "", true);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Failed to fetch user data:", error);
        throw error;
    }
}
