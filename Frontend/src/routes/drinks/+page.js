export const ssr = false;

/** @type {import('./$types').PageLoad} */
export async function load({url}) {
    let status = url.searchParams.get("status");
    return {status};
}