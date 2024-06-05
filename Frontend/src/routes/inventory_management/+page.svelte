<script>
  import TableCell from "$lib/components/table/TableCell.svelte";
import TableHeader from "$lib/components/table/TableHeader.svelte";
  import TablePage from "$lib/components/table/TablePage.svelte";
import {t} from "$lib/translations/index.js";
  import { TableBody, TableBodyRow } from "flowbite-svelte";

  let pages = 2;
  let currentPage = 1;
</script>

<body class="h-full w-full">
            <TablePage {pages} {currentPage} title={$t("inventory_management.title")}>
            <TableHeader headerValues= {[
                "Name",
                "Stock",
                ""
            ]}></TableHeader>
            <TableBody>
                <TableBodyRow>
                <TableCell position="first">Heineken</TableCell>
                <TableCell position="middle">24</TableCell>
                <TableCell position="last">+</TableCell>
            </TableBodyRow>
            </TableBody></TablePage>
</body>