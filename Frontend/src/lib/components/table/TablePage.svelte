<script>
  import { Input, Label, PaginationItem, Table } from "flowbite-svelte";

  export let pages = 1;
  export let currentPage = 1;
  export let changeData;
  export let pageSize = 10;

  export let title;

  const pagesArray = Array.from({ length: pages }, (x, i) => i + 1);

  const handleChangePage = (page) => {
    changeData(page, pageSize);
  };
</script>

<div class="p-5 flex w-full">
  <div
    class="w-full overflow-auto p-5 bg-light-s_bg dark:bg-dark-s_bg rounded-2xl"
  >
    <div class="inline-flex">
      <h1 class="text-3xl mt-2 m-5 ml-2 font-bold">
        {title}
      </h1>
    </div>
    <Table
      color="custom"
      class="border-spacing-y-3 border-spacing-x-0 border-separate text-s bg-light-s_bg dark:bg-dark-s_bg border-light-p_bg dark:border-dark-p_bg"
    >
      <slot></slot>
      <tfoot>
        <tr class="bg-light-s_bg dark:bg-dark-s_bg">
          <th colspan="99">
            <div class="w-full p-2 flex justify-center items-center">
              {#each pagesArray as i}
                <PaginationItem
                  active={i === currentPage}
                  on:click={() => handleChangePage(i)}
                  normalClass="bg-light-p_foreground dark:bg-dark-p_foreground"
                >
                  {i}
                </PaginationItem>
              {/each}
            </div>
          </th>
        </tr>
      </tfoot>
    </Table>
  </div>
</div>
