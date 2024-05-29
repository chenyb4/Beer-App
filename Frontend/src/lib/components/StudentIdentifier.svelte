<script>
    // @ts-nocheck

    import { t } from "$lib/translations/index.js";

    export let identifier = "";
    export let userName = "";
    export let ref = "";
    export let identifiedUser;
    let errorMessage = "";
    let user;

    let env = import.meta.env;

    function handleSubmit(event) {
        event.preventDefault();
        matchIdentifierToStudent(identifier);
    }

    async function matchIdentifierToStudent(identifier) {
        try {
            const response = await fetch(
                "http://" +
                    env.VITE_APIURL +
                    ":" +
                    env.VITE_APIPORT +
                    "/users?id=" +
                    identifier,
            );

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            user = await response.json();
            identifiedUser = user;
            userName = user.username;
            errorMessage = "";
        } catch (error) {
            console.error("Failed to fetch user data:", error);
            errorMessage = "Failed to fetch user data. Please try again later.";
            userName = "";
            identifiedUser = "";
        }
    }
</script>

<form on:submit={handleSubmit}>
    <div class="flex flex-col">
        <label class="pb-0.5" for="identifier_input"
            >{$t("drinks.identifier")}</label
        >
        <div class="flex flex-row items-center">
            <input
                class="bg-white-200 text-black rounded-lg border-none dark:bg-dark-800 dark:text-white focus:outline-0"
                id="identifier_input"
                type="text"
                bind:value={identifier}
                bind:this={ref}
            />
            <button
                class="bg-dark-200 rounded-2xl ml-2 px-4 py-2"
                type="submit"
            >
                Submit
            </button>
            {#if errorMessage}
                <p class="text-red-400 px-4">{errorMessage}</p>
            {/if}
        </div>
        <label class="pb-0.5" for="studentNumber_input"
            >{$t("drinks.studentNumber")}</label
        >
        <input
            disabled
            class="bg-white-200 text-black rounded-lg border-none dark:bg-dark-800 dark:text-white focus:outline-0 opacity-55 max-w-72"
            id="studentNumber_input"
            type="text"
            bind:value={userName}
        />
    </div>
</form>
