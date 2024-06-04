<script>
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
<div class="flex-1 overflow-y-auto">
    <div class="flex flex-wrap justify-center">
        <ClickableCard path="credits" icon="{WalletSolid}"/>
        <ClickableCard path="drinks" icon="{CartSolid}"/>
        <ClickableCard path="inventory_management" icon="{ClipboardListSolid}"/>
        <ClickableCard path="administration" icon="{UsersGroupSolid}"/>
        <ClickableCard path="transaction_history" icon="{CashSolid}"/>
        <ClickableCard path="inventory_history" icon="{FileInvoiceSolid}"/>
    </div>
</div>
