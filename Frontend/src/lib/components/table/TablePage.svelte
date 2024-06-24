<script>
  import { PaginationItem, Table } from "flowbite-svelte";

  export let pages = 1;
  export let currentPage = 1;
  export let changeData;
  export let pageSize = 6;

  export let title;

  const pagesArray = Array.from({ length: pages }, (x, i) => i + 1);

  const handleChangePage = (page) => {
    changeData(page, pageSize);
  };

  function isPageInRange(pageIndex, currentPage) {
    if (currentPage < 4 && pageIndex <= 6)
      return true;
    const distanceFromCurrent = Math.abs(pageIndex - currentPage);
    return distanceFromCurrent <= 3;
  }
</script>

<div class="p-5 flex w-full h-[90%]">
  <div
    class="w-full overflow-auto p-4 bg-light-s_bg dark:bg-dark-s_bg rounded-2xl"
  >
    <div class="inline-flex">
      <h1 class="text-3xl font-bold mb-4">
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
                {#if isPageInRange(i, currentPage)}
                  <PaginationItem
                          active={i === currentPage}
                          on:click={() => handleChangePage(i)}
                          normalClass="bg-light-p_foreground dark:bg-dark-p_foreground"
                  >
                    {i}
                  </PaginationItem>
                {/if}
              {/each}
            </div>
          </th>
        </tr>
      </tfoot>
    </Table>
  </div>
</div>
