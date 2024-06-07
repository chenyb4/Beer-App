<script>
    import { t } from "$lib/translations/index.js";
    import {Button, TableBody, TableBodyRow} from "flowbite-svelte";
    import TableHeader from "$lib/components/table/TableHeader.svelte";
    import TableCell from "$lib/components/table/TableCell.svelte";
    import TablePage from "$lib/components/table/TablePage.svelte";
    import { InfoCircleSolid } from 'flowbite-svelte-icons';
    const iconStyle = "hover:cursor-pointer hover:bg-light-p_foreground dark:hover:bg-dark-p_foreground rounded h-6 w-6";



    /** @type {import('./$types').PageData} */
    export let data;
    //this is an array of order objects
    let allOrders=data.allOrders.data;
    console.log(allOrders)


</script>



<body class="m-4 w-full overflow-auto p-5 bg-light-s_bg dark:bg-dark-s_bg rounded-2xl">
<TablePage title={$t("transaction_history.title")}>
    <TableHeader headerValues= {[
                $t('transaction_history.buyer'),
                $t('transaction_history.credits'),
                $t('transaction_history.details'),
                $t('transaction_history.barkeeper'),
                $t('transaction_history.date')
            ]}>
    </TableHeader>


    <TableBody>
        {#each allOrders as entry}
        <TableBodyRow>
            <TableCell position="first">{entry.buyerId}</TableCell>
            <TableCell position="middle">{entry.amount_of_credits}</TableCell>
            <TableCell position="middle">
                <Button class="p-0">
                    <InfoCircleSolid class={iconStyle}></InfoCircleSolid>
                </Button>

            </TableCell>
            <TableCell position="middle">{entry.sellerId}</TableCell>
            <TableCell position="last">{entry.createdAt}</TableCell>
        </TableBodyRow>
        {/each}
    </TableBody>
</TablePage>
</body>







