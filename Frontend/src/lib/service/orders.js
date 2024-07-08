import {request} from "$lib/service/config.js";

/**
 * 
 * @param {*} buyerId 
 * @returns 
 *
 */
export async function createOrder(buyerId) {
    try {
        const response = await request( `/orders`, "POST", JSON.stringify({buyerId}), true);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error("Failed to fetch user data:", error);
        }
}

/**
 * 
 * @param {*} orderId 
 * @param {*} productCart 
 */
export async function addProductsToOrder(orderId, productCart) {
    for (let [productId, productDetails] of productCart) {
      const productData = {
        productId: productId,
        quantity: productDetails.quantity
      };
        const response = await request( `/orders/products?id=${orderId}`, "PUT", JSON.stringify(productData), true);
  
      if (!response.ok) {
        console.error('Failed to add product to order:', response.statusText);
      }
    }
  }

  export async function confirmOrder(orderId) {
    try {
      const response = await request("/orders/confirm?id=" + orderId, "PUT", "", true);
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
} catch (error) {
    console.error("Failed to fetch user data:", error);
}
  }
  