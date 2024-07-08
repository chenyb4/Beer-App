import {request} from "$lib/service/config.js";

export async function getAllOrders(page = 1, pageSize = 5) {
    try {
        const response = await request(`/orders?page=${page}&pageSize=${pageSize}`, "GET", '', true);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Failed to fetch products data:", error);
    }
}

export async function getOneOrderById(orderId) {
    try {
        const response = await request(`/orders?id=${orderId}`, "GET", '', true);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Failed to fetch products data:", error);
    }
}

export async function undoTransaction(orderId) {
    try {
        const response = await request("/histories/undo?orderId=" + orderId, "POST", "", true);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Failed to fetch user data:", error);
    }
}
