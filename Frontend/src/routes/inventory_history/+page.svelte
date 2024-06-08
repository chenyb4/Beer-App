<script>
    import {t} from "$lib/translations/index.js";
    import {TableBody, TableBodyRow} from "flowbite-svelte";
    import TableHeader from "$lib/components/table/TableHeader.svelte";
    import TableCell from "$lib/components/table/TableCell.svelte";
    import TablePage from "$lib/components/table/TablePage.svelte";





    // /** @type {import('./$types').PageData} */
    // export let data;
    // //this is an array of order objects
    // let allOrders = data.allOrders.data;
    // console.log(allOrders)


    let inventoryHistory=[
        {
            drink:"beer",
            amount:50,
            barkeeper:"Danny",
            date:"2025-5-5"
        },
        {
            drink:"beer",
            amount:50,
            barkeeper:"Danny",
            date:"2025-5-5"
        },
        {
            drink:"beer",
            amount:50,
            barkeeper:"Danny",
            date:"2025-5-5"
        }
    ]




</script>


<body class="m-4 w-full overflow-auto p-5 bg-light-s_bg dark:bg-dark-s_bg rounded-2xl">
<TablePage title={$t("inventory_history.inventoryHistory")}>
    <TableHeader headerValues={[
                $t('inventory_history.drink'),
                $t('inventory_history.amount'),
                $t('inventory_history.barkeeper'),
                $t('inventory_history.date')
            ]}>
    </TableHeader>


    <TableBody>
        {#each inventoryHistory as entry}
            <TableBodyRow>
                <TableCell position="first">{entry.drink}</TableCell>
                <TableCell position="middle">{entry.amount}</TableCell>
                <TableCell position="middle">{entry.barkeeper}</TableCell>
                <TableCell position="last">{entry.date}</TableCell>
            </TableBodyRow>
        {/each}
    </TableBody>
</TablePage>




</body>







