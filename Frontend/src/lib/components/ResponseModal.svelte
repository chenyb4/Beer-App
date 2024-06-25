<script>
    import {CloseButton, Modal} from "flowbite-svelte";
    let showModal = true;
    export let modalText = "";
    export let modalTitle = "";
    export let onClose = async function () {};

    function handleOnClose() {
        showModal = false;
        onClose()
    }
</script>

<Modal title={modalTitle} bind:open={showModal} dismissable={false}>
    <div slot="header" class="flex items-center">
        <span class="text-3xl text-light-text dark:text-dark-text">{modalTitle}</span>
        <CloseButton tabindex="-1" class="absolute top-5 right-5" on:click={() => handleOnClose()} />
    </div>
    <p class="text-base leading-relaxed text-light-text dark:text-dark-text">
        {@html modalText}
    </p>
</Modal>