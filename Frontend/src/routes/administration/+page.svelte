<script>
    import {t} from "$lib/translations/index.js";
    import CreateStudent from "$lib/components/administration/CreateStudent.svelte";
    import {handleSendMailResponse} from "$lib/service/QR.js";
    import TablePage from "$lib/components/table/TablePage.svelte";
    import {Popover, TableBody, TableBodyRow, } from "flowbite-svelte";
    import languages from "$lib/service/languages.json";
    import {dateToString} from "$lib/service/dateToString.js";
    import { CheckCircleOutline, QrCodeOutline, TrashBinSolid, UserEditSolid, UserSettingsSolid } from "flowbite-svelte-icons";
    import {deleteUser, getUsers} from "$lib/service/administration.js";
    import TableHeader from "$lib/components/table/TableHeader.svelte";
    import TableCell from "$lib/components/table/TableCell.svelte";
    import {getQRandSendMail} from "$lib/service/emailService.js";
    import UpdateStudentRoleModal from "$lib/components/administration/UpdateStudentRoleModal.svelte";
    import UpdateStudent from "$lib/components/administration/UpdateStudent.svelte";
    import CreateStudents from "$lib/components/administration/CreateStudents.svelte";
    import {isAbove18} from "$lib/service/users.js"
    import AmountInTableSelect from "$lib/components/table/AmountInTableSelect.svelte";
    import QRImageDisplay from "$lib/components/administration/QRImageDisplay.svelte";
    import UniversalModal from "$lib/components/universal/UniversalModal.svelte";
    import ButtonExtraOption from "$lib/components/administration/ButtonExtraOption.svelte";
    import TableIcons from "$lib/components/table/TableIcons.svelte";
    import SendQRModal from "$lib/components/ResponseModal.svelte";
    import AdministrationFilterInputs from "./AdministrationFilterInputs.svelte";

    export let data;
    $: users = data.users?.data || [];

    const pages = Math.ceil(data.users?.meta.total / data.users?.meta.page_size) || 1;
    let currentPage = 1;

    const roles = data.roles?.data || [];
    let filterUsername = "";
    let filterEmail = "";
    let filterIsLegalAge = 0;
    let filterLanguage = -1;
    let filterRole = 0;
    let pageSize = 6;
    let modalComponent;
    let modalProps = {};
    let selectedUser = {
        id: 0,
        username: "User not defined",
        roleId: 0,
        date_of_birth: "",
        email: "",
        language: "english"
    };

    /**
     * Filter role by id to find right role
     * @param role
     */
    function getRole(role = 0) {
        const foundRole = roles.find((r) => r.id === role);
        return foundRole ? foundRole.name : "No role assigned!";
    }

    /**
     * Request backend to send QR and handle response for user
     * @param user Selected user
     */
    function handleResendQR(user = {username: "User not found", id: 0}) {
        if (user === undefined || user.id === 0) return;
        modalComponent = UniversalModal
        modalProps = {
            modalTitle: "Resending QR code",
            modalTextOk: "Resend QR",
            modalText: "Are you certain to resend and regenerate QR code of " + user.username + "?",
            modalFunction: async function () {
                let responseQR = await getQRandSendMail(user.id);
                await handleQRMailReaction(responseQR, user);
                qrMessage = responseQR.qr;
            },
            onClose: handleCloseOfModal,
        }
    }

    /**
     * Handle reaction of request of sending QR. Make an information modal out of it
     * @param responseQR Response of QR sending request
     * @param user Selected user
     */
    async function handleQRMailReaction(responseQR, user){
        modalComponent = SendQRModal;
        const modalText = handleSendMailResponse(
            responseQR.sentMail,
            user,
            responseQR.qr
        );
        modalProps = {
            modalText: modalText,
            modalTitle: 'Sending QR',
        }
    }

    /**
     * Handle deleting user
     * @param user Selected user
     */
    function handleDeleteUser(user = undefined) {
        modalComponent = UniversalModal;
        modalProps = {
            modalTitle: "Deleting user",
            modalText: "Are you sure to delete the user?",
            modalFunction: async function () {
                await deleteUser(user);
                await changeUsers();
                handleCloseOfModal()
            },
            onClose: handleCloseOfModal
        }
    }

    /**
     * Handle event of changing size of table. Finally, update users
     * @param event
     */
    async function getHandleTableChange(event) {
        pageSize = event.detail.pageSize
        await changeUsers();
    }

    /**
     * Handle filters of row of filters. Finally, update users
     * @param event
     */
    async function getHandleFilter(event) {
        filterUsername = event.detail.filterUsername
        filterEmail= event.detail.filterEmail
        filterIsLegalAge = event.detail.filterIsLegalAge
        filterLanguage = event.detail.filterLanguage
        filterRole = event.detail.filterRole
        await changeUsers();
    }

    /**
     * Update the users inside the table body
     * @param page
     */
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

    /**
     * Make modal component ChangeUser component for editing user
     * @param user
     */
    const handleChangeUser = (user = selectedUser) => {
        modalComponent = UpdateStudent;
        modalProps = {
            user: user,
            selectedDateOfBirth: new Date(user.date_of_birth).toISOString().split('T')[0],
            onClose: handleCloseOfModal,
        };
    };

    /**
     * Make modal component CreateStudents component for creating users
     */
    const handleOpenCreateUsersDialog = () => {
        modalComponent = CreateStudents;
        modalProps = {
            roles: roles,
            changeQrMessage: changeQrMessage,
            onClose: handleCloseOfModal,
        };
    };

    /**
     * Make modal component CreatStudent component for creating user
     */
    const handleOpenCreateUserDialog = () => {
        modalComponent = CreateStudent;
        modalProps = {
            changeQrMessage: changeQrMessage,
            onClose: handleCloseOfModal
        };
    };

    $: qrMessage = "";

    /**
     * Change qr message to show QR afters sending QR
     * @param qr
     */
    function changeQrMessage(qr) {
        qrMessage = qr;
    }

    /**
     * Make modal component ChangeUser component for changing role of user
     * @param user
     */
    const handleChangeUserRole = (user = selectedUser) => {
        modalComponent = UpdateStudentRoleModal;
        modalProps = {
            roles: roles,
            user: user,
            selectedRoleId: user.roleId,
            onClose: handleCloseOfModal,
        };
    };

    /**
     * After close of modal, clean up modal.
     */
    function handleCloseOfModal(){
        changeUsers()
        modalComponent = null;
        modalProps= {}
    }

    function resetQr(){
        qrMessage = "";
    }
