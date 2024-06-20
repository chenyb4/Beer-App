import {request} from "$lib/service/config.js";

export async function getAllInventoyHistories(page=1,pageSize=8){
    try {
        const response = await request( `/histories/inventory?page=${page}&pageSize=${pageSize}`, "GET", '', true);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Failed to fetch products data:", error);
    }
}
