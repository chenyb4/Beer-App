<script>
  // Import necessary components and functions from Flowbite and custom libraries
  import { Alert, Input, Label, Modal, Select } from "flowbite-svelte";
  import { t } from "$lib/translations/index.js";
  import CtaButton from "$lib/components/CtaButton.svelte";
  import { fly } from "svelte/transition";
  import { updateAmountInStock } from "$lib/service/inventory";

  // Props passed to the component
  export let openAddProductStockDialog = false; // Controls the visibility of the modal
  export let product; // The product to update
  export let onClose = async function () {}; // Callback function to execute on closing the modal

  // Local state variables
  let amount_in_stock = 24; // Default amount to add to stock
  let helper = ""; // Helper message for validation
  $: hideHelper = true; // Controls the visibility of the helper message

  // Options for the Select dropdown
  const options = [
    { name: 4, value: 4 },
    { name: 6, value: 6 },
    { name: 12, value: 12 },
    { name: 24, value: 24 },
  ];

  // Function to handle form submission
  async function handleSubmit() {
    // Check if amount_in_stock is empty
    if (amount_in_stock.length === 0) {
      helper = $t("inventory_management.amount_in_stock"); // Set helper message
      return; // Exit the function early
    }
    // Calculate the new stock amount
    amount_in_stock =
      parseInt(amount_in_stock) + parseInt(product.amount_in_stock);

    // Send the update request to the server
    const response = await updateAmountInStock(amount_in_stock, product.id);

    // Check the response from the server
    if (!response) {
      amount_in_stock = ""; // Clear the input field
      openAddProductStockDialog = false; // Close the modal
    } else {
      alert("Product cannot be changed"); // Show error message
    }

    // Execute the onClose callback
    await onClose();
  }
</script>

<Modal bind:open={openAddProductStockDialog}>
  <!-- Modal title displaying the product name -->
  <span class="text-3xl text-light-text dark:text-dark-text">
    {$t("inventory_management.addProductStock")}
    {product.name}
  </span>

  <!-- Helper alert displayed if hideHelper is false -->
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

  <div class="mb-6">
    <!-- Label for the stock amount input -->
    <Label for="amount-input" class="block mb-2">
      {$t("inventory_management.stock")}
    </Label>

    <!-- Select dropdown for predefined stock amounts -->
    <Select
      id="amount-input"
      class="block mb-2"
      items={options}
      bind:value={amount_in_stock}
    ></Select>

    <!-- Input field for custom stock amount -->
    <Input
      required
      bind:value={amount_in_stock}
      id="amount-input"
      size="lg"
      type="number"
    />

    <div>
      <!-- Button to submit the form -->
      <CtaButton
        captionText="{$t(
          'inventory_management.addProductStock'
        )} + {product.name}"
        onCTAButtonClickFn={handleSubmit}
      />
    </div>
  </div>
</Modal>
