<script>
import {SidebarItem} from "flowbite-svelte";

export let title;
export let site;

</script>

<SidebarItem label={title} href="/{site}">
    <svelte:fragment slot="icon">
    </svelte:fragment>
</SidebarItem>