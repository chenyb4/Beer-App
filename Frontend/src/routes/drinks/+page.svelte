<script>
    // @ts-nocheck

    import InputField from "$lib/components/InputField.svelte";
    import { t } from "$lib/translations/index.js";
    import { onMount } from "svelte";
    import DrinkSearchBar from "$lib/components/DrinkSearchBar.svelte";
    import StudentIdentifier from "$lib/components/StudentIdentifier.svelte";

    let ref;
    let identifiedStudent;
    let identifier = "";
    let studentNumber = "";
    let drinksScanner = "";

    const drinks = [
        { name: "Heineken", ean: "1234" },
        { name: "Coca-Cola", ean: "0000" },
        { name: "Grolsch", ean: "9999" },
        { name: "Hertog Jan", ean: "7777" },
    ];

    const students = [
        {
            id: "0000",
            studentNumber: "483545",
            credits: "10",
        },
        {
            id: "1111",
            studentNumber: "500000",
            credits: "5",
        },
    ];

    onMount(() => {
        ref.focus();
    });
</script>

<body>
    <div class="bg-dark-900 m-4 p-1">
        <h2>{$t("drinks.title")}</h2>
        <div class="flex flex-row">
            <div class="flex flex-col">
                <StudentIdentifier
                    bind:identifiedStudent
                    bind:identifier
                    bind:studentNumber
                    {students}
                    bind:ref
                />

                <DrinkSearchBar {drinks} bind:value={drinksScanner}
                ></DrinkSearchBar>
            </div>
            {#if identifiedStudent}
                <p class="text-red-400">{identifiedStudent.credits}</p>
            {/if}
        </div>
    </div>
</body>
