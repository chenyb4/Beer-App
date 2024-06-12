import {getAllOrders} from "$lib/service/transactions.js";

export const ssr = false;

/** @type {import('./$types').PageLoad} */
export async function load(){
    const allOrders=await getAllOrders();
    return {allOrders}
}
