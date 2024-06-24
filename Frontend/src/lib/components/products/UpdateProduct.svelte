<script>
  // Import necessary components from Flowbite and custom libraries
  import { Alert, Input, Label, Modal, Select } from "flowbite-svelte";
  import { t } from "$lib/translations/index.js";
  import CtaButton from "$lib/components/CtaButton.svelte";
  import { fly } from "svelte/transition";
  import { updateProduct } from "$lib/service/inventory";

  // Props passed to the component
  export let openUpdateProductDialog = false; // Controls the visibility of the modal
  export let onClose = async function () {}; // Callback function to execute on closing the modal
  export let product = {
    // Default product object
    id: 0,
    name: "",
    price_in_credits: 0,
    amount_in_stock: 0,
    EAN: "",
    isAlcoholic: false,
  };

  // Options for isAlcoholic select dropdown
  let options = [
    { value: false, name: $t("inventory_management.no") },
    { value: true, name: $t("inventory_management.yes") },
  ];

  // Helper message for validation errors
  let helper = "";
  $: hideHelper = true; // Reactive variable to control visibility of helper message

  // Function to handle form submission
  async function handleSubmit() {
    const missingFields = [];

    // Validation checks for required fields
    if (product.name.length === 0) {
      missingFields.push($t("inventory_management.name"));
    }
    if (product.price_in_credits <= 0) {
      missingFields.push($t("inventory_management.credits"));
    }
    if (product.amount_in_stock === 0) {
      missingFields.push($t("inventory_management.stock"));
    }
    if (product.amount_in_stock < 0) {
      missingFields.push($t("inventory_management.minusStock"));
    }
    if (product.EAN.length === 0) {
      missingFields.push($t("inventory_management.ean"));
    }

    // Display helper message if any fields are missing
    if (missingFields.length > 0) {
      helper = missingFields.join(", ");
      hideHelper = false;
      return;
    }

    // Call updateProduct service function to update the product
    const response = await updateProduct(product);
    if (!response) {
      openUpdateProductDialog = false; // Close the modal if update is successful
    } else {
      alert("Product cannot be updated"); // Show error message if update fails
    }

    await onClose(); // Execute the onClose callback
  }
</script>

<Modal bind:open={openUpdateProductDialog}>
  <!-- Modal title -->
  <span class="text-3xl text-light-text dark:text-dark-text">
    {$t("inventory_management.editProduct")}
    {product.name}
  </span>

  <!-- Display alert for validation errors -->
  {#if !hideHelper}
    <Alert
      class="bg-light-s_bg dark:bg-dark-s_bg mt-2 border-1"
      color="red"
      dismissable
      transition={fly}
    >
      <span class="font-medium">
        {$t("inventory_management.helper") + ": " + helper}
      </span>
    </Alert>
  {/if}

  <!-- Form inputs for editing product details -->
  <div class="mb-6">
    <Label for="name-input" class="block mb-2">
      {$t("inventory_management.name")}
    </Label>
    <Input required bind:value={product.name} id="name-input" size="lg" />
  </div>

  <div class="mb-6">
    <Label for="credits-input" class="block mb-2">
      {$t("inventory_management.credits")}
    </Label>
    <Input
      type="number"
      bind:value={product.price_in_credits}
      id="credits-input"
      size="lg"
    />
  </div>

  <div class="mb-6">
    <Label for="stock-input" class="block mb-2">
      {$t("inventory_management.stock")}
    </Label>
    <Input
      type="number"
      bind:value={product.amount_in_stock}
      id="stock-input"
      size="lg"
    />
  </div>

  <div class="mb-6">
    <Label for="ean-input" class="block mb-2">
      {$t("inventory_management.ean")}
    </Label>
    <Input bind:value={product.EAN} id="ean-input" size="lg" />
  </div>

  <div class="mb-6">
    <Label for="isAlcoholic-input" class="block mb-2">
      {$t("inventory_management.isAlcoholic")}
    </Label>
    <Select
      id="isAlcoholic-input"
      items={options}
      bind:value={product.isAlcoholic}
    ></Select>
  </div>

  <!-- Button to submit the form -->
  <CtaButton
    captionText="{$t('inventory_management.editProduct')} {product.name}"
    onCTAButtonClickFn={handleSubmit}
  />
</Modal>
