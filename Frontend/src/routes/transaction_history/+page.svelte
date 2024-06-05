<script>
    import { t } from "$lib/translations/index.js";
    import {TableBody, TableBodyRow} from "flowbite-svelte";
    import TableHeader from "$lib/components/table/TableHeader.svelte";
    import CtaButton from "$lib/components/CtaButton.svelte";
    import TableCell from "$lib/components/table/TableCell.svelte";
    import TablePage from "$lib/components/table/TablePage.svelte";

    let dummyData = [
        {
            studentNumber: 510893,
            credits: 60,
            barkeeper: "Danfny",
            date: "2024-6-1"
        },
        {
            studentNumber: 510893,
            credits: 60,
            barkeeper: "Danny",
            date: "2024-6-1"
        },
        {
            studentNumber: 510893,
            credits: 60,
            barkeeper: "Danny",
            date: "2024-6-1"
        },
        {
            studentNumber: 510893,
            credits: 60,
            barkeeper: "Danny",
            date: "2024-6-1"
        }
    ];

    let pages=5;
    let currentPage=2;


</script>







<body class="h-full w-full">
<TablePage {pages} {currentPage} title={$t("transaction_history.title")}>
    <TableHeader headerValues= {[
                $t('transaction_history.studentNumber'),
                $t('transaction_history.credits'),
                $t('transaction_history.barkeeper'),
                $t('transaction_history.date')
            ]}>
    </TableHeader>


    <TableBody>
        {#each dummyData as entry}
        <TableBodyRow>
            <TableCell position="first">{entry.studentNumber}</TableCell>
            <TableCell position="middle">{entry.credits}</TableCell>
            <TableCell position="last">{entry.barkeeper}</TableCell>
            <TableCell position="last">{entry.date}</TableCell>
        </TableBodyRow>
        {/each}
    </TableBody>
</TablePage>
</body>







