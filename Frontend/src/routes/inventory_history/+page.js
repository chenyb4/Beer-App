import {getAllInventoyHistories} from "$lib/service/inventoryHistory.js";

/** @type {import('./$types').PageLoad} */
export async function load(){
    const allInventoryHistories=await getAllInventoyHistories();
    return {allInventoryHistories}
}
