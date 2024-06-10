import {getDefaultCredits} from "$lib/service/credits.js";

/** @type {import('./$types').PageLoad} */
export async function load(){
    const defaultCredits=await getDefaultCredits();
    return {defaultCredits};
}
