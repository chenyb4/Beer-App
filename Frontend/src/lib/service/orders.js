let env = import.meta.env;


export async function createOrder(buyerId) {
    let sellerId = 1; //Should be gotten from the loggedIn user
    try {
        const response = await fetch("http://" + env.VITE_APIURL + ":" + env.VITE_APIPORT + "/orders", {
            headers: {
                "Content-Type": "application/json"
            },
            method: "POST",
            body: JSON.stringify({buyerId, sellerId})
        });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error("Failed to fetch user data:", error);
        }
}

export async function addProductsToOrder(orderId, productCart) {
    for (let [productId, productDetails] of productCart) {
      const productData = {
        productId: productId,
        quantity: productDetails.quantity
      };
      console.log(productData)
  
      const response = await fetch(`http://${env.VITE_APIURL}:${env.VITE_APIPORT}/orders/products?id=${orderId}`, {
        method: 'PUT', // Change to the appropriate method (POST, PUT, etc.)
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(productData)
      });
  
      if (!response.ok) {
        console.error('Failed to add product to order:', response.statusText);
      } else {
        console.log('Product added successfully:', productData);
      }
    }
  }