</script>
<svelte:component this={modalComponent} {...modalProps}/>
{#if qrMessage !== ""}
    <QRImageDisplay qrMessage={qrMessage} resetQr={resetQr}/>
{/if}
<div class="fixed bottom-12 right-12 z-50">
    <ButtonExtraOption
            buttonText={$t("administration.addUser")}
            handleButton={handleOpenCreateUserDialog}
            dropDownText={$t("administration.addUsers")}
            handleDropDownButton={handleOpenCreateUsersDialog}

    />
</div>
<AmountInTableSelect pageSize={pageSize} on:changeTable={getHandleTableChange} />
<TablePage {pages} {currentPage} changeData={changeUsers} title={$t("administration.titleAdmin")} >
    <TableHeader headerValues={[ "Username", "Email", "Role", "Above 18", "Preferred language", "credits", ""]}/>
    <TableBody>
        <AdministrationFilterInputs
                on:changeFilters={getHandleFilter}
                {roles}
            />
        {#if users.length > 0}
            {#each users as user}
                <TableBodyRow>
                    <TableCell position="first">{user.username}</TableCell>
                    <TableCell position="middle">{user.email}</TableCell>
                    <TableCell position="middle">{getRole(user.roleId)}</TableCell>
                    <TableCell position="middle">
                        <div>
                            <CheckCircleOutline
                                    id={`date_of_birth-${user.id}`}
                                    class="{isAbove18(user.date_of_birth) ? 'text-green-600' : 'text-red-600'}"
                            />
                            <Popover
                                    class="text-sm text-light-text dark:text-dark-text z-50"
                                    triggeredBy={`#date_of_birth-${user.id}`}
                            >
                                {dateToString(user.date_of_birth)}
                            </Popover>
                        </div>
                    </TableCell>
                    <TableCell position="middle">{languages[user.language]}</TableCell>
                    <TableCell position="middle">{user.credits}</TableCell>
                    <TableCell position="last">
                        <TableIcons
                                icons={[
                        { icon: QrCodeOutline, function: () => handleResendQR(user) },
                        { icon: UserSettingsSolid, function: () => handleChangeUserRole(user) },
                        { icon: UserEditSolid, function: () => handleChangeUser(user) },
                        { icon: TrashBinSolid, function: () => handleDeleteUser(user)} ]}/>
                    </TableCell>
                </TableBodyRow>
            {/each}
        {/if}
    </TableBody>
</TablePage>
