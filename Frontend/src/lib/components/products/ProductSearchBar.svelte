<script>
  // @ts-nocheck
  import { loadProducts } from "$lib/service/inventory";
  import { t } from "$lib/translations/index.js";
  import { createEventDispatcher, onMount } from "svelte";

  export let filteredProductsOptions = [];
  export let value = "";
  export let selectedProduct;
  export let identifiedUser;
  export let elementInputSearchbar;

  let products = [];
  const dispatch = createEventDispatcher();

  $: if (elementInputSearchbar) {
    if (identifiedUser) {
      elementInputSearchbar.removeAttribute("disabled");
      elementInputSearchbar.focus();
    } else {
      elementInputSearchbar.setAttribute("disabled", true);
    }
  }

  function filterProductOptions() {
    // Check if the user is an adult (18+)
    const isAdult = isAbove18(identifiedUser.date_of_birth);
    // Filter products based on the search value
    filteredProductsOptions = value
      ? products.filter((product) => {
          // Check if the product name or EAN matches the search value
          const matchesSearch =
            product.name.toLowerCase().includes(value.toLowerCase()) ||
            product.EAN.includes(value);
          // Check if the product is allowed for the user (non-alcoholic for minors)
          const allowedProduct = isAdult || !product.isAlcoholic;
          // Return true if both conditions are met
          return matchesSearch && allowedProduct;
        })
      : [];
    // Display the filtered product options
    document.getElementById("productOptions").style.display = "block";
    // Check if the input length is greater than 12 characters (EAN is always 13 characters)
    if (value.length > 12) {
      // Automatically select the product by barcode if the length exceeds 12 characters
      autoSelectProductByBarcode(value);
    }
  }

  function isAbove18(dob = new Date()) {
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

  function autoSelectProductByBarcode(barcode) {
    const isAdult = isAbove18(identifiedUser.date_of_birth);
    const product = products.find(
      //Check if the EAN matches the input and the user is an adult or the product is not alcholic
      (product) => product.EAN === barcode && (isAdult || !product.isAlcoholic)
    );
    if (product) {
      selectProduct(product);
    }
  }

  onMount(async () => {
    products = await loadProducts();
  });
</script>

<div id="searchBar" class="flex flex-col">
  <label class="pb-0.5" for="inputSearchBar">{$t("drinks.drinkScanner")}</label>
  <input
    bind:this={elementInputSearchbar}
    disabled
    class="dark:bg-dark-800 bg-light-p_bg border-none rounded-lg"
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
          class="border border-light-p_foreground dark:border-dark-300 w-full bg-light-s_bg dark:bg-dark-900"
          on:click={() => selectProduct(product)}>{product.name}</button
        >
      {/each}
    </div>
  </div>
</div>
