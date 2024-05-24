<script>
    import { t } from "$lib/translations/index.js";

    export let drinks;
    export let value = "";

    function toggleDrinkOptions() {
        let display = document.getElementById("drinkOptions").style.display;
        if (display === "" || display === "none") {
            document.getElementById("drinkOptions").style.display = "block";
        } else document.getElementById("drinkOptions").style.display = "none";
    }
</script>

<div id="searchBar" class="flex flex-col">
    <label for="inputSearchBar">{$t("drinks.drinkScanner")}</label>
    <input
        class="dark:bg-dark-800 border-none rounded-lg"
        type="text"
        id="inputSearchBar"
        bind:value
        on:focus={toggleDrinkOptions}
        on:blur={toggleDrinkOptions}
    />
    <div id="drinkOptions" class="hidden">
        {#each drinks as drink}
            <p>{drink}</p>
        {/each}
    </div>
</div>
