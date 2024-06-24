<script>
  import { t } from "$lib/translations/index.js";
  import { Button, TableBody, TableBodyRow, Modal } from "flowbite-svelte";
  import TableHeader from "$lib/components/table/TableHeader.svelte";
  import TableCell from "$lib/components/table/TableCell.svelte";
  import TablePage from "$lib/components/table/TablePage.svelte";
  import TableCellWithInputs from "$lib/components/table/TableCellWithInputs.svelte";
  import { InfoCircleSolid } from "flowbite-svelte-icons";
  import { getAllOrders, getOneOrderById, undoTransaction } from "../../lib/service/transactions.js";
  import {dateToStringWithTime} from "../../lib/service/dateToString.js";

    const iconStyle =
        "hover:cursor-pointer hover:bg-light-p_foreground dark:hover:bg-dark-p_foreground rounded h-6 w-6";

    /** @type {import('./$types').PageData} */
    export let data;
    //this is an array of order objects
    let allOrders = data.allOrders?.data || [];

    console.log(allOrders[1]);
    let currentPage = 1;
    const pages = Math.ceil(data.allOrders?.meta.total / data.allOrders?.meta.page_size) || 1;

    // State variables for modal control
    let showModal = false;
    let selectedOrder = null;
    let productsArray = null;

    async function openModal(orderId) {
        selectedOrder = await getOneOrderById(orderId);
        productsArray = selectedOrder.order_products;
        showModal = true;
    }

    async function changeTransactionHistory(page = 1) {
        const response = await getAllOrders(page);

        allOrders = response.data;
        currentPage = page;
    }

    async function undo(orderId) {
        const result = await undoTransaction(orderId)
        const updatedOrders = await getAllOrders() || [];
        allOrders = updatedOrders.data;
        console.log(allOrders)
    }
</script>


<TablePage title={$t("transaction_history.title")} {currentPage} changeData={changeTransactionHistory} {pages}>
    <TableHeader
            headerValues={[
        $t("transaction_history.buyer"),
        $t("transaction_history.credits"),
        $t("transaction_history.details"),
        $t("transaction_history.barkeeper"),
        $t("transaction_history.date"),
        $t("transaction_history.undo"),
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
            <TableCellWithInputs position="middle">
              <Button class="p-0" on:click={() => openModal(entry.id)}>
                <InfoCircleSolid class={iconStyle}></InfoCircleSolid>
              </Button>
            </TableCellWithInputs>
            <TableCell position="middle">{entry.seller.username}</TableCell>
            <TableCell position="middle">{dateToStringWithTime(entry.createdAt)}</TableCell>
            <TableCellWithInputs position="last">
              <Button
                      class="w-full bg-light-p_foreground dark:bg-dark-p_foreground font-medium rounded-full text-lg text-center"
                      on:click={() => undo(entry.id)}
              >
                Undo
              </Button>
            </TableCellWithInputs>
          </TableBodyRow>
        {/each}
      </TableBody>
    {/if}
</TablePage>

{#if showModal}
    <Modal
            class="w-100"
            title={$t("transaction_history.details")}
            bind:open={showModal}
            autoclose
    >
        <div class="m-2 p-4">
            <div class="mb-2">
                <TableHeader
                        headerValues={[
                        $t("transaction_history.product"),
                        $t("transaction_history.quantity"),
                    ]}
                ></TableHeader>
            </div>
            {#each productsArray as entry}
                <TableBody>
                    <TableCell position="first">{entry.product.name}</TableCell>
                    <TableCell position="middle"></TableCell>
                    <TableCell position="middle">{entry.quantity}</TableCell>
                    <TableCell position="last"></TableCell>
                </TableBody>
            {/each}
        </div>
    </Modal>
{/if}
