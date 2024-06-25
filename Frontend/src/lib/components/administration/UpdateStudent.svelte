<script>
    import {Alert, CloseButton, Input, Label, Modal, Select} from "flowbite-svelte";
    import {t} from "$lib/translations/index.js";
    import CtaButton from "$lib/components/universal/CtaButton.svelte";
    import {updateUser} from "$lib/service/administration.js";
    import {fly} from 'svelte/transition';
    import languages from "$lib/service/languages.json"

    let openUpdateUserDialog = true;

    export let onClose = async function () {
    };

    export let user = {
        "id": 0,
        "email": "",
        "username": "",
        "date_of_birth": "",
        "language": "",
    };
    export let selectedDateOfBirth = "";

    let helper = "";
    let hideHelper = true;

    async function handleSubmit() {
        const missingFields = [];
        if (user.username.length === 0) {
            missingFields.push($t("administration.studentNumberText"));
        }
        if (selectedDateOfBirth === new Date().toISOString().split('T')[0]) {
            missingFields.push($t("administration.date_of_birthText"));
        }
        if (missingFields.length > 0) {
            helper = missingFields.join(", ");
        }
        if (missingFields.length > 0) {
            console.log(missingFields.join(", "));
            hideHelper = false;
            return;
        }
        const response = await updateUser({user, language:user.language, username: user.username, date_of_birth: selectedDateOfBirth});
        if (!response) alert("User not found");
        await onClose();
        openUpdateUserDialog = false;
    }

    async function handleOnClose() {
        openUpdateUserDialog = false
        await onClose();
    }
</script>
<Modal bind:open={openUpdateUserDialog}>
    <div slot="header" class="flex items-center">
        <span class="text-3xl text-light-text dark:text-dark-text">{$t("administration.addUsers")}</span>
        <CloseButton tabindex="-1" class="absolute top-5 right-5" on:click={() => handleOnClose()} />
    </div>
    <span class="text-3xl text-light-text dark:text-dark-text">{$t("administration.editUser")}</span>
    {#if !hideHelper}
        <Alert class="bg-light-s_bg dark:bg-dark-s_bg mt-2 border-1" color="red" dismissable transition={fly}>
            <span class="font-medium">{$t("administration.helper") + ": " + helper} </span>
        </Alert>
    {/if}
    <div class="mb-6">
        <Label for="studentNumber-input" class="block mb-2">{$t("administration.studentNumber")}</Label>
        <Input required bind:value={user.username} id="studentNumber-input" size="lg"
               placeholder={$t("administration.studentNumberPlaceholder")}/>
    </div>
    <div class="mb-6">
        <Label for="studentNumber-input" class="block mb-2">{$t("administration.studentNumber")}</Label>
        <Select required bind:value={user.language} id="studentNumber-input" size="lg">
            {#each languages as language, index}
                <option value={index}>
                    {language}
                </option>
            {/each}
        </Select>
    </div>
    <div class="mb-6">
        <Label for="date_of_birth-input" class="block mb-2">{$t("administration.date_of_birth")}</Label>
        <Input bind:value={selectedDateOfBirth} type="date" id="date_of_birth-input" size="lg"/>
    </div>
    <CtaButton captionText={$t("administration.editUser")} onCTAButtonClickFn={handleSubmit}/>
</Modal>
