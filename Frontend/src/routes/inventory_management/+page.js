import { getProducts } from "$lib/service/inventory";

/** @type {import('./$types').PageLoad} */
export async function load() {
    const products = await getProducts();
    return {products};
}