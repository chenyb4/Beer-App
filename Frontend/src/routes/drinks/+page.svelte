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
    let product;

    console.log(product);

    onMount(() => {
        ref.focus();
    });
</script>

<body class="bg-dark-800 w-screen h-screen">
    <div class="w-full h-full">
        <div class="bg-dark-900 m-4 rounded-xl">
            <h2 class="p-4 font-bold">{$t("drinks.title")}</h2>
            <div class="flex flex-col mx-4">
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
                <div class=" w-72">
                    <DrinkSearchBar bind:value={drinksScanner} bind:product
                    ></DrinkSearchBar>
                </div>
                <div
                    class="bg-dark-800 w-full h-full my-6 flex flex-col min-h-96 rounded-xl"
                ></div>
            </div>
        </div>
    </div>
</body>
