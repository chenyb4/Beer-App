export async function getAllOrders(){
    try {
        const response = await fetch(`http://${import.meta.env.VITE_APIURL}:${import.meta.env.VITE_APIPORT}/orders`, {
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

export async function getOneOrderById(orderId){
    try {
        const response = await fetch(`http://${import.meta.env.VITE_APIURL}:${import.meta.env.VITE_APIPORT}/orders?id=${orderId}`, {
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
