<script>
    import {Card} from "flowbite-svelte";
    import {t, locale} from '$lib/translations'; // Ensure t is correctly imported from your localization setup
    export let path;
    export let icon;



    // Reactive statements for localization keys
    $: titleGetter = `homepage.${path}.title`;
    $: infoGetter = `homepage.${path}.info`;
</script>

<Card href="/{path}" class="h-80 m-12 text-light-text dark:text-dark-text hover:cursor-pointer hover:brightness-125 bg-light-s_bg dark:bg-dark-s_bg border-2 border-light-p_foreground dark:border-dark-p_foreground">
    <svelte:component this={icon} class="text-light-p_foreground w-full h-36"/>
    <div class="m-auto">
        <h2 class="font-bold text-2xl">{$t(titleGetter)}</h2>
        <p>{$t(infoGetter)}</p>
    </div>
</Card>
