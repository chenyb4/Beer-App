<script>
  // @ts-nocheck
  import { loadProducts } from "$lib/service/inventory";
  import { t } from "$lib/translations/index.js";
  import { createEventDispatcher, onMount } from "svelte";

  export let filteredProductsOptions = [];
  export let value = "";
  export let selectedProduct;

  let products = [];
  const dispatch = createEventDispatcher();

  function filterProductOptions() {
    filteredProductsOptions = value
      ? products.filter(
          (product) =>
            product.name.toLowerCase().includes(value.toLowerCase()) ||
            product.EAN.includes(value)
        )
      : [];
    document.getElementById("productOptions").style.display = "block";
  }

  function selectProduct(product) {
    selectedProduct = product;
    document.getElementById("productOptions").style.display = "none";
    dispatch("selectProduct", { product });
    resetInputField();
  }

  function resetInputField() {
    value = "";
    filteredProductsOptions = [];
    document.getElementById("inputSearchBar").focus();
  }

  function selectProductWithEnter(event) {
    if (event.key === "Enter" && filteredProductsOptions.length > 0) {
      selectProduct(filteredProductsOptions[0]);
    }
  }

  onMount(async () => {
    products = await loadProducts();
    console.log(products);
  });
</script>

<div id="searchBar" class="flex flex-col">
  <label class="pb-0.5" for="inputSearchBar">{$t("drinks.drinkScanner")}</label>
  <input
    class="dark:bg-dark-800 border-none rounded-lg"
    type="text"
    id="inputSearchBar"
    bind:value
    on:focus={() =>
      (document.getElementById("productOptions").style.display = "block")}
    on:input={filterProductOptions}
    on:keydown={selectProductWithEnter}
  />
  <div id="productOptions" class="block">
    {#each filteredProductsOptions as product}
      <button
        class="border border-dark-300 w-full"
        on:click={() => selectProduct(product)}>{product.name}</button
      >
    {/each}
  </div>
</div>
