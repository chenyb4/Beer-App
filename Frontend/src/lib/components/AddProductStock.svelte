<script>
    import {Alert, Input, Label, Modal} from "flowbite-svelte";
    import {t} from "$lib/translations/index.js";
    import CtaButton from "$lib/components/CtaButton.svelte";
    import {fly} from 'svelte/transition';
    import { createProduct, updateAmountInStock } from "$lib/service/inventory";

    export let openAddProductStockDialog = false;
    export let amount_in_stock;
    export let product;

    export let onClose = async function(){};

    let helper = "";
    $: hideHelper = true;

    async function handleSubmit() {
        if (amount_in_stock.length === 0) {
            helper = ($t("inventory_management.amount_in_stock"));
            return;
        }
        amount_in_stock = parseInt(amount_in_stock) + parseInt(product.amount_in_stock);
        const response = await updateAmountInStock(amount_in_stock, product.id);
        if (!response){
            openAddProductStockDialog = false;
        } else {
            alert("Product cannot be changed");
        }
        await onClose();
    }

</script>

<Modal bind:open={openAddProductStockDialog}>
    <span class="text-3xl text-light-text dark:text-dark-text">{$t("inventory_management.addProductStock")}</span>
    {#if !hideHelper}
        <Alert class="bg-light-s_bg dark:bg-dark-s_bg mt-2 border-1" color="red" dismissable transition={fly}>
            <span class="font-medium">{$t("inventory_management.helper") + ": " + helper} </span>
        </Alert>
    {/if}
    <div class="mb-6">
        {product.name}
    </div>
    <div class="mb-6">
        <Label for="name-input" class="block mb-2">{$t("inventory_management.stock")}</Label>
        <Input required bind:value={amount_in_stock} id="name-input" size="lg" type=number/>
    </div>
    <CtaButton captionText={$t("inventory_management.addProductStock")} onCTAButtonClickFn={handleSubmit}/>
</Modal>
