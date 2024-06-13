<script>
  // @ts-nocheck
  import { Alert, Input, Label, Modal, Select } from "flowbite-svelte";
  import { t } from "$lib/translations/index.js";
  import CtaButton from "$lib/components/CtaButton.svelte";
  import { fly } from "svelte/transition";
  import { createProduct } from "$lib/service/inventory";

  export let openCreateProductDialog = false;
  export let onClose = async function () {};

  let name = "";
  let price_in_credits = 1;
  let amount_in_stock = 0;
  let EAN = "";
  let helper = "";
  let isAlcoholic = false;
  $: hideHelper = true;

  let options = [
    { value: false, name: $t("inventory_management.no") },
    { value: true, name: $t("inventory_management.yes") },
  ];

  async function handleSubmit() {
    const missingFields = [];
    if (name.length === 0) {
      missingFields.push($t("inventory_management.name"));
    }
    if (price_in_credits <= 0) {
      missingFields.push($t("inventory_management.credits"));
    }
    if (amount_in_stock.length === 0) {
      missingFields.push($t("inventory_management.stock"));
    }
    if (parseInt(amount_in_stock) < 0) {
      missingFields.push($t("inventory_management.minusStock"));
    }
    if (EAN.length === 0) {
      missingFields.push($t("inventory_management.ean"));
    }

    if (missingFields.length > 0) {
      helper = missingFields.join(", ");
      hideHelper = false;
      return;
    }

    const response = await createProduct(
      name,
      price_in_credits,
      parseInt(amount_in_stock),
      EAN,
      String(isAlcoholic)
    );
    if (response) {
      openCreateProductDialog = false;
    } else {
      alert("Product cannot be created");
    }
    await onClose();
  }
</script>

<Modal bind:open={openCreateProductDialog}>
  <span class="text-3xl text-light-text dark:text-dark-text">
    {$t("inventory_management.addProduct")}
  </span>
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
    <Label for="name-input" class="block mb-2">
      {$t("inventory_management.name")}
    </Label>
    <Input required bind:value={name} id="name-input" size="lg" />
  </div>
  <div class="mb-6">
    <Label for="credits-input" class="block mb-2">
      {$t("inventory_management.credits")}
    </Label>
    <Input
      type="number"
      bind:value={price_in_credits}
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
      bind:value={amount_in_stock}
      id="stock-input"
      size="lg"
    />
  </div>
  <div class="mb-6">
    <Label for="ean-input" class="block mb-2">
      {$t("inventory_management.ean")}
    </Label>
    <Input bind:value={EAN} id="ean-input" size="lg" />
  </div>
  <div class="mb-6">
    <Label for="isAlcoholic-input" class="block mb-2">
      {$t("inventory_management.isAlcoholic")}
    </Label>
    <Select id="isAlcoholic-input" items={options} bind:value={isAlcoholic}
    ></Select>
  </div>
  <CtaButton
    captionText={$t("inventory_management.addProduct")}
    onCTAButtonClickFn={handleSubmit}
  />
</Modal>
