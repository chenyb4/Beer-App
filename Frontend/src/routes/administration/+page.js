import {getUsers, getRoles} from "$lib/service/administration.js";

/** @type {import('./$types').PageLoad} */
export async function load() {
    const roles = await getRoles();
    const users = await getUsers();
    return {users, roles};
}