<script>
    import {Modal} from "flowbite-svelte";
    export let showModal = false;
    export let modalText = "";
    export let modalTitle = "QR sent";
</script>

<Modal title={modalTitle} bind:open={showModal} autoclose>
    <p class="text-base leading-relaxed text-light-text dark:text-dark-text">
        {@html modalText}
    </p>
</Modal>