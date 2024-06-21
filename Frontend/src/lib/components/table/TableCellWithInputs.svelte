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
  tdClass="{border} p-0 m-0 border-light-s_bg dark:border-dark-s_bg bg-light-p_bg dark:bg-dark-p_bg px-6 py-2 whitespace-nowrap font-medium h-4"
>
  <slot></slot>
</TableBodyCell>
