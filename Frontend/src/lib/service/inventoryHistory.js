let env=import.meta.env;

export async function getAllInventoyHistories(){
    try {
        const response = await fetch(`http://${env.VITE_APIURL}:${env.VITE_APIPORT}/histories/inventory`, {
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
