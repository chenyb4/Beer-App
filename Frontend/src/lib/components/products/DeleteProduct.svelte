<script>
  import { Button, Modal } from "flowbite-svelte";
  import { t } from "$lib/translations/index.js";
  import CtaButton from "$lib/components/CtaButton.svelte";
  import { fly } from "svelte/transition";
  import { deleteProduct } from "$lib/service/inventory";

  export let openDeleteProductDialog = false;
  export let onClose = async function () {};
  export let product = {
    id: 0,
    name: "",
    price_in_credits: 0,
    amount_in_stock: 0,
    EAN: "",
  };

  async function handleSubmit() {
    const response = await deleteProduct(product.id);
    if (!response) {
      openDeleteProductDialog = false;
    } else {
      alert("Product cannot be updated");
    }
    await onClose();
  }

  function closeDialog() {
    openDeleteProductDialog = false;
  }
</script>

<Modal bind:open={openDeleteProductDialog}>
  <span class="text-3xl font-bold text-light-text dark:text-dark-text uppercase"
    >{$t("inventory_management.deleteProduct")} {product.name}</span
  >
  <div class="text-lg text-red-500 py-4">
    {$t("inventory_management.areYouSure")}
  </div>
  <div class="text-lg text-light-text dark:text-dark-text flex justify-center">
    {product.name}
  </div>
  <div class="flex justify-end space-x-2">
    <CtaButton
      captionText={$t("inventory_management.keepProduct")}
      onCTAButtonClickFn={closeDialog}
    />
    <Button
      class="bg-red-500 rounded-full mt-12 uppercase"
      on:click={handleSubmit}>{$t("inventory_management.deleteProduct")}</Button
    >
  </div>
</Modal>
