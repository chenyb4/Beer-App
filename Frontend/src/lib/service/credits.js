import {request} from "$lib/service/config.js";


export async function getDefaultCredits(){
    try {
        const response = await request(`/credits?id=2`, "GET", '', true);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Failed to fetch products data:", error);
    }
}

export async function addCreditsForAUser(id, creditsToAdd) {
    try {
        const response = await request(`/users/credits?id=${id}`, "PUT", JSON.stringify({ amount: creditsToAdd }), true);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Failed to fetch products data:", error);
    }
}

