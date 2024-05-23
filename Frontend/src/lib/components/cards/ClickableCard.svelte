<script>
    import { Card } from "flowbite-svelte";
    import { t } from '$lib/translations'; // Ensure t is correctly imported from your localization setup
    export let path;
    export let icon;

    // Reactive statements for localization keys
    $: titleGetter = `homepage.${path}.title`;
    $: infoGetter = `homepage.${path}.info`;
</script>

<Card>
    <!-- Use svelte:component to dynamically render the icon -->
    <svelte:component this={icon} class="text-light-p_foreground"/>
    <h2>{$t(titleGetter)}</h2>
    <p>{$t(infoGetter)}</p>
</Card>
