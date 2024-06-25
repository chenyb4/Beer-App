<script>
  import { t } from "$lib/translations/index.js";
  import { onMount } from "svelte";
  import ProductSearchBar from "$lib/components/products/ProductSearchBar.svelte";
  import StudentIdentifier from "$lib/components/StudentIdentifier.svelte";
  import { CloseOutline, TrashBinSolid } from "flowbite-svelte-icons";
  import {
    addProductsToOrder,
    confirmOrder,
    createOrder,
  } from "$lib/service/orders";
  import { Alert, Button } from "flowbite-svelte";
  import { goto } from "$app/navigation";

  let ref = {};
  let identifiedUser = {};
  let identifier = "";
  let userName = "";
  let drinksScanner = "";
  let product = {};
  let selectedProducts = [];
  let errorMessage = "";
  let productCart = new Map();

  let elementInputSearchbar;
  $: scannerActive = true;

  //Loading sound and setting the volume
  let checkoutSound = new Audio("sound-effects/checkout_sound.mp3");
  checkoutSound.volume = 0.3;

  export let data;

  function handleSelectProduct(event) {
    //Getting constant values from the product;
    const selectedProduct = event.detail.product;
    const stockAmount = selectedProduct.amount_in_stock;
    const productPrice = selectedProduct.price_in_credits;

    //Making sure user cant buy product without enough credits.
    if (identifiedUser.credits < productPrice) {
      alert("You do not have enough credits to purchase this product.");
      return;
    }
    //Check if the Map already contains the product
    if (productCart.has(selectedProduct.id)) {
      const currentQuantity = productCart.get(selectedProduct.id).quantity;
      //Check if the amount in the cart exceeds the amount in stock.
      if (currentQuantity < stockAmount) {
        productCart.set(selectedProduct.id, {
          ...selectedProduct,
          quantity: currentQuantity + 1,
        });
        // Deduct the price from user's credits
        identifiedUser.credits -= productPrice;
      } else {
        alert("Product quantity exceeds stock amount.");
        return;
      }
      //New type of product is added.
    } else {
      if (stockAmount > 0) {
        if (identifiedUser.credits >= productPrice) {
          //Setting a new instance in the map with quantity 1
          productCart.set(selectedProduct.id, {
            ...selectedProduct,
            quantity: 1,
          });
          // Deduct the price from user's credits
          identifiedUser.credits -= productPrice;
        } else {
          alert("You do not have enough credits to purchase this product.");
          return;
        }
      } else {
        alert("Product is out of stock.");
        return;
      }
    }
    //Set the new array
    selectedProducts = Array.from(productCart.values());
  }

  async function handleSubmitOrder() {
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
    const order = await createOrder(identifiedUser.id);
    if (order) {
      await addProductsToOrder(order.id, productCart);
      await confirmOrder(order.id);
      checkoutSound.play();
      clearFields();
    }
  }

  function removeProductFromCart(product) {
    if (productCart.has(product.id)) {
      let currentProduct = productCart.get(product.id);
      const productPrice = currentProduct.price_in_credits;
      if (currentProduct.quantity > 1) {
        //If there is more than 1 of a product remove one of quantity
        productCart.set(product.id, {
          ...currentProduct,
          quantity: currentProduct.quantity - 1,
        });
        // Refund the price for one product
        identifiedUser.credits += productPrice;
      } else {
        //If this is last quantity in the cart remove the instance as a whole
        productCart.delete(product.id);
        // Refund the price for one product
        identifiedUser.credits += productPrice;
      }
    }
    //Set the new array
    selectedProducts = Array.from(productCart.values());
  }

  function switchScannerOn() {
    scannerActive = !scannerActive;
  }

  function clearFields() {
    identifier = "";
    identifiedUser = { id: 0, credits: 0 };
    selectedProducts = [];
    userName = "";
    drinksScanner = "";
    productCart.clear();
  }

  onMount(() => {
    ref.focus();
  });
</script>

<div class=" p-5 w-full">
  {#if data.status === "302"}
    <Alert color="red" class="absolute top-5 left-5" dismissable>
      <Button
        slot="close-button"
        class="hover:cursor-pointer"
        on:click={() => goto("/drinks")}
      >
        <CloseOutline />
      </Button>
      <span class="font-bold text-2xl">
        You are a seller. If you want to use other activities on this system,
        please log out and log in with admin credentials
      </span>
    </Alert>
  {/if}
  <div class="dark:bg-dark-900 bg-light-s_bg rounded-xl flex-col h-[90%]">
    <h2 class="p-4 text-3xl font-bold mb-4">{$t("drinks.title")}</h2>
    <div class="flex flex-col mx-4 mb-2">
      <div class="flex flex-row justify-between">
        <StudentIdentifier
          bind:identifiedUser
          bind:identifier
          bind:userName
          bind:ref
        />
        {#if identifiedUser.credits}
          <div
            class="dark:bg-dark-p_foreground bg-light-p_foreground w-64 p-4 rounded-2xl flex-col items-center"
          >
            <h4>Amount of credits left:</h4>
            <p class="flex justify-center text-4xl">
              {identifiedUser.credits}
            </p>
          </div>
        {/if}
      </div>
      <div class="w-72">
        <ProductSearchBar
          bind:value={drinksScanner}
          bind:selectedProduct={product}
          on:selectProduct={handleSelectProduct}
          bind:elementInputSearchbar
          bind:identifiedUser
        />
      </div>
      <div
        class="dark:bg-dark-800 bg-light-p_bg w-full mt-4 flex flex-col min-h-64 rounded-xl overflow-auto px-4"
      >
        <div class="grid grid-cols-6 gap-2 font-bold">
          <div class="col-span-3">Product</div>
          <div class="col-span-2 flex items-center justify-center text-center">
            {$t("drinks.numberOfItems")}
          </div>
          <div class="col-span-1 flex items-center justify-center text-center">
            {$t("drinks.remove")}
          </div>
        </div>

        {#each selectedProducts as product}
          {#if product.name}
            <div
              class="grid grid-cols-6 gap-2 mt-2 dark:bg-dark-900 bg-light-s_bg rounded-xl p-4"
            >
              <div class="col-span-3">
                {product.name}
              </div>
              <div
                class="col-span-2 flex justify-center text-center items-center"
              >
                {product.quantity}
              </div>
              <div
                class="col-span-1 flex justify-center text-center items-center"
              >
                <button on:click={() => removeProductFromCart(product)}
                  ><svelte:component
                    this={TrashBinSolid}
                    class="text-light-p_foreground dark:text-dark-p_foreground h-full"
                  /></button
                >
              </div>
            </div>
          {/if}
        {/each}
      </div>
      {#if errorMessage}
        <p class="text-red-400 px-3">{errorMessage}</p>
      {/if}
      <Button
        class="bg-light-p_foreground dark:bg-dark-p_foreground my-5 rounded-xl"
        on:click={handleSubmitOrder}>SUBMIT</Button
      >
    </div>
  </div>
</div>
