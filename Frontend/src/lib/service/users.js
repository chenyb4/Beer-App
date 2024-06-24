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

export function isAbove18(dob = new Date().toString()) {
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const month = today.getMonth() - birthDate.getMonth();
    if (month < 0 || (month === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age >= 18;
}