<script>
  import { t } from "$lib/translations/index.js";
  import CtaButton from "$lib/components/CtaButton.svelte";
  import CreateStudent from "$lib/components/administration/CreateStudent.svelte";
  import { handleSendMailResponse } from "$lib/service/QR.js";
  import TablePage from "$lib/components/table/TablePage.svelte";
  import {
    Button,
    ButtonGroup,
    Dropdown,
    DropdownItem,
    Input,
    Modal,
    Popover,
    TableBody,
    TableBodyRow,
  } from "flowbite-svelte";
  import languages from "$lib/service/languages.json";
  import { dateToString } from "$lib/service/dateToString.js";
  import {
    CheckCircleOutline,
    CloseCircleOutline,
    DotsVerticalOutline,
    QrCodeOutline,
    TrashBinSolid,
    UserEditSolid,
    UserSettingsSolid,
  } from "flowbite-svelte-icons";
  import { deleteUser, getUsers } from "$lib/service/administration.js";
  import TableHeader from "$lib/components/table/TableHeader.svelte";
  import TableCell from "$lib/components/table/TableCell.svelte";
  import SendQRModal from "$lib/components/ResponseModal.svelte";
  import { getQRandSendMail } from "$lib/service/emailService.js";
  import UpdateStudentRoleModal from "$lib/components/administration/UpdateStudentRoleModal.svelte";
  import UpdateStudent from "$lib/components/administration/UpdateStudent.svelte";
  import TableCellWithInputs from "$lib/components/table/TableCellWithInputs.svelte";
  import CreateStudents from "$lib/components/administration/CreateStudents.svelte";

  /** @type {import('./$types').PageData} */
  export let data;
  $: users = data.users.data;

  const pages = Math.ceil(data.users.meta.total / data.users.meta.page_size);
  let currentPage = 1;

  const roles = data.roles.data;
  let modalTitle = "";
  let modalText = "";
  let modalOpen = false;
  let modalTextOk = "Yes";
  let modalFunction = async function () {};

  let openSentQRModal = false;
  let textSentQRModal = "";

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

  function getRole(role = 0) {
    const foundRole = roles.find((r) => r.id === role);
    return foundRole ? foundRole.name : "No role assigned!";
  }

  function handleResendQR(user = { username: "User not found", id: 0 }) {
    if (user === undefined || user.id === 0) return;
    modalOpen = true;
    modalTitle = "Resending QR code";
    modalText =
      "Are you certain to resend and regenerate QR code of " +
      user.username +
      "?";
    modalTextOk = "Resend QR";
    modalFunction = async function () {
      let responseQR = await getQRandSendMail(user.id);
      textSentQRModal = handleSendMailResponse(
        responseQR.sentMail,
        user,
        responseQR.qr
      );
      openSentQRModal = false;
      openSentQRModal = true;
    };
  }

  function handleDeleteUser(user = undefined) {
    if (user === undefined) {
      modalOpen = true;
      modalTitle = "User not found!";
      modalText = "";
    } else {
      modalOpen = true;
      modalTitle = "Deleting user";
      modalText = "Are you sure to delete the user?";
      modalFunction = async function () {
        await deleteUser(user);
        await changeUsers();
      };
    }
  }

  let pageSize = 10;

  async function changeUsers(page = 1) {
    const response = await getUsers(
      page,
      pageSize,
      filterUsername,
      filterEmail,
      filterIsLegalAge,
      filterLanguage,
      filterRole
    );
    users = response.data;
    currentPage = page;
  }

  const iconStyle =
    "hover:cursor-pointer hover:bg-light-p_foreground dark:hover:bg-dark-p_foreground rounded h-6 w-6";

  let openCreateUserDialog = false;
  let openCreateUsersDialog = false;

  function handleOpenCreateUserDialog() {
    openCreateUserDialog = false;
    openCreateUserDialog = true;
  }

  function handleOpenCreateUsersDialog() {
    openCreateUsersDialog = false;
    openCreateUsersDialog = true;
  }

  let openUpdateStudentRoleModal = false;
  let selectedUser = {
    id: 0,
    username: "User not defined",
    roleId: 0,
    date_of_birth: "",
    email: "",
  };
  let selectedRole = 0;
  const falseValue = false;
  const emptyValue = "";

  function handleChangeUserRole(
    user = { id: 0, username: "User not defined", roleId: 0 }
  ) {
    if (user.id === 0) return;
    selectedRole = user.roleId;
    openUpdateStudentRoleModal = false;
    openUpdateStudentRoleModal = true;
    selectedUser = user;
  }

  let openUpdateStudentModal = false;

  function handleChangeUser(
    user = { id: 0, username: "User not defined", date_of_birth: "", roleId: 0 }
  ) {
    user.date_of_birth = new Date(user.date_of_birth)
      .toISOString()
      .split("T")[0];
    selectedUser = user;
    openUpdateStudentModal = false;
    openUpdateStudentModal = true;
  }

  let filterUsername = "";
  let filterEmail = "";
  let filterIsLegalAge = 0;
  let filterLanguage = -1;
  let filterRole = 0;
</script>

<UpdateStudent
  user={selectedUser}
  openUpdateUserDialog={openUpdateStudentModal}
  onClose={changeUsers}
/>
<CreateStudent {openCreateUserDialog} onClose={changeUsers} />
<CreateStudents {roles} {openCreateUsersDialog} onClose={changeUsers} />
<UpdateStudentRoleModal
  selectedRoleId={selectedRole}
  {roles}
  currentRole={selectedRole}
  showPassword={falseValue}
  password={emptyValue}
  passwordConfirm="" {emptyValue}
  modalOpen={openUpdateStudentRoleModal}
  user={selectedUser}
  onClose={changeUsers}
