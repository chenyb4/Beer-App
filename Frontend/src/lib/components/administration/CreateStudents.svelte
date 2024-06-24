<script>
    import {Alert, CloseButton, Input, Label, Modal, Select} from "flowbite-svelte";
    import {t} from "$lib/translations/index.js";
    import CtaButton from "$lib/components/CtaButton.svelte";
    import {createUser, updateUser} from "$lib/service/administration.js";
    import {getQRandSendMail} from "$lib/service/emailService.js";
    import {fly} from 'svelte/transition';
    import {handleSendMailResponse} from "$lib/service/QR.js";
    import {addCreditsForAUser} from "$lib/service/credits.js";
    import languages from "$lib/service/languages.json";

    export let roles;

    export let openCreateUsersDialog = false;

    export let onClose = async function () {
    };

    export let changeQrMessage = function (qr) {
    };


    let studentNumber = "";
    let email = "";
    $: date_of_birth = new Date().toISOString().split('T')[0];
    let helper = "";
    $: hideHelper = true;
    let showCreatedUserModal = false;
    let createdUserModalText = "";
    let studentNumberInput;
    let selectedLanguage = languages[0];
    let selectedRoleId = 2;
    let credits = 0;

    function onStudentNumberChange(event) {
        studentNumber = event.target.value;
        email = studentNumber + "@student.saxion.nl";
    }

    async function handleSubmit() {
        const missingFields = [];
        if (studentNumber.length === 0) {
            missingFields.push($t("administration.studentNumberText"));
        }
        if (email.length === 0) {
            missingFields.push($t("administration.emailText"));
        }
        if (date_of_birth === new Date().toISOString().split('T')[0]) {
            missingFields.push($t("administration.date_of_birthText"));
        }
        if (missingFields.length > 0) {
            helper = missingFields.join(", ");
        }
        if (missingFields.length > 0) {
            missingFields.join(", ");
            hideHelper = false;
            return;
        }

        const response = await createUser(studentNumber, email, date_of_birth, )
        if (response) {
            let userId = response.user.id;
            if (response.user.roleId !== selectedRoleId) {
                const userRoleEdit = await updateUser({
                    user: response.user,
                    language: selectedLanguage,
                    roleId: selectedRoleId
                });
            }
            if (credits !== 0) {
                const userCreditsResponse = await addCreditsForAUser(userId, credits);
            }

            let responseQR = await getQRandSendMail(userId);
            createdUserModalText = handleSendMailResponse(responseQR.sentMail, response.user, responseQR.qr);
            createdUserModalText += "\n" + $t("administration.userCreated") + ": " + response.user.username + " : " + response.user.email;

            changeQrMessage(responseQR.qr)
            showCreatedUserModal = false;
            showCreatedUserModal = true;
            studentNumber = "";
            email = "";
            date_of_birth = new Date().toISOString().split('T')[0];
            selectedLanguage = languages[0];
            selectedRoleId = 2;
            credits = 0;
            studentNumberInput?.focus()
        } else {
            alert("User cannot be created");
        }
        await onClose();
    }

    $: if (openCreateUsersDialog) {
        studentNumberInput?.focus()
    }

    function handleKeyPress(event) {
        if (event.key === 'Enter') {
            handleSubmit();
        }
    }

</script>
<Modal bind:open={openCreateUsersDialog} on:close={onClose} dismissable={false}>
    <div slot="header" class="flex items-center">
        <span class="text-3xl text-light-text dark:text-dark-text">{$t("administration.addUsers")}</span>
        <CloseButton tabindex="-1" class="absolute top-5 right-5" on:click={() => openCreateUsersDialog = false} />
    </div>

    {#if showCreatedUserModal}
        <Alert class="bg-light-s_bg dark:bg-dark-s_bg">
            {@html createdUserModalText}
        </Alert>
    {/if}
    {#if !hideHelper}
        <Alert class="bg-light-s_bg dark:bg-dark-s_bg mt-2 border-1" color="red" dismissable transition={fly}
               on:close={() => hideHelper=true}>
            <span class="font-medium">{$t("administration.helper") + ": " + helper} </span>
        </Alert>
    {/if}
    <div class="mb-6">
        <Label for="studentNumber-input" class="block mb-2">{$t("administration.studentNumber")}</Label>
        <input on:keypress={handleKeyPress}
               class="block w-full disabled:cursor-not-allowed disabled:opacity-50 rtl:text-right p-3 focus:border-primary-500 focus:ring-primary-500 dark:focus:border-primary-500 dark:focus:ring-primary-500 bg-gray-50 text-gray-900 dark:bg-gray-600 dark:text-white dark:placeholder-gray-400 border-gray-300 dark:border-gray-500 sm:text-base rounded-lg"
               bind:value={studentNumber} on:input={onStudentNumberChange} id="studentNumber-input"
               placeholder={$t("administration.studentNumberPlaceholder")} bind:this={studentNumberInput}/>

    </div>
    <div class="mb-6">
        <Label for="email-input" class="block mb-2">{$t("administration.email")}</Label>
        <Input on:keypress={handleKeyPress} bind:value={email} id="email-input" size="lg"
               placeholder={$t("administration.emailPlaceholder")}/>
    </div>
    <div class="mb-6">
        <Label for="date_of_birth-input" class="block mb-2">{$t("administration.date_of_birth")}</Label>
        <Input bind:value={date_of_birth} on:keypress={handleKeyPress} type="date" id="date_of_birth-input" size="lg"/>
    </div>
    <div class="mb-6">
        <Label for="credits-input" class="block mb-2">{$t("administration.credits")}</Label>
        <Input bind:value={credits} on:keypress={handleKeyPress} type="number" id="credits-input" size="lg"/>
    </div>
    <div class="mb-6">
        <Label for="roleSelection">{$t("administration.changeRole")}</Label>
        <Select id="roleSelection" bind:value={selectedRoleId} on:keypress={handleKeyPress}>
            {#each roles as role}
                <option value={role.id}>
                    {role.name}
                </option>
            {/each}
        </Select>
    </div>
    <div class="mb-6">
        <Label for="language-input" class="block mb-2">{$t("administration.language")}</Label>
        <Select required bind:value={selectedLanguage} id="language-input" size="lg">
            {#each languages as language, index}
                <option value={index}>
                    {language}
                </option>
            {/each}
        </Select>
    </div>
    <CtaButton captionText={$t("administration.addUser")} onCTAButtonClickFn={handleSubmit}/>
</Modal>
