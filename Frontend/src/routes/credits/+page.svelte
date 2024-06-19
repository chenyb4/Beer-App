<script>
  import { t } from "$lib/translations/index.js";
  import CtaButton from "$lib/components/CtaButton.svelte";
  import PriceTitle from "$lib/components/PriceTitle.svelte";
  import { addCreditsForAUser } from "$lib/service/credits.js";
  import StudentIdentifier from "$lib/components/StudentIdentifier.svelte";
  import { onMount } from "svelte";

  // Create reactive variables
  let identifier = "";
  let userName = "";
  let identifiedUser = {};
  let amountOfCredits = 0;
  let price = 0;
  let ref;

  // Initialize these values based on fetched data
  let creditIncrement = amountOfCredits;
  let priceIncrement = price;

  /** @type {import('./$types').PageData} */
  export let data;
  let defaultCreditsInitial = data.defaultCredits || 10;

  //re-assign when there is data from the server for these values
  amountOfCredits = defaultCreditsInitial.default_amount;
  price = defaultCreditsInitial.price;

  creditIncrement = defaultCreditsInitial.default_amount;
  priceIncrement = defaultCreditsInitial.price;

  // Functions to handle increment and decrement
  function incrementCredits() {
    amountOfCredits += creditIncrement;
    price += priceIncrement;
  }

  function decrementCredits() {
    if (amountOfCredits > creditIncrement) {
      amountOfCredits -= creditIncrement;
      price -= priceIncrement;
    }
  }

  async function updateCreditsForAUser() {
    try {
      await addCreditsForAUser(identifiedUser.id, amountOfCredits);
      alert("Action was successful");
    } catch (error) {
      alert("An error occurred while updating credits");
    }
  }

  function onConfirmButtonClick() {
    if (!identifier.trim()) {
      alert("Identifier is required.");
      return;
    }
    if (window.confirm("Are you sure you want to update the credits?")) {
      updateCreditsForAUser();
      clearFields();
    }
  }

  function clearFields() {
    identifier = "";
    identifiedUser = "";
    userName = "";
  }

  onMount(() => {
    ref.focus();
  });
</script>

<div
  class="m-4 w-full overflow-auto p-5 bg-light-s_bg dark:bg-dark-s_bg rounded-2xl"
>
  <form>
    <h2 class="text-4xl font-extrabold mb-8">{$t("credits.title")}</h2>
    <StudentIdentifier
      bind:identifiedUser
      bind:identifier
      bind:userName
      bind:ref
    ></StudentIdentifier>
    <!-- for the student number field -->

    <!-- for the balance field -->
    <label
      for="quantity-input"
      class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
    >
      {$t("credits.amountOfCredits")}
    </label>
    <div class="relative flex items-center max-w-[8rem]">
      <button
        type="button"
        id="decrement-button"
        on:click={decrementCredits}
        class="bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-gray-600 hover:bg-gray-200 border border-gray-300 rounded-s-lg p-3 h-11 focus:ring-gray-100 dark:focus:ring-gray-700 focus:ring-2 focus:outline-none"
      >
        <svg
          class="w-3 h-3 text-gray-900 dark:text-white"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 18 2"
        >
          <path
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M1 1h16"
          />
        </svg>
      </button>
      <input
        type="text"
        id="quantity-input"
        bind:value={amountOfCredits}
        aria-describedby="helper-text-explanation"
        class="bg-gray-50 border-x-0 border-gray-300 h-11 text-center text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 block w-full py-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        placeholder="999"
        required
      />
      <button
        type="button"
        id="increment-button"
        on:click={incrementCredits}
        class="bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-gray-600 hover:bg-gray-200 border border-gray-300 rounded-e-lg p-3 h-11 focus:ring-gray-100 dark:focus:ring-gray-700 focus:ring-2 focus:outline-none"
      >
        <svg
          class="w-3 h-3 text-gray-900 dark:text-white"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 18 18"
        >
          <path
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 1v16M1 9h16"
          />
        </svg>
      </button>
    </div>

    <PriceTitle captionText={$t("credits.price")} {price}></PriceTitle>

    <CtaButton
      captionText={$t("credits.confirm")}
      onCTAButtonClickFn={onConfirmButtonClick}
    ></CtaButton>
  </form>
</div>
