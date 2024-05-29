<script>
    // @ts-nocheck

    import InputField from "$lib/components/InputField.svelte";
    import { t } from "$lib/translations/index.js";
    import { onMount } from "svelte";
    import DrinkSearchBar from "$lib/components/DrinkSearchBar.svelte";
    import StudentIdentifier from "$lib/components/StudentIdentifier.svelte";

    let ref;
    let identifiedUser;
    let identifier = "";
    let userName = "";
    let drinksScanner = "";

    onMount(() => {
        ref.focus();
    });
</script>

<body class="bg-dark-800 w-screen h-screen">
    <div class="w-full h-full bg-dark-900 p-4 bg-clip-content">
        <h2 class="p-6">{$t("drinks.title")}</h2>
        <div class="flex flex-col mx-6">
            <div class="flex flex-row justify-between">
                <StudentIdentifier
                    bind:identifiedUser
                    bind:identifier
                    bind:userName
                    bind:ref
                />
                {#if identifiedUser}
                    <div
                        class="bg-dark-300 w-64 p-4 rounded-2xl flex-col items-center"
                    >
                        <h4>Amount of credits left:</h4>
                        <p class="flex justify-center text-4xl">
                            {identifiedUser.credits}
                        </p>
                    </div>
                {/if}
            </div>
            <div class="flex w-full">
                <DrinkSearchBar bind:value={drinksScanner}></DrinkSearchBar>
            </div>
        </div>
    </div>
</body>
