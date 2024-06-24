import {request} from "$lib/service/config.js";

export async function getAllInventoyHistories(page=1,pageSize=5){
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

export async function undoHistory(historyId){
    try {
        const response = await request( `/histories/undo?historyId=${historyId}`, "POST", '', true);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Failed to fetch products data:", error);
    }
}
