<script>
  // @ts-nocheck
  import { loadProducts } from "$lib/service/inventory";
  import { t } from "$lib/translations/index.js";
  import { createEventDispatcher, onMount } from "svelte";

  export let filteredProductsOptions = [];
  export let value = "";
  export let selectedProduct;
  export let identifiedUser;

  let elementInputSearchbar;

  let products = [];
  const dispatch = createEventDispatcher();

  $: if (elementInputSearchbar) {
    if (identifiedUser) {
      elementInputSearchbar.removeAttribute("disabled");
    } else {
      elementInputSearchbar.setAttribute("disabled", true);
    }
  }

  function filterProductOptions() {
    const isAdult = isAbove18(identifiedUser.date_of_birth);
    filteredProductsOptions = value
      ? products.filter((product) => {
          const matchesSearch =
            product.name.toLowerCase().includes(value.toLowerCase()) ||
            product.EAN.includes(value);
          const allowedProduct = isAdult || !product.isAlcoholic;
          return matchesSearch && allowedProduct;
        })
      : [];
    document.getElementById("productOptions").style.display = "block";
  }

  function isAbove18(dob = new Date()) {
    console.log(dob);
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const month = today.getMonth() - birthDate.getMonth();
    if (month < 0 || (month === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age >= 18;
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
    bind:this={elementInputSearchbar}
    disabled
    class="dark:bg-dark-800 border-none rounded-lg"
    type="text"
    id="inputSearchBar"
    bind:value
    on:focus={() =>
      (document.getElementById("productOptions").style.display = "block")}
    on:input={filterProductOptions}
    on:keydown={selectProductWithEnter}
  />
  <div class="relative">
    <div id="productOptions" class="block absolute w-full">
      {#each filteredProductsOptions as product}
        <button
          class="border border-dark-300 w-full bg-dark-900"
          on:click={() => selectProduct(product)}>{product.name}</button
        >
      {/each}
    </div>
  </div>
</div>
