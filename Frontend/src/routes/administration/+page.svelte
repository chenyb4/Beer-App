<script>
    import {t} from "$lib/translations/index.js";
    import CtaButton from "$lib/components/CtaButton.svelte";
    import CreateStudent from "$lib/components/CreateStudent.svelte";
    import {handleSendMailResponse} from "$lib/service/QR.js";
    import TablePage from "$lib/components/table/TablePage.svelte"
    import {
        Button,
        Modal,
        Popover,
        TableBody,
        TableBodyRow,
    } from "flowbite-svelte";
    import languages from "$lib/service/languages.json"
    import {dateToString} from "$lib/service/dateToString.js";
    import {
        CheckCircleOutline,
        CloseCircleOutline,
        QrCodeOutline,
        TrashBinSolid,
        UserEditSolid, UserSettingsSolid
    } from "flowbite-svelte-icons";
    import {deleteUser, getUsers} from "$lib/service/administration.js";
    import TableHeader from "$lib/components/table/TableHeader.svelte";
    import TableCell from "$lib/components/table/TableCell.svelte";
    import SendQRModal from "$lib/components/ResponseModal.svelte";
    import {getQRandSendMail} from "$lib/service/emailService.js";
    import UpdateStudentRoleModal from "$lib/components/UpdateStudentRoleModal.svelte";
    import UpdateStudent from "$lib/components/UpdateStudent.svelte";

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
    let modalFunction = async function(){};

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
        const foundRole = roles.find(r => r.id === role);
        return foundRole ? foundRole.name : "No role assigned!";
    }


    function handleResendQR(user = {"username": "User not found", "id": 0}) {
        if (user === undefined || (user.id === 0)) return;
        modalOpen = true;
        modalTitle = "Resending QR code";
        modalText = "Are you certain to resend and regenerate QR code of " + user.username + "?";
        modalTextOk = "Resend QR";
        modalFunction = async function(){
            let responseQR = await getQRandSendMail(user.id);
            textSentQRModal = handleSendMailResponse(responseQR.sentMail, user, responseQR.qr);
            openSentQRModal = false;
            openSentQRModal = true;
        };
    }

    function handleDeleteUser(user = undefined){
        if (user === undefined) {
            modalOpen = true;
            modalTitle = "User not found!";
            modalText = "";
        } else {
            modalOpen = true;
            modalTitle = "Deleting user";
            modalText = "Are you sure to delete the user?";
            modalFunction = async function(){
                await deleteUser(user);
                await changeUsers();
            };
        }
    }

    async function changeUsers(page = 1, pageSize = 10) {
        const response = await getUsers(page, pageSize);
        users = response.data;
        currentPage = page;
    }


    const iconStyle = "hover:cursor-pointer hover:bg-light-p_foreground dark:hover:bg-dark-p_foreground rounded h-6 w-6";

    let openCreateUserDialog = false;

    function handleOpenCreateUserDialog(){
        openCreateUserDialog = false;
        openCreateUserDialog = true;
    }

    let openUpdateStudentRoleModal = false;
    let selectedUser = {"id": 0, "username": "User not defined", "roleId": 0, "date_of_birth": "", "email":""};
    let selectedRole = 0;
    function handleChangeUserRole(user = {"id": 0, "username": "User not defined", "roleId": 0}){
        if (user.id === 0) return;
        selectedRole = user.roleId;
        openUpdateStudentRoleModal = false;
        openUpdateStudentRoleModal = true;
        selectedUser = user;
    }

    let openUpdateStudentModal = false;
    function handleChangeUser(user = {"id": 0, "username": "User not defined","date_of_birth": "", "roleId": 0}){
        user.date_of_birth = new Date(user.date_of_birth).toISOString().split('T')[0];
        selectedUser = user;
        openUpdateStudentModal = false;
        openUpdateStudentModal = true;
    }
</script>
<UpdateStudent user={selectedUser} openUpdateUserDialog={openUpdateStudentModal} onClose={changeUsers}/>
<CreateStudent openCreateUserDialog={openCreateUserDialog} onClose={changeUsers}/>
<UpdateStudentRoleModal selectedRoleId={selectedRole} roles={roles} modalOpen={openUpdateStudentRoleModal} user={selectedUser} onClose={changeUsers}/>
<SendQRModal showModal={openSentQRModal} modalText={textSentQRModal} modalTitle={$t("administration.qrRecreation")} />
<Modal title={modalTitle} bind:open={modalOpen} autoclose>
    {modalText}
    <svelte:fragment slot="footer">
        <Button on:click={modalFunction}>{modalTextOk}</Button>
        <Button color="alternative">Cancel</Button>
    </svelte:fragment>
</Modal>
<div class="fixed bottom-12 right-12 z-50">
    <CtaButton
            captionText={$t("administration.addUser")}
            onCTAButtonClickFn={handleOpenCreateUserDialog}
    />
</div>
<TablePage {pages} {currentPage} changeData={changeUsers} title="Student administration">
    <TableHeader headerValues={[
                "Username/ Student number",
                "Email",
                "Role",
                "Above 18",
                "Preferred language",
                ""]}/>
    <TableBody>
        {#if users.length > 0}
            {#each users as user}
                <TableBodyRow>
                    <TableCell position="first">{user.username}</TableCell>
                    <TableCell position="middle">{user.email}</TableCell>
                    <TableCell position="middle">{getRole(user.roleId)}</TableCell>
                    <TableCell position="middle">
                        <div>
                            {#if isAbove18(user.date_of_birth)}
                                <CheckCircleOutline id="date_of_birth" class="text-green-600"/>
                            {:else}
                                <CloseCircleOutline id="date_of_birth" class="text-red-600"/>
                            {/if}
                            <Popover class="text-sm text-light-text dark:text-dark-text z-50"
                                     triggeredBy="#date_of_birth">{dateToString(user.date_of_birth)}</Popover>
                        </div>
                    </TableCell>
                    <TableCell position="middle">{languages[(user.language)]}</TableCell>
                    <TableCell position="last">
                        <div class="flex gap-4">
                            <Button class="p-0" on:click={() => handleResendQR(user)}>
                                <QrCodeOutline class={iconStyle}/>
                            </Button>
                            <Button class="p-0" on:click={() => handleChangeUserRole(user)}>
                                <UserSettingsSolid class={iconStyle} />
                            </Button>
                            <Button class="p-0" on:click={() => handleChangeUser(user)}>
                                <UserEditSolid class={iconStyle}/>
                            </Button>
                            <Button class="p-0" on:click={() => handleDeleteUser(user)}>
                                <TrashBinSolid class={iconStyle}/>
                            </Button>
                        </div>
                    </TableCell>
                </TableBodyRow>
            {/each}
        {/if}
    </TableBody>
</TablePage>
