import { getProducts } from "$lib/service/inventory";

export const ssr = false;

/** @type {import('./$types').PageLoad} */
export async function load() {
    const products = await getProducts();
    return {products};
}