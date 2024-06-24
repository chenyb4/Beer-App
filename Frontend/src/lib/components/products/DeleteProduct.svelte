<script>
  // Import necessary components from Flowbite and custom libraries
  import { Button, Modal } from "flowbite-svelte";
  import { t } from "$lib/translations/index.js";
  import CtaButton from "$lib/components/CtaButton.svelte";
  import { deleteProduct } from "$lib/service/inventory";

  // Props passed to the component
  export let openDeleteProductDialog = false; // Controls the visibility of the modal
  export let onClose = async function () {}; // Callback function to execute on closing the modal
  export let product = {
    // Default product object
    id: 0,
    name: "",
    price_in_credits: 0,
    amount_in_stock: 0,
    EAN: "",
  };

  // Function to handle delete product submission
  async function handleSubmit() {
    const response = await deleteProduct(product.id); // Call deleteProduct service function
    if (!response) {
      openDeleteProductDialog = false; // Close the modal if successful deletion
    } else {
      alert("Product cannot be deleted"); // Show error message if deletion fails
    }
    await onClose(); // Execute the onClose callback
  }

  // Function to close the dialog without deleting the product
  function closeDialog() {
    openDeleteProductDialog = false;
  }
</script>

<Modal bind:open={openDeleteProductDialog}>
  <!-- Modal title -->
  <span
    class="text-3xl font-bold text-light-text dark:text-dark-text uppercase"
  >
    {$t("inventory_management.deleteProduct")}
    {product.name}
  </span>

  <!-- Confirmation message -->
  <div class="text-lg text-red-500 py-4">
    {$t("inventory_management.areYouSure")}
  </div>

  <!-- Display product name for confirmation -->
  <div class="text-lg text-light-text dark:text-dark-text flex justify-center">
    {product.name}
  </div>

  <!-- Buttons to confirm or cancel deletion -->
  <div class="flex justify-end space-x-2">
    <!-- Button to keep the product (cancel deletion) -->
    <CtaButton
      captionText={$t("inventory_management.keepProduct")}
      onCTAButtonClickFn={closeDialog}
    />

    <!-- Button to delete the product -->
    <Button
      class="bg-red-500 rounded-full mt-12 uppercase"
      on:click={handleSubmit}
    >
      {$t("inventory_management.deleteProduct")}
    </Button>
  </div>
</Modal>
