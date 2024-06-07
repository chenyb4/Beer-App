<script>
    import { t } from "$lib/translations/index.js";
    import {TableBody, TableBodyRow} from "flowbite-svelte";
    import TableHeader from "$lib/components/table/TableHeader.svelte";
    import TableCell from "$lib/components/table/TableCell.svelte";
    import TablePage from "$lib/components/table/TablePage.svelte";



    /** @type {import('./$types').PageData} */
    export let data;
    //this is an array of order objects
    let allOrders=data.allOrders.data;
    console.log(allOrders)


</script>



<body class="h-full w-full">
<TablePage title={$t("transaction_history.title")}>
    <TableHeader headerValues= {[
                $t('transaction_history.buyer'),
                $t('transaction_history.credits'),
                $t('transaction_history.barkeeper'),
                $t('transaction_history.date')
            ]}>
    </TableHeader>


    <TableBody>
        {#each allOrders as entry}
        <TableBodyRow>
            <TableCell position="first">{entry.buyerId}</TableCell>
            <TableCell position="middle">{entry.amount_of_credits}</TableCell>
            <TableCell position="last">{entry.sellerId}</TableCell>
            <TableCell position="last">{entry.createdAt}</TableCell>
        </TableBodyRow>
        {/each}
    </TableBody>
</TablePage>
</body>







