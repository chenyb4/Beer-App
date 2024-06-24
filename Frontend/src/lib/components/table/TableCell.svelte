<script>
  import { TableBodyCell } from "flowbite-svelte";

  export let position = "first";
  let border =
    position === "first"
      ? "rounded-l-full"
      : position === "last"
        ? "rounded-r-full"
        : "";
</script>

<TableBodyCell
  tdClass="{border} border-light-s_bg dark:border-dark-s_bg bg-light-p_bg dark:bg-dark-p_bg px-6 py-4 whitespace-nowrap font-medium"
>
  <p class="text-black dark:text-white">
    <slot></slot>
  </p>
</TableBodyCell>
