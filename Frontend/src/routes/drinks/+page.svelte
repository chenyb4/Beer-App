<script>
  // @ts-nocheck

  import { t } from "$lib/translations/index.js";
  import { onMount } from "svelte";
  import DrinkSearchBar from "$lib/components/DrinkSearchBar.svelte";
  import StudentIdentifier from "$lib/components/StudentIdentifier.svelte";
  import CtaButton from "$lib/components/CtaButton.svelte";
  import { TrashBinSolid } from "flowbite-svelte-icons";
  import { createOrder } from "$lib/service/orders";

  let ref;
  let identifiedUser;
  let identifier;
  let userName;
  let drinksScanner;
  let product;
  let selectedProducts = [];
  let errorMessage = "";

  function handleSelectProduct(event) {
    const selectedProduct = event.detail.product;
    selectedProducts = [...selectedProducts, selectedProduct];
  }

  function handleSubmitOrder() {
    if (!identifiedUser) {
      errorMessage = "User must be identified before submitting an order.";
      return;
    }

    if (selectedProducts.length === 0) {
      errorMessage =
        "At least one product must be selected before submitting an order.";
      return;
    }
    errorMessage = "";
    createOrder(identifiedUser.id, selectedProducts);
    clearFields();
  }

  function removeProductFromCart(product) {
    selectedProducts = selectedProducts.filter(p => p.id !== product.id);
  }
  

  function clearFields() {
    identifier = "";
    identifiedUser = "";
    selectedProducts= "";
    userName= "";
    drinksScanner = "";
  }
  onMount(() => {
    ref.focus();
  });
</script>

<body class="bg-dark-800 w-screen h-screen">
  <div class="w-full h-full">
    <div class="bg-dark-900 m-4 rounded-xl">
      <h2 class="p-4 font-bold">{$t("drinks.title")}</h2>
      <div class="flex flex-col mx-4">
        <div class="flex flex-row justify-between">
          <StudentIdentifier
            bind:identifiedUser
            bind:identifier
            bind:userName
            bind:ref
          />
          {#if identifiedUser}
            <div class="bg-dark-300 w-64 p-4 rounded-2xl flex-col items-center">
              <h4>Amount of credits left:</h4>
              <p class="flex justify-center text-4xl">
                {identifiedUser.credits}
              </p>
            </div>
          {/if}
        </div>
        <div class=" w-72">
          <DrinkSearchBar
            bind:value={drinksScanner}
            bind:selectedProduct={product}
            on:selectProduct={handleSelectProduct}
          />
        </div>
        <div
          class="bg-dark-800 w-full h-full my-6 flex flex-col min-h-80 rounded-xl"
        >
          <div class="px-4 py-2">
            <div class="grid grid-cols-6 gap-2 font-bold">
              <div class="col-span-3">Product</div>
              <div
                class="col-span-2 flex items-center justify-center text-center"
              >
                {$t("drinks.numberOfItems")}
              </div>
              <div
                class="col-span-1 flex items-center justify-center text-center"
              >
                {$t("drinks.remove")}
              </div>
            </div>

            {#each selectedProducts as product}
              <div
                class="grid grid-cols-6 gap-2 mt-2 bg-dark-900 rounded-xl p-4"
              >
                <div class="col-span-3">
                  {product.name}
                </div>
                <div
                  class="col-span-2 flex justify-center text-center items-center"
                >
                  1
                </div>
                <div
                  class="col-span-1 flex justify-center text-center items-center"
                >
                 <button on:click={removeProductFromCart(product)}><svelte:component
                    this={TrashBinSolid}
                    class="text-light-p_foreground h-full"
                  /></button>
                </div>
              </div>
            {/each}
          </div>
        </div>
        {#if errorMessage}
          <p class="text-red-400 px-4">{errorMessage}</p>
        {/if}
        <CtaButton captionText="Submit" onCTAButtonClickFn={handleSubmitOrder}
        ></CtaButton>
      </div>
    </div>
  </div>
</body>
