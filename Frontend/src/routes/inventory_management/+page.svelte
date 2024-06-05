<script>
import CtaButton from "$lib/components/CtaButton.svelte";
import TableCell from "$lib/components/table/TableCell.svelte";
import TableHeader from "$lib/components/table/TableHeader.svelte";
import TablePage from "$lib/components/table/TablePage.svelte";
import CreateProduct from "$lib/components/CreateProduct.svelte";
import { getProducts } from "$lib/service/inventory";
import {t} from "$lib/translations/index.js";
import { TableBody, TableBodyRow } from "flowbite-svelte";
import { CirclePlusSolid } from "flowbite-svelte-icons";


 /** @type {import('./$types').PageData} */
  // @ts-ignore
  export let data;
  $: products = data.products.data;

  const pages = Math.ceil(data.products.meta.total / data.products.meta.page_size);
  let currentPage = 1;

  const iconStyle = "hover:cursor-pointer hover:bg-light-p_foreground dark:hover:bg-dark-p_foreground rounded h-6 w-6";

  let openCreateProductDialog = false;

  async function changeProducts(page = 1, pageSize = 10) {
        const response = await getProducts(page, pageSize);
        products = response.data;
        currentPage = page;
    }

function handleOpenCreateProductDialog(){
        openCreateProductDialog = false;
        openCreateProductDialog = true;
}
</script>

<div class="fixed bottom-12 right-12 z-50">
    <CtaButton
            captionText={$t("inventory_management.addProduct")}
            onCTAButtonClickFn={handleOpenCreateProductDialog}
    />
</div>
<CreateProduct openCreateProductDialog={openCreateProductDialog} onClose={changeProducts}/>
<TablePage {pages} {currentPage} changeData={changeProducts} title={$t("inventory_management.title")}>
    <TableHeader headerValues= {[
    $t("inventory_management.name"),
    $t("inventory_management.stock"),
    ""
    ]}></TableHeader>
    <TableBody>
        {#each products as product}
        <TableBodyRow>
            <TableCell position="first">{product.name}</TableCell>
            <TableCell position="middle">{product.amount_in_stock}</TableCell>
            <TableCell position="last"><button><CirclePlusSolid class="{iconStyle}"></CirclePlusSolid></button></TableCell>
        </TableBodyRow>
        {/each}
    </TableBody>
</TablePage>
        
