let env = import.meta.env;

export async function loadProducts() {
    try {
      const response = await fetch(
        `http://${env.VITE_APIURL}:${env.VITE_APIPORT}/products`
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

  export async function getProducts(page = 1, pageSize = 10) {
    try {
        const response = await fetch(`http://${env.VITE_APIURL}:${env.VITE_APIPORT}/products?pageSize=${pageSize}&page=${page}`, {
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

export async function createProduct(name, price_in_credits, amount_in_stock, EAN) {
  try {
    const response = await fetch(`http://${env.VITE_APIURL}:${env.VITE_APIPORT}/products`, {
      headers: {
          "Content-Type": "application/json"
      },
      method: "POST",
      body: JSON.stringify({name, price_in_credits, amount_in_stock, EAN})
  });

  if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
  }
  return await response.json();
  } catch (error) {
    console.error("Failed to create product", error);
  }
}
