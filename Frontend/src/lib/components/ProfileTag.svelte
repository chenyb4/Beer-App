<script>
import {SidebarItem} from "flowbite-svelte";

export let roleName;
export let username;

function capitalizeFirstLetter(str) {
    if (typeof str !== 'string' || str.length === 0) {
        return '';
    }
    return str.charAt(0).toUpperCase() + str.slice(1);
}
</script>

<SidebarItem label="Hello {capitalizeFirstLetter(roleName)} {capitalizeFirstLetter(username)}!" class="hover:cursor-default bg-light-p_bg dark:bg-dark-p_bg min-w-64 border-r-2 border-light-p_foreground dark:border-light-p_foreground"/>
