export async function loadProducts() {
    try {
      const response = await fetch(
        `http://${import.meta.env.VITE_APIURL}:${import.meta.env.VITE_APIPORT}/products`
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
        const response = await fetch(`http://${import.meta.env.VITE_APIURL}:${import.meta.env.VITE_APIPORT}/products?pageSize=${pageSize}&page=${page}`, {
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
    const response = await fetch(`http://${import.meta.env.VITE_APIURL}:${import.meta.env.VITE_APIPORT}/products`, {
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
  export async function updateAmountInStock(amount_in_stock, productID) {
    try {
      const response = await fetch(`http://${import.meta.env.VITE_APIURL}:${import.meta.env.VITE_APIPORT}/products/?id=${productID}`, {
        headers: {
            "Content-Type": "application/json"
        },
        method: "PUT",
        body: JSON.stringify({amount_in_stock})
    });
  
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    console.log(await response.json());
    } catch (error) {
      console.error("Failed to edit product", error);
    }
  }

  export async function updateProduct(product, name = product.name, price_in_credits = product.price_in_credits, amount_in_stock = product.amount_in_stock, EAN = product.EAN) {
    try {
      const response = await fetch(`http://${import.meta.env.VITE_APIURL}:${import.meta.env.VITE_APIPORT}/products/?id=${product.id}`, {
        headers: {
            "Content-Type": "application/json"
        },
        method: "PUT",
        body: JSON.stringify({name, price_in_credits, amount_in_stock, EAN})
    });
  
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    console.log(await response.json());
    } catch (error) {
      console.error("Failed to edit product", error);
    }
  }

  export async function deleteProduct(productID) {
    try {
      const response = await fetch(`http://${import.meta.env.VITE_APIURL}:${import.meta.env.VITE_APIPORT}/products/?id=${productID}`, {
        headers: {
          "Content-Type": "application/json"
        },
        method: "DELETE"
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      console.log("Product deleted successfully");
    } catch (error) {
      console.error("Failed to delete product", error);
    }
  }