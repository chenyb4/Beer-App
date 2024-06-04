<script>
    import { TableHead, TableHeadCell } from "flowbite-svelte";

    export let headerValues = ["Left", "Middle", "Right"];
</script>

<TableHead>
    {#each headerValues as headerValue, index}
        <TableHeadCell
                class="{index === 0 ? 'rounded-l-full' : ''} {index === headerValues.length - 1 ? 'rounded-r-full' : ''} px-6 py-4 border-light-s_bg dark:border-dark-s_bg text-xs uppercase bg-light-p_foreground dark:bg-dark-p_foreground">
            {headerValue}
        </TableHeadCell>
    {/each}
</TableHead>