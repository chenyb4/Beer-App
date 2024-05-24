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
    </div>
</body>
