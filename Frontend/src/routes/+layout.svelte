<div class="h-screen flex">
    <Sidebar/>
    <slot>

    </slot>
</div>
<script>
    import "../app.css";
    import Sidebar from "$lib/components/navigation/Sidebar.svelte";
    import {locale} from "$lib/translations/index.js";
    $: $locale;
</script>

<style></style>

