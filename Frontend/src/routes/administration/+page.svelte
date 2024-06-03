<script>
  import { t } from "$lib/translations/index.js";
  import CtaButton from "$lib/components/CtaButton.svelte";
  import CreateStudent from "$lib/components/CreateStudent.svelte";
  import {
    Button,
    Modal,
    PaginationItem,
    Popover,
    Table,
    TableBody,
    TableBodyCell,
    TableBodyRow,
    TableHead,
    TableHeadCell,
  } from "flowbite-svelte";
  import languages from "$lib/service/languages.json";
  import { dateToString } from "$lib/service/dateToString.js";
  import {
    CheckCircleOutline,
    CloseCircleOutline,
    QrCodeOutline,
    TrashBinSolid,
    UserEditSolid,
    UserSettingsSolid,
  } from "flowbite-svelte-icons";
  import { getUsers } from "$lib/service/administration.js";

  /** @type {import('./$types').PageData} */
  export let data;
  $: users = data.users.data;

  const pages = Math.ceil(data.users.meta.total / data.users.meta.page_size);
  const pagesArray = Array.from({ length: pages }, (x, i) => i + 1);
  let currentPage = 1;

  const roles = data.roles.data;

  let modalTitle = "";
  let modalText = "";
  let modalOpen = false;

  // Calculate if the user is above 18
  function isAbove18(dob = new Date()) {
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age >= 18;
  }

  function getRole(role = undefined) {
    if (role === undefined) return "No role assigned!";
    return roles[role];
  }

  function getLanguage(language = "0") {
    return languages[language];
  }

  function handleResendQR(user = undefined) {
    if (user === undefined) return;
    modalOpen = true;
    modalTitle = "Resending QR code";
    modalText =
      "Are you certain to resend and regenerate QR code of " +
      user.username +
      "?";
  }

  async function changeUsers(page = 1) {
    const response = await getUsers(page);
    users = response.data;
    currentPage = page;
  }
</script>

<Modal title={modalTitle} bind:open={modalOpen} autoclose>
  {modalText}
  <svelte:fragment slot="footer">
    <Button on:click={() => alert('Handle "success"')}>Send QR</Button>
    <Button color="alternative">Cancel</Button>
  </svelte:fragment>
