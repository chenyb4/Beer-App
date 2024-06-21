<script>
  import { getUsers } from "$lib/service/administration";

  // @ts-nocheck

  import { getUserByQRIdentifier } from "$lib/service/users";
  import { t } from "$lib/translations/index.js";

  export let identifier = "";
  export let userName = "";
  export let autoUserName = "";
  export let ref;
  export let identifiedUser;
  export let scannerActive = false;
  let errorMessage = "";
  let users = {};

  async function handleSubmit(event) {
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
      autoUserName = identifiedUser.email;
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
        autoUserName = identifiedUser.email;
      } else {
        handleError();
      }
    } catch (error) {
      handleError();
    }
  }

  function handleError() {
    errorMessage = $t("drinks.errorMessage");
    autoUserName = "";
  }

  function handleInput(event) {
    if (identifier.length > 59) {
      handleSubmit(event);
    }
  }
</script>

<form on:submit={handleSubmit}>
  <div class="flex flex-col">
    <label class="pb-0.5" for="identifier_input"
      >{$t("drinks.identifier")}</label
    >
    <div class="flex flex-row items-center">
      {#if scannerActive}
        <input
          class="bg-light-p_bg text-black rounded-lg border-none dark:bg-dark-800 dark:text-white focus:outline-0"
          id="identifier_input"
          type="text"
          bind:value={identifier}
          bind:this={ref}
          on:input={handleInput}
        />
      {:else}
        <input
          class="bg-light-p_bg text-black rounded-lg border-none dark:bg-dark-800 dark:text-white focus:outline-0"
          id="identifier_input"
          type="text"
          bind:value={userName}
          bind:this={ref}
        />
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
    <label class="pb-0.5" for="studentNumber_input">{$t("drinks.email")}</label>
    <input
      disabled
      class="bg-light-p_bg text-black rounded-lg border-none dark:bg-dark-800 dark:text-white focus:outline-0 text-opacity-30 dark:text-opacity-30 max-w-72"
      id="studentNumber_input"
      type="text"
      bind:value={autoUserName}
    />
  </div>
</form>
