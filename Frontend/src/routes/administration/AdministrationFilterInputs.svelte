<script>
    import languages from "$lib/service/languages.json";
    import {Button, Input, TableBodyRow} from "flowbite-svelte";
    import TableCellWithInputs from "$lib/components/table/TableCellWithInputs.svelte";
    import {createEventDispatcher} from "svelte";

    let filterUsername = "";
    let filterEmail = "";
    let filterRole = 0;
    export let roles = [{id: -1, name: "not found"}]
    let filterLanguage = -1;
    let filterIsLegalAge = -1;

    const dispatch = createEventDispatcher();

    function changeFilters() {
        dispatch('changeFilters', {
            filterUsername,
            filterEmail,
            filterRole,
            filterLanguage,
            filterIsLegalAge
        });
    }
</script>

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
            <option value={0}> Not selected</option>
        </select>
    </TableCellWithInputs>
    <TableCellWithInputs position="middle">
        <select
                bind:value={filterIsLegalAge}
                id="IsLegalAge"
                class="w-full rounded-xl text-light-text dark:text-dark-text bg-light-input_bg dark:bg-dark-input_bg"
        >
            <option value={true}> Yes</option>
            <option value={false}> No</option>
            <option value={0}> Not selected</option>
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
            <option value={-1}> Not selected</option>
        </select>
    </TableCellWithInputs>
    <TableCellWithInputs position="middle"/>
    <TableCellWithInputs position="last">
        <Button
                class="w-full bg-light-p_foreground dark:bg-dark-p_foreground font-medium rounded-full text-lg text-center"
                on:click={changeFilters}
        >
            Filter
        </Button>
    </TableCellWithInputs>
</TableBodyRow>