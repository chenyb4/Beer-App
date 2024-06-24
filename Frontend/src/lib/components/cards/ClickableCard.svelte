<script>
  import { Card } from "flowbite-svelte";
  import { t, locale } from "$lib/translations"; // Ensure t is correctly imported from your localization setup
  export let path;
  export let icon;

  // Reactive statements for localization keys
  $: titleGetter = `homepage.${path}.title`;
  $: infoGetter = `homepage.${path}.info`;
</script>

<Card
  href="/{path}"
  class="h-60 m-8 text-light-text dark:text-dark-text hover:cursor-pointer hover:brightness-125 bg-light-s_bg dark:bg-dark-s_bg border-2 border-light-p_foreground dark:border-dark-p_foreground w-80"
>
  <svelte:component
    this={icon}
    class="text-light-p_foreground dark:text-dark-p_foreground w-full h-24"
  />
  <div class="m-auto">
    <h2 class="font-bold text-xl">{$t(titleGetter)}</h2>
    <p>{$t(infoGetter)}</p>
  </div>
</Card>
