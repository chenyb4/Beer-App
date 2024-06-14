<script>
  import { t } from "$lib/translations/index.js";
  import { onMount } from "svelte";
  import ProductSearchBar from "$lib/components/products/ProductSearchBar.svelte";
  import StudentIdentifier from "$lib/components/StudentIdentifier.svelte";
  import CtaButton from "$lib/components/CtaButton.svelte";
  import { TrashBinSolid } from "flowbite-svelte-icons";
  import {
    addProductsToOrder,
    confirmOrder,
    createOrder,
  } from "$lib/service/orders";

  let ref = {};
  let identifiedUser;
  let identifier = "";
  let userName = "";
  let drinksScanner = "";
  let product = {};
  let selectedProducts = [];
  let errorMessage = "";
  let productCart = new Map();

  function handleSelectProduct(event) {
    //Getting constant values from the product;
    const selectedProduct = event.detail.product;
    const stockAmount = selectedProduct.amount_in_stock;
    const productPrice = selectedProduct.price_in_credits;

    if (identifiedUser.credits < productPrice) {
      alert("You do not have enough credits to purchase this product.");
      return;
    }

    if (productCart.has(selectedProduct.id)) {
      const currentQuantity = productCart.get(selectedProduct.id).quantity;

      if (currentQuantity < stockAmount) {
        productCart.set(selectedProduct.id, {
          ...selectedProduct,
          quantity: currentQuantity + 1,
        });
        identifiedUser.credits -= productPrice; // Deduct the price from user's credits
      } else {
        alert("Product quantity exceeds stock amount.");
        return;
      }
    } else {
      if (stockAmount > 0) {
        if (identifiedUser.credits >= productPrice) {
          productCart.set(selectedProduct.id, {
            ...selectedProduct,
            quantity: 1,
          });
          identifiedUser.credits -= productPrice; // Deduct the price from user's credits
        } else {
          alert("You do not have enough credits to purchase this product.");
          return;
        }
      } else {
        alert("Product is out of stock.");
        return;
      }
    }
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
    console.log(order);
    if (order) {
      await addProductsToOrder(order.id, productCart);
      await confirmOrder(order.id);
      clearFields();
    }
  }

  function removeProductFromCart(product) {
    if (productCart.has(product.id)) {
      let currentProduct = productCart.get(product.id);
      if (currentProduct.quantity > 1) {
        productCart.set(product.id, {
          ...currentProduct,
          quantity: currentProduct.quantity - 1,
        });
      } else {
        productCart.delete(product.id);
      }
    }

    selectedProducts = Array.from(productCart.values());
  }

  function clearFields() {
    identifier = "";
    identifiedUser = "";
    selectedProducts = [];
    userName = "";
    drinksScanner = "";
    productCart.clear();
  }

  onMount(() => {
    ref.focus();
  });
</script>

<div class="w-full h-full">
  <div class="bg-dark-900 m-4 rounded-xl h-[85%] flex flex-col justify-between">
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
      <div class="w-72">
        <ProductSearchBar
          bind:value={drinksScanner}
          bind:selectedProduct={product}
          on:selectProduct={handleSelectProduct}
          bind:identifiedUser
        />
      </div>
      <div
        class="bg-dark-800 w-full mt-6 flex flex-col h-80 rounded-xl overflow-auto"
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
            <div class="grid grid-cols-6 gap-2 mt-2 bg-dark-900 rounded-xl p-4">
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
                    class="text-light-p_foreground h-full"
                  /></button
                >
              </div>
            </div>
          {/each}
        </div>
      </div>
      {#if errorMessage}
        <p class="text-red-400 px-3">{errorMessage}</p>
      {/if}
    </div>
    <div class="flex justify-end mb-4 mr-4">
      <CtaButton captionText="SUBMIT" onCTAButtonClickFn={handleSubmitOrder}
      ></CtaButton>
    </div>
  </div>
</div>
