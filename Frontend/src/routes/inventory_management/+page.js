import { getProducts } from "$lib/service/inventory";

/** @type {import('./$types').PageLoad} */
export async function load() {
    const products = await getProducts(1, 6);
    return {products};
}