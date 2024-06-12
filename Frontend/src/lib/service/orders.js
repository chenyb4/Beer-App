export async function createOrder(buyerId, products) {
    let sellerId = 1; //Should be gotten from the loggedIn user
    let amount_of_credits = 0;
    products.forEach(product => {
        amount_of_credits += product.price_in_credits;
    });
    try {
        const response = await fetch("http://" + import.meta.env.VITE_APIURL + ":" + import.meta.env.VITE_APIPORT + "/orders", {
            headers: {
                "Content-Type": "application/json"
            },
            method: "POST",
            body: JSON.stringify({amount_of_credits, buyerId, sellerId})
        });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error("Failed to fetch user data:", error);
        }}