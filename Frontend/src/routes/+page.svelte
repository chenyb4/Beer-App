<script>
    import {Card, DarkMode} from "flowbite-svelte";

    import { t, locale, locales } from '$lib/translations';
    import ClickableCard from "$lib/components/cards/ClickableCard.svelte";

    import {
        CartSolid,
        CashSolid,
        ClipboardListSolid,
        FileInvoiceSolid,
        UsersGroupSolid,
        WalletSolid
    } from 'flowbite-svelte-icons';
</script>
<div class="mt-24 mb-24 flex flex-wrap gap-1 justify-center">
    <ClickableCard path="credits" icon="{WalletSolid}" />
    <ClickableCard path="drinks" icon="{CartSolid}" />
    <ClickableCard path="inventory_management" icon="{ClipboardListSolid}" />
    <ClickableCard path="administration" icon="{UsersGroupSolid}" />
    <ClickableCard path="transaction_history" icon="{CashSolid}" />
    <ClickableCard path="inventory_history" icon="{FileInvoiceSolid}" />
</div>
