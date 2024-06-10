import {getAllOrders} from "$lib/service/transactions.js";

/** @type {import('./$types').PageLoad} */
export async function load(){
    const allOrders=await getAllOrders();
    return {allOrders}
}
