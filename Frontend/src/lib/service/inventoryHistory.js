import {request} from "$lib/service/config.js";

export async function getAllInventoyHistories(){
    try {
        const response = await request( `/histories/inventory`, "GET", '', true);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Failed to fetch products data:", error);
    }
}
