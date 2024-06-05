<script>
    import {t} from "$lib/translations/index.js";
    import {Button, Label, Modal, Select} from "flowbite-svelte";
    import {updateUser} from "$lib/service/administration.js";

    export let roles = [{id: 0, name: "No roles assigned!"}];
    export let modalOpen = false;
    export let user = {"roleId":0};
    let selectedRoleId = user.roleId;

    async function handleChangeRole(){
        if (selectedRoleId === 0){
            alert("Something went wrong");
            return;
        }
        const response = await updateUser(user, undefined, undefined, undefined, selectedRoleId);
        if (!response) alert("Something went wrong");
        await onClose();
    }

    export let onClose = async function(){};
</script>

<Modal title='{$t("administration.edit")}' bind:open={modalOpen} autoclose>
    <Label for="roleSelection">{$t("administration.changeRole")}</Label>
    <Select id="roleSelection" bind:value={selectedRoleId}>
        {#each roles as role}
            <option value={role.id}>
                {role.name}
            </option>
        {/each}
    </Select>
    <svelte:fragment slot="footer">
        <Button on:click={handleChangeRole}>{$t("administration.edit")}</Button>
        <Button color="alternative">Cancel</Button>
    </svelte:fragment>
</Modal>