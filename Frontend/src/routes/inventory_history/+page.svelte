<script>
    import {t} from "$lib/translations/index.js";
    import {TableBody, TableBodyRow} from "flowbite-svelte";
    import TableHeader from "$lib/components/table/TableHeader.svelte";
    import TableCell from "$lib/components/table/TableCell.svelte";
    import TablePage from "$lib/components/table/TablePage.svelte";
    import {getAllOrders} from "../../lib/service/transactions.js";
    import {getAllInventoyHistories} from "../../lib/service/inventoryHistory.js";


    /** @type {import('./$types').PageData} */
    export let data;
    //this is an array of order objects
    let allInventoryHistories = data.allInventoryHistories.data;
    let currentPage = 1;
    const pages = Math.ceil(data.allInventoryHistories.meta.total / data.allInventoryHistories.meta.page_size);

    async function changeInventoryHistory(page = 1) {
        const response = await getAllInventoyHistories(page);
        allInventoryHistories = response.data;
        currentPage = page;
    }

</script>

<TablePage title={$t("inventory_history.inventoryHistory")} {currentPage} changeData={changeInventoryHistory} {pages}>
    <TableHeader headerValues={[
                $t('inventory_history.drink'),
                $t('inventory_history.amount'),
                $t('inventory_history.barkeeper'),
                $t('inventory_history.date')
            ]}>
    </TableHeader>


    {#if allInventoryHistories.length==0}
        <p>{$t('inventory_history.message_no_data')}</p>
    {:else}
        <TableBody>
            {#each allInventoryHistories as entry}
                <TableBodyRow>
                    <TableCell position="first">{entry.productName}</TableCell>
                    {#if (entry.action == 0)}
                        <TableCell position="middle">{entry.description.inventory_change}</TableCell>
                    {:else}
                        <TableCell position="middle">-{entry.description.inventory_change}</TableCell>
                    {/if}
                    <TableCell position="middle">{entry.username}</TableCell>
                    <TableCell position="last">{entry.createdAt}</TableCell>
                </TableBodyRow>
            {/each}
        </TableBody>
    {/if}



</TablePage>