</Modal>
<div class="p-5 flex">
  <div class="overflow-auto p-5 bg-light-s_bg dark:bg-dark-s_bg rounded-2xl">
    <h1 class="text-3xl m-5 ml-2 font-bold">Student administration</h1>
    <Table
      color="custom"
      noborder
      class="text-s bg-light-s_bg dark:bg-dark-s_bg border-light-p_bg dark:border-dark-p_bg"
    >
      <TableHead>
        <TableHeadCell
          class="border-light-s_bg dark:border-dark-s_bg border-b-8 text-xs uppercase rounded-l-full bg-light-p_foreground dark:bg-dark-p_foreground"
        >
          Username/ Student number
        </TableHeadCell>
        <TableHeadCell
          class="border-light-s_bg dark:border-dark-s_bg border-b-8 text-xs uppercase bg-light-p_foreground dark:bg-dark-p_foreground"
        >
          Email
        </TableHeadCell>
        <TableHeadCell
          class="border-light-s_bg dark:border-dark-s_bg border-b-8 text-xs uppercase bg-light-p_foreground dark:bg-dark-p_foreground"
        >
          Role
        </TableHeadCell>
        <TableHeadCell
          class="border-light-s_bg dark:border-dark-s_bg border-b-8 text-xs uppercase bg-light-p_foreground dark:bg-dark-p_foreground"
        >
          Above 18
        </TableHeadCell>
        <TableHeadCell
          class="border-light-s_bg dark:border-dark-s_bg border-b-8 text-xs uppercase bg-light-p_foreground dark:bg-dark-p_foreground"
        >
          Preferred language
        </TableHeadCell>
        <TableHeadCell
          class="border-light-s_bg dark:border-dark-s_bg border-b-8 text-xs uppercase rounded-r-full bg-light-p_foreground dark:bg-dark-p_foreground"
        ></TableHeadCell>
      </TableHead>
      <TableBody>
        {#if users.length > 0}
          {#each users as user}
            <TableBodyRow>
              <TableBodyCell
                tdClass="border-light-s_bg dark:border-dark-s_bg border-b-8 bg-light-p_bg dark:bg-dark-p_bg rounded-l-full px-6 py-4 whitespace-nowrap font-medium "
                >{user.username}</TableBodyCell
              >
              <TableBodyCell
                tdClass="border-light-s_bg dark:border-dark-s_bg border-b-8 bg-light-p_bg dark:bg-dark-p_bg px-6 py-4 whitespace-nowrap font-medium"
                >{user.email}</TableBodyCell
              >
              <TableBodyCell
                tdClass="border-light-s_bg dark:border-dark-s_bg border-b-8 bg-light-p_bg dark:bg-dark-p_bg px-6 py-4 whitespace-nowrap font-medium"
                >{getRole(user.role)}</TableBodyCell
              >

              <TableBodyCell
                tdClass="border-light-s_bg dark:border-dark-s_bg border-b-8 bg-light-p_bg dark:bg-dark-p_bg px-6 py-4 whitespace-nowrap font-medium"
              >
                <div>
                  {#if isAbove18(user.date_of_birth)}
                    <CheckCircleOutline
                      id="date_of_birth"
                      class="text-green-600"
                    />
                  {:else}
                    <CloseCircleOutline
                      id="date_of_birth"
                      class="text-red-600"
                    />
                  {/if}
                  <Popover
                    class="text-sm text-light-text dark:text-dark-text z-50"
                    triggeredBy="#date_of_birth"
                    >{dateToString(user.date_of_birth)}</Popover
                  >
                </div>
              </TableBodyCell>
              <TableBodyCell
                tdClass="border-light-s_bg dark:border-dark-s_bg border-b-8 bg-light-p_bg dark:bg-dark-p_bg px-6 py-4 whitespace-nowrap font-medium"
                >{getLanguage(user.language)}</TableBodyCell
              >
              <TableBodyCell
                tdClass="border-light-s_bg dark:border-dark-s_bg border-b-8 bg-light-p_bg dark:bg-dark-p_bg px-6 py-4 whitespace-nowrap font-medium rounded-r-full"
              >
                <div class="flex gap-4">
                  <Button class="p-0" on:click={() => handleResendQR(user)}>
                    <QrCodeOutline
                      class="hover:cursor-pointer hover:bg-light-p_foreground dark:hover:bg-dark-p_foreground rounded h-6 w-6"
                    />
                  </Button>
                  <Button class="p-0">
                    <UserSettingsSolid
                      class="hover:cursor-pointer hover:bg-light-p_foreground dark:hover:bg-dark-p_foreground rounded h-6 w-6"
                    />
                  </Button>
                  <Button class="p-0">
                    <UserEditSolid
                      class="hover:cursor-pointer hover:bg-light-p_foreground dark:hover:bg-dark-p_foreground rounded h-6 w-6"
                    />
                  </Button>
                  <Button class="p-0">
                    <TrashBinSolid
                      class="hover:cursor-pointer hover:bg-light-p_foreground dark:hover:bg-dark-p_foreground rounded h-6 w-6"
                    />
                  </Button>
                </div>
              </TableBodyCell>
            </TableBodyRow>
          {/each}
        {/if}
      </TableBody>
      <tfoot>
        <tr class="bg-light-s_bg dark:bg-dark-s_bg">
          <th colspan="99">
            <div class="w-full p-2 flex justify-center items-center">
              {#each pagesArray as i}
                <PaginationItem
                  active={i === currentPage}
                  on:click={() => changeUsers(i)}
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
