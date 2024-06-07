let env=import.meta.env;

export async function loadDefaultCredits(){
    try {
        const response = await fetch(
            `http://${env.VITE_APIURL}:${env.VITE_APIPORT}/credits?id=2`
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
        const response = await fetch(`http://${env.VITE_APIURL}:${env.VITE_APIPORT}/credits?id=2`, {
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
