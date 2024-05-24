<script>
    // @ts-nocheck

    import InputField from "$lib/components/InputField.svelte";
    import { t } from "$lib/translations/index.js";
    import { onMount } from "svelte";

    let ref;
    let identifier = "";
    let studentNumber = "";
    let drinksScanner = "";

    const drinks = ["Heineken", "Coca-Cola", "Grolsch", "Hertog Jan"];

    onMount(() => {
        ref.focus();
    });

    function toggleDrinkOptions() {
        let display = document.getElementById("drinkOptions").style.display;
        if (display === "" || display === "none") {
            document.getElementById("drinkOptions").style.display = "block";
        } else document.getElementById("drinkOptions").style.display = "none";
    }

    $: identifier, console.log(identifier);

    // $: drinksScanner, function searchInDrinks() => {}
</script>

<body>
    <div class="bg-dark-900 m-4 p-1">
        <h2>{$t("drinks.title")}</h2>
        <InputField
            label={$t("drinks.identifier")}
            id="identifier_input"
            bind:value={identifier}
            bind:ref
            inputClass="dark:bg-dark-800"
        ></InputField>
        <InputField
            label={$t("drinks.studentNumber")}
            id="studentNumber_input"
            bind:value={studentNumber}
            inputClass="dark:bg-dark-800"
        ></InputField>
        <div>
            <div id="searchBar" class="flex flex-col">
                <label for="inputSearchBar">{$t("drinks.drinkScanner")}</label>
                <input
                    class="dark:bg-dark-800 border-none rounded-lg"
                    type="text"
                    id="inputSearchBar"
                    bind:value={studentNumber}
                    on:focus={toggleDrinkOptions}
                    on:blur={toggleDrinkOptions}
                />
                <div id="drinkOptions" class="hidden">
                    {#each drinks as drink}
                        <p>{drink}</p>
                    {/each}
                </div>
            </div>
        </div>
        <!-- <InputField
            label={$t("drinks.drinkScanner")}
            id="selectedDrink_input"
            bind:value={drinksScanner}
            inputClass="dark:bg-dark-800"
        ></InputField> -->
    </div>
</body>
