<script>
  import { Button } from "flowbite-svelte";

  export let captionText;
  export let onCTAButtonClickFn;
</script>

<Button
  on:click={onCTAButtonClickFn}
  type="submit"
  class="mt-12 text-white bg-light-p_foreground hover:bg-dark-100 dark:bg-dark-p_foreground dark:hover:bg-dark-300 focus:ring-3 focus:outline-none focus:ring-dark-300 font-medium rounded-full text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:focus:ring-dark-400"
>
  {captionText}
</Button>
