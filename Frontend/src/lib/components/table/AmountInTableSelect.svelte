<script>
    import {createEventDispatcher} from "svelte";

    export let pageSize = 6;

    const dispatch = createEventDispatcher();

    function changeTable() {
        dispatch('changeTable', {
            pageSize: pageSize
        });
    }
</script>
<select
        bind:value={pageSize}
        on:change={changeTable}
        class="absolute right-10 top-10 rounded-xl text-light-text dark:text-dark-text bg-light-input_bg dark:bg-dark-input_bg"
>
    <option value={6}> 6 </option>
    <option value={12}> 12 </option>
    <option value={18}> 18 </option>
</select>