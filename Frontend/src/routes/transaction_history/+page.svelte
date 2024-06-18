<script>
  import { t } from "$lib/translations/index.js";
  import { Button, TableBody, TableBodyRow, Modal } from "flowbite-svelte";
  import TableHeader from "$lib/components/table/TableHeader.svelte";
  import TableCell from "$lib/components/table/TableCell.svelte";
  import TablePage from "$lib/components/table/TablePage.svelte";
  import { InfoCircleSolid } from "flowbite-svelte-icons";
  import { getOneOrderById } from "$lib/service/transactions.js";

  const iconStyle =
    "hover:cursor-pointer hover:bg-light-p_foreground dark:hover:bg-dark-p_foreground rounded h-6 w-6";

    /** @type {import('./$types').PageData} */
    export let data;
    //this is an array of order objects
    let allOrders = data.allOrders?.data || [];

    // State variables for modal control
    let showModal = false;
    let selectedOrder = null;
    let productsArray = null;

    async function openModal(orderId) {
        selectedOrder = await getOneOrderById(orderId);
        productsArray = selectedOrder.order_products;
        showModal = true;
    }
</script>

<body
  class="m-4 w-full overflow-auto p-5 bg-light-s_bg dark:bg-dark-s_bg rounded-2xl"
>
  <TablePage title={$t("transaction_history.title")}>
    <TableHeader
      headerValues={[
        $t("transaction_history.buyer"),
        $t("transaction_history.credits"),
        $t("transaction_history.details"),
        $t("transaction_history.barkeeper"),
        $t("transaction_history.date"),
      ]}
    ></TableHeader>

    {#if allOrders.length === 0}
      <p>{$t("transaction_history.no_data_message")}</p>
    {:else}
      <TableBody>
        {#each allOrders as entry}
          <TableBodyRow>
            <TableCell position="first">{entry.buyer.email}</TableCell>
            <TableCell position="middle">{entry.amount_of_credits}</TableCell>
            <TableCell position="middle">
              <Button class="p-0" on:click={() => openModal(entry.id)}>
                <InfoCircleSolid class={iconStyle}></InfoCircleSolid>
              </Button>
            </TableCell>
            <TableCell position="middle">{entry.seller.username}</TableCell>
            <TableCell position="last">{entry.createdAt}</TableCell>
          </TableBodyRow>
        {/each}
      </TableBody>
    {/if}
  </TablePage>

  {#if showModal}
    <Modal
      title={$t("transaction_history.details")}
      bind:open={showModal}
      autoclose
    >
      <div class="p-4">
        <div class="mt-2">
          <TableHeader
            headerValues={[
              $t("transaction_history.product"),
              $t("transaction_history.quantity"),
            ]}
          ></TableHeader>
          {#each productsArray as entry}
            <TableBody>
              <TableCell position="first">{entry.product.name}</TableCell>
              <TableCell position="last">{entry.quantity}</TableCell>
            </TableBody>
          {/each}
        </div>
      </div>
    </Modal>
  {/if}
</body>
