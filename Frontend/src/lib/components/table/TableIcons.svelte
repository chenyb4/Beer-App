<script>
    import {Button} from "flowbite-svelte";
    import {
        QuestionCircleOutline,
    } from "flowbite-svelte-icons";

    export let icons = [{
        icon: QuestionCircleOutline,
        function: function () {
        }
    }]

</script>

<div class="flex gap-4">
    {#each icons as icon}
        <Button
                class="p-0 dark:text-white text-black"
                on:click={icon.function}
        >
            <svelte:component
                    this={icon.icon}
                    class="hover:cursor-pointer hover:bg-light-p_foreground dark:hover:bg-dark-p_foreground rounded h-6 w-6"/>
        </Button>
    {/each}
</div>