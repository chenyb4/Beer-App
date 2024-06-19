<script>
import {SidebarItem} from "flowbite-svelte";

export let title;
export let site = "";

export let blur = "";
</script>

<SidebarItem label={title} href="{site}" class="{blur}">
    <svelte:fragment slot="icon">
    </svelte:fragment>
</SidebarItem>