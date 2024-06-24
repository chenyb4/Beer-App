<script>
  import { Card } from "flowbite-svelte";
  import { t } from "$lib/translations";
  import {QuestionCircleOutline} from "flowbite-svelte-icons"; // Ensure t is correctly imported from your localization setup
  export let path = "/";
  //When icon isn't given, implement a question mark icon
  export let icon = QuestionCircleOutline;

  // Reactive statements for localization keys for the translation
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
    <h2 class="font-bold text-xl">{$t(titleGetter) || "Title isn't loaded"}</h2>
    <p>{$t(infoGetter) || "Info is not loaded"}</p>
  </div>
</Card>
