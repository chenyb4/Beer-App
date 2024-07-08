<script>
    import {Alert, Button} from "flowbite-svelte";
    import {CloseOutline} from "flowbite-svelte-icons";

    export let qrMessage= "";
    export let resetQr = function(){}
</script>

<Alert color="green" class="absolute top-5 right-5 z-50" dismissable>
    <Button
            slot="close-button"
            class="hover:cursor-pointer"
            on:click={resetQr}
    >
        <CloseOutline />
    </Button>
    <img src={qrMessage} alt="QR"/>
</Alert>