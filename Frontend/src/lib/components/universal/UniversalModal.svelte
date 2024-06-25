<script>
    import {Button, CloseButton, Modal} from "flowbite-svelte";
    import {t} from "$lib/translations/index.js";

    export let modalTitle = "";
    export let modalText = "";
    let modalOpen = true;
    export let modalTextOk = "OK";
    export let modalFunction = async function () {};
    export let onClose = async function () {
    };
    function handleOnClose() {
        onClose()
        modalOpen = false;
    }
</script>

<Modal title={modalTitle} bind:open={modalOpen}>
    <div slot="header" class="flex items-center">
        <span class="text-3xl text-light-text dark:text-dark-text">{$t("administration.addUsers")}</span>
        <CloseButton tabindex="-1" class="absolute top-5 right-5" on:click={() => handleOnClose()} />
    </div>
    {modalText}
    <svelte:fragment slot="footer">
        <Button on:click={modalFunction}>{modalTextOk}</Button>
        <Button color="alternative">Cancel</Button>
    </svelte:fragment>
</Modal>