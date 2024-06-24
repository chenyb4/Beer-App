<script>
    import CtaButton from "$lib/components/universal/CtaButton.svelte";
    import TableCell from "$lib/components/table/TableCell.svelte";
    import TableHeader from "$lib/components/table/TableHeader.svelte";
    import TablePage from "$lib/components/table/TablePage.svelte";
    import CreateProduct from "$lib/components/products/CreateProduct.svelte";
    import {getProducts} from "$lib/service/inventory";
    import {t} from "$lib/translations/index.js";
    import {Input, TableBody, TableBodyRow} from "flowbite-svelte";
    import {
        CirclePlusSolid,
        EditSolid,
        TrashBinSolid,
    } from "flowbite-svelte-icons";
    import AddProductStock from "$lib/components/products/AddProductStock.svelte";
    import UpdateProduct from "$lib/components/products/UpdateProduct.svelte";
    import DeleteProduct from "$lib/components/products/DeleteProduct.svelte";
    import {onMount} from "svelte";

    onMount(() => {
        document.body.addEventListener(
            "keydown",
            function (event) {
                products.forEach((product) => {
                    if (event === product.EAN) {
                        handleOpenAddProductStockDialog(product);
                    }
                });
            },
            true
        );
    });

    /** @type {import('./$types').PageData} */
    export let data;
    $: products = data.products?.data || [];

    const pages = Math.ceil(
        data.products?.meta.total / data.products?.meta.page_size || 1
    );
    let currentPage = 1;

    const iconStyle =
        "hover:cursor-pointer hover:bg-light-p_foreground dark:hover:bg-dark-p_foreground rounded h-6 w-6";

    let openCreateProductDialog = false;
    let openAddProductStockDialog = false;
    let openUpdateProductDialog = false;
    let openDeleteProductDialog = false;

    let currentProduct = {
        id: 0,
        name: "",
        price_in_credits: 0,
        amount_in_stock: 0,
        EAN: "",
        isAlcoholic: "",
    };

    async function changeProducts(page = 1, pageSize = 6) {
        const response = await getProducts(page, pageSize);
        products = response.data;
        currentPage = page;
    }

    function handleOpenCreateProductDialog() {
        openCreateProductDialog = false;
        openCreateProductDialog = true;
    }

    function handleOpenAddProductStockDialog(product) {
        currentProduct = product;
        openAddProductStockDialog = false;
        openAddProductStockDialog = true;
    }

    function handleOpenUpdateProductDialog(product) {
        currentProduct = product;
        openUpdateProductDialog = false;
        openUpdateProductDialog = true;
    }

    function handleDeleteProductDialog(product) {
        currentProduct = product;
        openDeleteProductDialog = false;
        openDeleteProductDialog = true;
    }
</script>

<div class="fixed bottom-28 right-12 z-50">
    <CtaButton
            captionText={$t("inventory_management.addProduct")}
            onCTAButtonClickFn={handleOpenCreateProductDialog}
    />
</div>
<CreateProduct {openCreateProductDialog} onClose={changeProducts}/>
<AddProductStock
        {openAddProductStockDialog}
        onClose={changeProducts}
        product={currentProduct}
></AddProductStock>
<UpdateProduct
        {openUpdateProductDialog}
        onClose={changeProducts}
        product={currentProduct}
></UpdateProduct>
<DeleteProduct
        {openDeleteProductDialog}
        onClose={changeProducts}
        product={currentProduct}
></DeleteProduct>
<TablePage
        {pages}
        {currentPage}
        pageSize={data.products?.meta.page_size || 1}
        changeData={changeProducts}
        title={$t("inventory_management.title")}
>
    <TableHeader
            headerValues={[
      $t("inventory_management.name"),
      $t("inventory_management.stock"),
      "",
    ]}
    ></TableHeader>
    <TableBody>
        {#if products.length > 0}
            {#each products as product}
                <TableBodyRow>
                    <TableCell position="first">{product.name}</TableCell>
                    <TableCell position="middle">{product.amount_in_stock}</TableCell>
                    <TableCell position="last"
                    >
                        <div class="flex flex-row justify-evenly">
                            <button on:click={handleOpenAddProductStockDialog(product)}
                            >
                                <CirclePlusSolid class={iconStyle}></CirclePlusSolid>
                            </button
                            >
                            <button on:click={handleOpenUpdateProductDialog(product)}>
                                <EditSolid class={iconStyle}></EditSolid>
                            </button>
                            <button on:click={handleDeleteProductDialog(product)}>
                                <TrashBinSolid class={iconStyle}></TrashBinSolid>
                            </button>
                        </div>
                    </TableCell>
                </TableBodyRow>
            {/each}
        {:else}
            <TableBodyRow>
                <TableCell position="first">No products found!</TableCell>
            </TableBodyRow>
        {/if}
    </TableBody>
</TablePage>
