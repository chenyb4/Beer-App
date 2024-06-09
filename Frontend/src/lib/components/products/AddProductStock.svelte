<script>
  import { Alert, Input, Label, Modal, Radio } from "flowbite-svelte";
  import { t } from "$lib/translations/index.js";
  import CtaButton from "$lib/components/CtaButton.svelte";
  import { fly } from "svelte/transition";
  import { updateAmountInStock } from "$lib/service/inventory";

  export let openAddProductStockDialog = false;
  export let product;
  export let onClose = async function () {};

  let amount_in_stock = 0;
  let helper = "";
  $: hideHelper = true;

  const options = [4, 6, 12, 24];

  async function handleSubmit() {
    if (amount_in_stock.length === 0) {
      helper = $t("inventory_management.amount_in_stock");
      return;
    }
    amount_in_stock =
      parseInt(amount_in_stock) + parseInt(product.amount_in_stock);
    const response = await updateAmountInStock(amount_in_stock, product.id);
    if (!response) {
      amount_in_stock = "";
      openAddProductStockDialog = false;
    } else {
      alert("Product cannot be changed");
    }
    await onClose();
  }
</script>

<Modal bind:open={openAddProductStockDialog}>
  <span class="text-3xl text-light-text dark:text-dark-text"
    >{$t("inventory_management.addProductStock")} {product.name}</span
  >
  {#if !hideHelper}
    <Alert
      class="bg-light-s_bg dark:bg-dark-s_bg mt-2 border-1"
      color="red"
      dismissable
      transition={fly}
    >
      <span class="font-medium"
        >{$t("inventory_management.helper") + ": " + helper}
      </span>
    </Alert>
  {/if}
  <div class="mb-6">
    <Label for="amount-input" class="block mb-2"
      >{$t("inventory_management.stock")}</Label
    >
    <div class="flex flex-row my-2">
      <Radio class="pr-4 h-full text-xl" bind:group={amount_in_stock}>4</Radio>
      <Radio class="pr-4 h-full text-xl" bind:group={amount_in_stock}>6</Radio>
      <Radio class="pr-4 h-full text-xl" bind:group={amount_in_stock}>12</Radio>
      <Radio class="pr-4 h-full text-xl" bind:group={amount_in_stock}>24</Radio>
    </div>
    <Input
      required
      bind:value={amount_in_stock}
      id="amount-input"
      size="lg"
      type="number"
    />
    <div>
      <CtaButton
        captionText="{$t(
          'inventory_management.addProductStock'
        )} + {product.name}"
        onCTAButtonClickFn={handleSubmit}
      />
    </div>
  </div></Modal
>
