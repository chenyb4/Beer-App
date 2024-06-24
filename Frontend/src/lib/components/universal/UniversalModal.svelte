<script>
    import {Button, Modal} from "flowbite-svelte";

    export let modalTitle = "";
    export let modalText = "";
    export let modalOpen = false;
    export let modalTextOk = "OK";
    export let modalFunction = async function () {};
</script>

<Modal title={modalTitle} bind:open={modalOpen} autoclose>
    {modalText}
    <svelte:fragment slot="footer">
        <Button on:click={modalFunction}>{modalTextOk}</Button>
        <Button color="alternative">Cancel</Button>
    </svelte:fragment>
</Modal>