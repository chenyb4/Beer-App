<script>
    // @ts-nocheck

    import { t } from "$lib/translations/index.js";

    export let identifier = "";
    export let studentNumber = "";
    export let students = [];
    export let ref = "";
    let errorMessage = "";

    function handleSubmit(event) {
        event.preventDefault();
        matchIdentifierToStudent(identifier);
    }

    function matchIdentifierToStudent(identifier) {
        const student = students.find((student) => student.id === identifier);
        if (student) {
            studentNumber = student.studentNumber;
            errorMessage = ""; // Reset the error message if a student is found
        } else {
            studentNumber = "";
            errorMessage = "Invalid identifier. Please try again.";
        }
    }
</script>

<form on:submit={handleSubmit}>
    <div class="flex flex-col">
        <label class="pb-0.5" for="identifier_input"
            >{$t("drinks.identifier")}</label
        >
        <div class="flex flex-row">
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
        </div>
        {#if errorMessage}
            <p class="text-red-400">{errorMessage}</p>
        {/if}
        <label class="pb-0.5" for="studentNumber_input"
            >{$t("drinks.studentNumber")}</label
        >
        <input
            disabled
            class="bg-white-200 text-black rounded-lg border-none dark:bg-dark-800 dark:text-white focus:outline-0 opacity-55"
            id="studentNumber_input"
            type="text"
            bind:value={studentNumber}
        />
    </div>
</form>
