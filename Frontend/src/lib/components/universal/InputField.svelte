<script>
    export let label = "";
    export let value = "";
    export let id = "";
    export let type = "text";
    export let ref = null;
    export let inputClass = "";
    export let labelClass = "";
</script>

<div class="flex flex-col">
    <label class="pb-0.5 {labelClass}" for={id}>{label}</label>
    <input
        class="bg-white-200 text-black rounded-lg border-none dark:bg-dark-800 dark:text-white focus:outline-0 !{inputClass}"
        {id}
        {...{ type }}
        bind:value
        bind:this={ref}
    />
</div>
