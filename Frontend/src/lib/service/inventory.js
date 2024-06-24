import {request} from "$lib/service/config.js";
/**
 * 
 * @returns 
 */
export async function loadProducts() {
    try {
        const response = await request( "/products", "GET", '', true);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      let jsonData = await response.json();
      return jsonData.data;
    } catch (error) {
      console.error("Failed to fetch user data:", error);
    }
  }
/**
 * 
 * @param {*} page 
 * @param {*} pageSize 
 * @returns 
 */
  export async function getProducts(page, pageSize) {
    try {
        const response = await request( `/products?pageSize=${pageSize}&page=${page}`, "GET", '', true);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Failed to fetch products data:", error);
    }
}
/**
 * 
 * @param {*} name 
 * @param {*} price_in_credits 
 * @param {*} amount_in_stock 
 * @param {*} EAN 
 * @param {*} isAlcoholic 
 * @returns 
 */
export async function createProduct(name, price_in_credits, amount_in_stock, EAN, isAlcoholic) {
  try {
      const response = await request( `/products`, "POST", JSON.stringify({name, price_in_credits, amount_in_stock, EAN, isAlcoholic}), true);
  if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
  }
  return await response.json();
  } catch (error) {
    console.error("Failed to create product", error);
  }
}
/**
 * 
 * @param {*} amount_in_stock 
 * @param {*} productID 
 */
  export async function updateAmountInStock(amount_in_stock, productID) {
    try {
        const response = await request( `/products/?id=${productID}`, "PUT", JSON.stringify({amount_in_stock}), true);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    console.log(await response.json());
    } catch (error) {
      console.error("Failed to edit product", error);
    }
  }

  /**
   * 
   * @param {*} product 
   * @param {*} name 
   * @param {*} price_in_credits 
   * @param {*} amount_in_stock 
   * @param {*} EAN 
   * @param {*} isAlcoholic 
   */
  export async function updateProduct(product, name = product.name, price_in_credits = product.price_in_credits, amount_in_stock = product.amount_in_stock, EAN = product.EAN, isAlcoholic = product.isAlcoholic) {
    try {
        const response = await request( `/products/?id=${product.id}`, "PUT", JSON.stringify({name, price_in_credits, amount_in_stock, EAN, isAlcoholic}), true);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    } catch (error) {
      console.error("Failed to edit product", error);
    }
  }

  /**
   * 
   * @param {*} productID 
   */
  export async function deleteProduct(productID) {
    try {
        const response = await request( `/products/?id=${productID}`, "DELETE", '', true);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      console.log("Product deleted successfully");
    } catch (error) {
      console.error("Failed to delete product", error);
    }
  }