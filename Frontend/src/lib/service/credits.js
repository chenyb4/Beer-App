export async function loadDefaultCredits(){
    try {
        const response = await fetch(
            `http://${import.meta.env.VITE_APIURL}:${import.meta.env.VITE_APIPORT}/credits?id=2`
        );

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        let jsonData = await response.json();
        return jsonData.data;
    } catch (error) {
        console.error("Failed to fetch user data:", error);
    }
}

export async function getDefaultCredits(){
    try {
        const response = await fetch(`http://${import.meta.env.VITE_APIURL}:${import.meta.env.VITE_APIPORT}/credits?id=2`, {
            headers: {
                "Content-Type": "application/json"
            },
            method: "GET",
        });
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
        const response = await fetch(`http://${import.meta.env.VITE_APIURL}:${import.meta.env.VITE_APIPORT}/users/credits?id=${id}`, {
            headers: {
                "Content-Type": "application/json"
            },
            method: "PUT",
            body: JSON.stringify({ amount: creditsToAdd })
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Failed to fetch products data:", error);
    }
}

