<script>
    export let label = "";
    export let value = "";
    export let id = "";
    export let type = "text";
</script>

<div class="flex flex-col">
    <label class="pb-0.5" for={id}>{label}</label>
    <input
        class="bg-white-200 text-black rounded-lg border-none dark:bg-dark-900 dark:text-white focus:outline-0"
        {id}
        {...{ type }}
        bind:value
    />
</div>