/>
<SendQRModal
  showModal={openSentQRModal}
  modalText={textSentQRModal}
  modalTitle={$t("administration.qrRecreation")}
/>
<Modal title={modalTitle} bind:open={modalOpen} autoclose>
  {modalText}
  <svelte:fragment slot="footer">
    <Button on:click={modalFunction}>{modalTextOk}</Button>
    <Button color="alternative">Cancel</Button>
  </svelte:fragment>
</Modal>
<div class="fixed bottom-12 right-12 z-50">
  <ButtonGroup
    class="text-dark-text bg-light-p_foreground dark:bg-dark-p_foreground rounded-full"
  >
    <Button
      class="bg-light-p_foreground dark:bg-dark-p_foreground text-white"
      on:click={handleOpenCreateUserDialog}
    >
      {$t("administration.addUser")}
    </Button>
    <Button
      class="bg-light-p_foreground dark:bg-dark-p_foreground p-1 text-white"
    >
      <DotsVerticalOutline class="dots-menu" />
    </Button>
    <Dropdown placement="top" triggeredBy=".dots-menu" class="w-32">
      <DropdownItem on:click={handleOpenCreateUsersDialog} class="text-center"
        >{$t("administration.addUsers")}</DropdownItem
      >
    </Dropdown>
  </ButtonGroup>
</div>

<select
  bind:value={pageSize}
  on:change={() => changeUsers()}
  class="absolute right-10 top-10 rounded-xl text-light-text dark:text-dark-text bg-light-input_bg dark:bg-dark-input_bg"
>
  <option value={10}> 10 </option>
  <option value={25}> 25 </option>
  <option value={50}> 50 </option>
</select>
<TablePage
  {pages}
  {currentPage}
  changeData={changeUsers}
  title="Student administration"
>
  <TableHeader
    headerValues={[
      "Username/ Student number",
      "Email",
      "Role",
      "Above 18",
      "Preferred language",
      "credits",
      "",
    ]}
  />
  <TableBody>
    <TableBodyRow>
      <TableCellWithInputs position="first">
        <Input
          id="username"
          bind:value={filterUsername}
          class="w-full"
          placeholder="Username..."
        />
      </TableCellWithInputs>
      <TableCellWithInputs position="middle">
        <Input
          id="email"
          class="w-full"
          bind:value={filterEmail}
          placeholder="Email..."
        />
      </TableCellWithInputs>
      <TableCellWithInputs position="middle">
        <select
          bind:value={filterRole}
          id="role"
          class="w-full rounded-xl text-light-text dark:text-dark-text bg-light-input_bg dark:bg-dark-input_bg"
        >
          {#each roles as role}
            <option value={role.id}>
              {role.name}
            </option>
          {/each}
          <option value={0}> Not selected </option>
        </select>
      </TableCellWithInputs>
      <TableCellWithInputs position="middle">
        <select
          bind:value={filterIsLegalAge}
          id="IsLegalAge"
          class="w-full rounded-xl text-light-text dark:text-dark-text bg-light-input_bg dark:bg-dark-input_bg"
        >
          <option value={true}> Yes </option>
          <option value={false}> No </option>
          <option value={0}> Not selected </option>
        </select>
      </TableCellWithInputs>
      <TableCellWithInputs position="middle">
        <select
          bind:value={filterLanguage}
          id="language"
          class="w-full rounded-xl text-light-text dark:text-dark-text bg-light-input_bg dark:bg-dark-input_bg"
        >
          {#each languages as language, index}
            <option value={index}>
              {language}
            </option>
          {/each}
          <option value={-1}> Not selected </option>
        </select>
      </TableCellWithInputs>
      <TableCellWithInputs position="middle" />
      <TableCellWithInputs position="last">
        <Button
          class="w-full bg-light-p_foreground dark:bg-dark-p_foreground font-medium rounded-full text-lg text-center"
          on:click={() => changeUsers()}
        >
          Filter
        </Button>
      </TableCellWithInputs>
    </TableBodyRow>
    {#if users.length > 0}
      {#each users as user}
        <TableBodyRow>
          <TableCell position="first">{user.username}</TableCell>
          <TableCell position="middle">{user.email}</TableCell>
          <TableCell position="middle">{getRole(user.roleId)}</TableCell>
          <TableCell position="middle">
            <div>
              {#if isAbove18(user.date_of_birth)}
                <CheckCircleOutline id="date_of_birth" class="text-green-600" />
              {:else}
                <CloseCircleOutline id="date_of_birth" class="text-red-600" />
              {/if}
              <Popover
                class="text-sm text-light-text dark:text-dark-text z-50"
                triggeredBy="#date_of_birth"
                >{dateToString(user.date_of_birth)}</Popover
              >
            </div>
          </TableCell>
          <TableCell position="middle">{languages[user.language]}</TableCell>
          <TableCell position="middle">{user.credits}</TableCell>
          <TableCell position="last">
            <div class="flex gap-4">
              <Button
                class="p-0 dark:text-white text-black"
                on:click={() => handleResendQR(user)}
              >
                <QrCodeOutline class={iconStyle} />
              </Button>
              <Button
                class="p-0 dark:text-white text-black"
                on:click={() => handleChangeUserRole(user)}
              >
                <UserSettingsSolid class={iconStyle} />
              </Button>
              <Button
                class="p-0 dark:text-white text-black"
                on:click={() => handleChangeUser(user)}
              >
                <UserEditSolid class={iconStyle} />
              </Button>
              <Button
                class="p-0 dark:text-white text-black"
                on:click={() => handleDeleteUser(user)}
              >
                <TrashBinSolid class={iconStyle} />
              </Button>
            </div>
          </TableCell>
        </TableBodyRow>
      {/each}
    {/if}
  </TableBody>
</TablePage>
