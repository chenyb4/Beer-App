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