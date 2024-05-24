<script>
    // @ts-nocheck

    import InputField from "$lib/components/InputField.svelte";
    import { t } from "$lib/translations/index.js";
    import { onMount } from "svelte";
    import DrinkSearchBar from "$lib/components/DrinkSearchBar.svelte";

    let ref;
    let identifier = "";
    let studentNumber = "";
    let drinksScanner = "";

    const drinks = [
        { name: "Heineken", ean: "1234" },
        { name: "Coca-Cola", ean: "0000" },
        { name: "Grolsch", ean: "9999" },
        { name: "Hertog Jan", ean: "7777" },
    ];

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
    $: drinksScanner, console.log(drinksScanner);

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
            inputClass="dark:bg-dark-300"
        ></InputField>

        <DrinkSearchBar {drinks} bind:value={drinksScanner}></DrinkSearchBar>

        <!-- <InputField
            label={$t("drinks.drinkScanner")}
            id="selectedDrink_input"
            bind:value={drinksScanner}
            inputClass="dark:bg-dark-800"
        ></InputField> -->
    </div>
</body>
