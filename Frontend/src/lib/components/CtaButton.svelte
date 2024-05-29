<script>

export let captionText;
export let onCTAButtonClickFn;


</script>


<button
        on:click={onCTAButtonClickFn}
        type="submit"
        style="background-color: #009C82;"
        class="mt-12 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
>
    {captionText}
</button>
