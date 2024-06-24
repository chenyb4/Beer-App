<script>
  // Import necessary components and functions
  import CtaButton from "$lib/components/CtaButton.svelte";
  import TableCell from "$lib/components/table/TableCell.svelte";
  import TableHeader from "$lib/components/table/TableHeader.svelte";
  import TablePage from "$lib/components/table/TablePage.svelte";
  import CreateProduct from "$lib/components/products/CreateProduct.svelte";
  import { getProducts } from "$lib/service/inventory";
  import { t } from "$lib/translations/index.js";
  import { TableBody, TableBodyRow } from "flowbite-svelte";
  import {
    CirclePlusSolid,
    EditSolid,
    TrashBinSolid,
  } from "flowbite-svelte-icons";
  import AddProductStock from "$lib/components/products/AddProductStock.svelte";
  import UpdateProduct from "$lib/components/products/UpdateProduct.svelte";
  import DeleteProduct from "$lib/components/products/DeleteProduct.svelte";
  import { onMount } from "svelte";

  // Set up an event listener on component mount
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

  // Export the data prop passed from the parent component
  /** @type {import('./$types').PageData} */
  export let data;

  // Reactively set the products array from the data
  $: products = data.products?.data || [];

  // Calculate the total number of pages based on the product data
  const pages = Math.ceil(
    data.products?.meta.total / data.products?.meta.page_size || 1
  );
  let currentPage = 1;

  // Standard style for the icons
  const iconStyle =
    "hover:cursor-pointer hover:bg-light-p_foreground dark:hover:bg-dark-p_foreground rounded h-6 w-6";

  // Dialog visibility booleans
  let openCreateProductDialog = false;
  let openAddProductStockDialog = false;
  let openUpdateProductDialog = false;
  let openDeleteProductDialog = false;

  // Current product object for operations
  let currentProduct = {
    id: 0,
    name: "",
    price_in_credits: 0,
    amount_in_stock: 0,
    EAN: "",
    isAlcoholic: true,
  };

  // Function to fetch and update products for a specific page
  async function changeProducts(page = 1, pageSize = 6) {
    const response = await getProducts(page, pageSize);
    products = response.data;
    currentPage = page;
  }

  // Open the create product dialog
  function handleOpenCreateProductDialog() {
    openCreateProductDialog = false;
    openCreateProductDialog = true;
  }

  // Open the add product stock dialog for a specific product
  function handleOpenAddProductStockDialog(product) {
    currentProduct = product;
    openAddProductStockDialog = false;
    openAddProductStockDialog = true;
  }

  // Open the update product dialog for a specific product
  function handleOpenUpdateProductDialog(product) {
    currentProduct = product;
    openUpdateProductDialog = false;
    openUpdateProductDialog = true;
  }

  // Open the delete product dialog for a specific product
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

<!-- Dialog components for product operations -->
<CreateProduct {openCreateProductDialog} onClose={changeProducts} />
<AddProductStock
  {openAddProductStockDialog}
  onClose={changeProducts}
  product={currentProduct}
/>
<UpdateProduct
  {openUpdateProductDialog}
  onClose={changeProducts}
  product={currentProduct}
/>
<DeleteProduct
  {openDeleteProductDialog}
  onClose={changeProducts}
  product={currentProduct}
/>

<!-- Table to display the products -->
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
  />
  <TableBody>
    {#if products.length > 0}
      {#each products as product}
        <TableBodyRow>
          <TableCell position="first">{product.name}</TableCell>
          <TableCell position="middle">{product.amount_in_stock}</TableCell>
          <TableCell position="last">
            <div class="flex flex-row justify-evenly">
              <!-- Button to open add product stock dialog -->
              <button on:click={handleOpenAddProductStockDialog(product)}>
                <CirclePlusSolid class={iconStyle} />
              </button>
              <!-- Button to open update product dialog -->
              <button on:click={handleOpenUpdateProductDialog(product)}>
                <EditSolid class={iconStyle} />
              </button>
              <!-- Button to open delete product dialog -->
              <button on:click={handleDeleteProductDialog(product)}>
                <TrashBinSolid class={iconStyle} />
              </button>
            </div>
          </TableCell>
        </TableBodyRow>
      {/each}
    {:else}
      <!-- Show message if no products are found -->
      <TableBodyRow>
        <TableCell position="first">No products found!</TableCell>
      </TableBodyRow>
    {/if}
  </TableBody>
</TablePage>
