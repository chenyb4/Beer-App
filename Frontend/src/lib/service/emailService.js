import {request} from "$lib/service/config.js";

export async function getQRandSendMail(userID) {
    try {
        const response = await request( "/mail?id=" + userID, "POST", true);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Failed to fetch user data:", error);
    }
}