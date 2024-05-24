<script>
    import { t } from "$lib/translations/index.js";

    export let drinks;
    export let filteredDrinksOptions = [];
    export let value = "";

    function showDrinksOptions() {
        document.getElementById("drinkOptions").style.display = "block";
    }

    function filterDrinksOptions() {
        filteredDrinksOptions = drinks.filter((drink) =>
            drink.name.toLowerCase().match(value.toLowerCase()),
        );
        if (value === "") {
            filteredDrinksOptions = [];
        }
    }

    function selectDrink(drinkName) {
        value = drinkName;
        document.getElementById("drinkOptions").style.display = "none";
    }
</script>

<div id="searchBar" class="flex flex-col">
    <label for="inputSearchBar">{$t("drinks.drinkScanner")}</label>
    <input
        class="dark:bg-dark-800 border-none rounded-lg"
        type="text"
        id="inputSearchBar"
        bind:value
        on:focus={showDrinksOptions}
        on:input={filterDrinksOptions}
    />
    <div id="drinkOptions" class="block">
        {#each filteredDrinksOptions as drink}
            <button
                class="border border-dark-300 w-full"
                on:click={selectDrink(drink.name)}>{drink.name}</button
            >
        {/each}
    </div>
</div>
