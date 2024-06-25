<script>
    import {t} from "$lib/translations/index.js";
    import {Button, Input, Label, Modal, Select} from "flowbite-svelte";
    import {updateUser} from "$lib/service/administration.js";

    export let roles = [{id: -1, name: "No roles assigned!"}];
    export let modalOpen = false;
    export let user = {"roleId": -1};
    let selectedRoleId = -1;
    $: showPassword = selectedRoleId === 3 || selectedRoleId === 4;
    let password = "";
    let passwordConfirm = "";

    async function handleChangeRole() {
        if (selectedRoleId === 0) {
            alert("Something went wrong");
            return;
        }
        let response;
        if (showPassword) {
            if (password === passwordConfirm) {
                response = await updateUser({user, roleId: selectedRoleId, password});
            } else {
                alert("Passwords do not match");
            }
        } else {
            response = await updateUser({user, roleId: selectedRoleId});
        }

        if (!response) alert("Something went wrong");
        await onClose();
    }

    export let onClose = async function () {};


</script>

<Modal title='{$t("administration.editUser")}' bind:open={modalOpen} autoclose>
    <Label for="roleSelection">{$t("administration.changeRole")}</Label>
    <Select id="roleSelection" bind:value={selectedRoleId}>
        {#each roles as role}
            <option value={role.id}>
                {role.name}
            </option>
        {/each}
    </Select>
    {#if (showPassword)}
        <Label for="rolePassword">{$t("administration.password")}</Label>
        <Input id="rolePassword" type="password" bind:value={password}/>
        <Label for="rolePasswordConfirm">{$t("administration.passwordConfirm")}</Label>
        <Input id="rolePasswordConfirm" type="password" bind:value={passwordConfirm}/>
    {/if}
    <svelte:fragment slot="footer">
        <Button on:click={handleChangeRole}>{$t("administration.editUser")}</Button>
        <Button color="alternative">Cancel</Button>
    </svelte:fragment>
</Modal>