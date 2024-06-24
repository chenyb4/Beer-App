<script>
    import {t} from "$lib/translations/index.js";
    import {Button, TableBody, TableBodyRow} from "flowbite-svelte";
    import TableHeader from "$lib/components/table/TableHeader.svelte";
    import TableCell from "$lib/components/table/TableCell.svelte";
    import TablePage from "$lib/components/table/TablePage.svelte";
    import {getAllInventoyHistories} from "../../lib/service/inventoryHistory.js";
    import { dateToString } from "$lib/service/dateToString.js";
    import {dateToStringWithTime} from "../../lib/service/dateToString.js";
    import TableCellWithInputs from "$lib/components/table/TableCellWithInputs.svelte";
    import {undoHistory} from "../../lib/service/inventoryHistory.js";


    /** @type {import('./$types').PageData} */
    export let data;
    //this is an array of order objects
    let allInventoryHistories = data.allInventoryHistories.data;
    let currentPage = 1;
    const pages = Math.ceil(data.allInventoryHistories.meta.total / data.allInventoryHistories.meta.page_size);

    async function changeInventoryHistory(page = 1) {
        const response = await getAllInventoyHistories(page) || [];
        allInventoryHistories = response.data;
        currentPage = page;
    }

    async function undo(historyId) {
        const result = await undoHistory(historyId)
        await changeInventoryHistory()
    }

</script>

<TablePage title={$t("inventory_history.inventoryHistory")} {currentPage} changeData={changeInventoryHistory} {pages}>
    <TableHeader
        headerValues={[
            $t('inventory_history.drink'),
            $t('inventory_history.amount'),
            $t('inventory_history.barkeeper'),
            $t('inventory_history.date'),
            $t("transaction_history.undo"),
        ]}>
    </TableHeader>


    {#if allInventoryHistories.length === 0}
        <p>{$t('inventory_history.message_no_data')}</p>
    {:else}
        <TableBody>
            {#each allInventoryHistories as entry}
                <TableBodyRow>
                    <TableCell position="first">{entry.productName}</TableCell>
                    {#if (entry.action === 0)}
                        <TableCell position="middle">{entry.description.inventory_change}</TableCell>
                    {:else}
                        <TableCell position="middle">-{entry.description.inventory_change}</TableCell>
                    {/if}
                    <TableCell position="middle">{entry.username}</TableCell>
                    <TableCell position="middle">{dateToStringWithTime(entry.createdAt)}</TableCell>
                    <TableCellWithInputs position="last">
                        <Button
                                class="w-full bg-light-p_foreground dark:bg-dark-p_foreground font-medium rounded-full text-lg text-center"
                                on:click={() => undo(entry.id)}
                        >
                            Undo
                        </Button>
                    </TableCellWithInputs>
                </TableBodyRow>
            {/each}
        </TableBody>
    {/if}



</TablePage>
