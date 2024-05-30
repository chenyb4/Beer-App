<script>
    import {Alert, Drawer,, Input, Label} from "flowbite-svelte";
    import {t} from "$lib/translations/index.js";
    import CtaButton from "$lib/components/CtaButton.svelte";
    import {createUser} from "$lib/service/administration";
    import {fly} from 'svelte/transition';

    export let hideCreateUserDialog = true;

    let studentNumber = "";
    let email = "";
    let date_of_birth = new Date().toISOString().split('T')[0];
    let helper = "";
    $: hideHelper = true;

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
            console.log(missingFields.join(", "));
            hideHelper = false;
            return;
        }

        const response = await createUser(studentNumber, email, date_of_birth)
        alert(response);
        hideCreateUserDialog = true;
    }
</script>

<Drawer class="absolute w-4/5 md:w-3/5 left-0 right-0 m-auto mt-10 mb-10 rounded-2xl"
        bind:hidden={hideCreateUserDialog}>
    <span class="text-3xl text-light-text dark:text-dark-text">{$t("administration.addUser")}</span>
    {#if !hideHelper}
        <Alert class="bg-light-s_bg dark:bg-dark-s_bg mt-2 border-1" color="red" dismissable transition={fly}>
            <span class="font-medium">{$t("administration.helper") + ": " + helper} </span>
        </Alert>
    {/if}
    <div class="mb-6">
        <Label for="studentNumber-input" class="block mb-2">{$t("administration.studentNumber")}</Label>
        <Input required bind:value={studentNumber} on:input={onStudentNumberChange} id="studentNumber-input" size="lg"
               placeholder={$t("administration.studentNumberPlaceholder")}/>
    </div>
    <div class="mb-6">
        <Label for="email-input" class="block mb-2">{$t("administration.email")}</Label>
        <Input bind:value={email} id="email-input" size="lg" placeholder={$t("administration.emailPlaceholder")}/>
    </div>
    <div class="mb-6">
        <Label for="date_of_birth-input" class="block mb-2">{$t("administration.date_of_birth")}</Label>
        <Input bind:value={date_of_birth} type="date" id="date_of_birth-input" size="lg"/>
    </div>
    <CtaButton captionText={$t("administration.addUser")} onCTAButtonClickFn={handleSubmit}/>
</Drawer>
