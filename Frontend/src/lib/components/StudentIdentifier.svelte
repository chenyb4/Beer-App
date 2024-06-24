<script>
  import { getUsers } from "$lib/service/administration";
  import { getUserByQRIdentifier } from "$lib/service/users";
  import { t } from "$lib/translations/index.js";
  import { Toggle } from "flowbite-svelte";
  import { QrCodeOutline } from "flowbite-svelte-icons";

  export let identifier = "";
  export let userName = "";
  export let ref;
  export let identifiedUser = {};
  export let scannerActive = true;

  let errorMessage = "";
  let users = {};
  let autoEmail = "";

  async function handleSubmit(event) {
    //Preventing empty submit
    event.preventDefault();
    errorMessage = "";

    try {
      if (scannerActive) {
        await handleScanner();
      } else {
        await handleUserName();
      }
    } catch (error) {
      handleError();
    }
  }

  async function handleScanner() {
    try {
      identifiedUser = await getUserByQRIdentifier(identifier);
      autoEmail = identifiedUser.email;
    } catch (error) {
      handleError();
    }
  }

  async function handleUserName() {
    if (userName.length <= 5) {
      handleError();
      return;
    }

    try {
      users = await getUsers(1, 6, userName);
      if (users.data.length) {
        identifiedUser = users.data[0];
        autoEmail = identifiedUser.email;
      } else {
        handleError();
      }
    } catch (error) {
      handleError();
    }
  }

  function handleError() {
    errorMessage = $t("drinks.errorMessage");
    autoEmail = "";
  }

  function handleInput(event) {
    if (identifier.length > 59) {
      handleSubmit(event);
    }
  }

  function toggleScanner() {
    scannerActive = !scannerActive;
  }
</script>

<div class="flex flex-col">
  <div class="absolute top-10 right-10">
    <div
      class="flex flex-row align-middle items-center justify-center pb-0.5 max-w-72"
    >
      <div class="pr-2">
        <QrCodeOutline></QrCodeOutline>
      </div>
      <Toggle on:click={toggleScanner} size="small"></Toggle>
      <span class="text-xs">Studentnumber</span>
    </div>
  </div>
  <form on:submit={handleSubmit}>
    <div class="flex flex-col">
      <div class="flex flex-row items-end">
        {#if scannerActive}
          <div class="flex flex-col">
            <label class="pb-0.5" for="identifier_input"
              >{$t("drinks.identifier")}</label
            >
            <input
              class="bg-light-p_bg text-black border-none rounded-lg dark:bg-dark-800 dark:text-white focus:outline-0"
              id="identifier_input"
              type="text"
              bind:value={identifier}
              bind:this={ref}
              on:input={handleInput}
            />
          </div>
        {:else}
          <div class="flex flex-col">
            <label class="pb-0.5 block" for="studentNumber_input"
              >{$t("drinks.studentNumber")}</label
            >
            <input
              class="bg-light-p_bg text-black rounded-lg border-none dark:bg-dark-800 dark:text-white focus:outline-0"
              id="studentNumber_input"
              type="text"
              bind:value={userName}
              bind:this={ref}
            />
          </div>
        {/if}
        <button
          class="dark:bg-dark-p_foreground bg-light-p_foreground rounded-full text-white ml-2 px-4 py-2"
          type="submit"
        >
          {$t("drinks.submit")}
        </button>
        {#if errorMessage}
          <p class="text-red-400 px-4">{errorMessage}</p>
        {/if}
      </div>
      <label class="pb-0.5" for="email_input">{$t("drinks.email")}</label>
      <input
        disabled
        class="bg-light-p_bg text-black rounded-lg border-none dark:bg-dark-800 dark:text-white focus:outline-0 text-opacity-30 dark:text-opacity-30 max-w-72"
        id="email_input"
        type="text"
        bind:value={autoEmail}
      />
    </div>
  </form>
</div>
