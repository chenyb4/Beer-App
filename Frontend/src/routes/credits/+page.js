import {getDefaultCredits} from "$lib/service/credits.js";

export const ssr = false;

/** @type {import('./$types').PageLoad} */
export async function load(){
    const defaultCredits=await getDefaultCredits();
    return {defaultCredits};
}
