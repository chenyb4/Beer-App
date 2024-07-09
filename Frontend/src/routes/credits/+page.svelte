<script>
  // Import necessary components and functions
  import { t } from "$lib/translations/index.js";
  import PriceTitle from "$lib/components/PriceTitle.svelte";
  import { addCreditsForAUser } from "$lib/service/credits.js";
  import StudentIdentifier from "$lib/components/StudentIdentifier.svelte";
  import { onMount } from "svelte";
  import { Button, Modal } from "flowbite-svelte";

  // Initialize variables for the form
  let identifier = "";
  let userName = "";
  let identifiedUser = {};
  let amountOfCredits = 0;
  let price = 0;
  let ref;
  let defaultCreditsAndPriceReceived = false;
  let creditIncrement = amountOfCredits;
  let priceIncrement = price;
  let scannerActive;

  // Exported data from the parent component
  export let data;

  // Initial default credit values
  let defaultCreditsInitial = {};

  // Check if default credits are provided in the data
  if (data.defaultCredits != null) {
    defaultCreditsAndPriceReceived = true;
    defaultCreditsInitial = data.defaultCredits;
  } else {
    defaultCreditsInitial.price = 0;
    defaultCreditsInitial.default_amount = 0;
  }

  // Set initial values for credits and price
  amountOfCredits = defaultCreditsInitial.default_amount;
  price = defaultCreditsInitial.price;
  creditIncrement = defaultCreditsInitial.default_amount;
  priceIncrement = defaultCreditsInitial.price;

  // Function to increment credits and price
  function incrementCredits() {
    amountOfCredits += creditIncrement;
    price += priceIncrement;
  }

  // Function to decrement credits and price
  function decrementCredits() {
    if (amountOfCredits > creditIncrement) {
      amountOfCredits -= creditIncrement;
      price -= priceIncrement;
    }
  }

  // Function to update credits for a user
  async function updateCreditsForAUser() {
    // Play sound effect
    let addCreditsSound = new Audio("sound-effects/creditbought_sound.mp3");
    addCreditsSound.volume = 0.3;
    addCreditsSound.play();

    try {
      // Call API to add credits for the user
      await addCreditsForAUser(identifiedUser.id, amountOfCredits);
    } catch (error) {
      alert("An error occurred while updating credits");
    }

    // Clear input fields and close the modal
    clearFields();
    showBuyCreditModal = false;
  }

  // Function to show the confirmation modal
  function onConfirmButtonClick() {
    if (scannerActive) {
      if (!identifier.trim()) {
        alert("Identifier is required.");
        return;
      }
    } else {
      if (!userName.trim()) {
        alert("Username is required.");
        return;
      }
    }
    showBuyCreditModal = true;
  }

  // Function to clear input fields
  function clearFields() {
    identifier = "";
    identifiedUser = {};
  }

  // Set focus on the input field when the component is mounted
  onMount(() => {
    ref.focus();
  });

  // Boolean to control the visibility of the modal
  let showBuyCreditModal = false;
</script>

<div
  class="m-4 w-full flex flex-col p-5 bg-light-s_bg dark:bg-dark-s_bg rounded-2xl h-[85%]"
>
  {#if showBuyCreditModal}
    <Modal
      title={"Buy credit for " + identifiedUser.username}
      bind:open={showBuyCreditModal}
      autoclose={false}
    >
      Has user {identifiedUser.username} payed?
      <svelte:fragment slot="footer">
        <Button on:click={updateCreditsForAUser}>Yes</Button>
        <Button color="alternative">Cancel</Button>
      </svelte:fragment>
    </Modal>
  {/if}
  <h2 class="text-3xl font-bold mb-8">{$t("credits.title")}</h2>
  <div class="flex-1">
    <div class="flex flex-row justify-between">
      <StudentIdentifier
        bind:identifiedUser
        bind:identifier
        bind:ref
        bind:scannerActive
        bind:userName
      ></StudentIdentifier>
      <PriceTitle captionText={$t("credits.price")} {price}></PriceTitle>
    </div>
    <label
      for="quantity-input"
      class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
    >
      {$t("credits.amountOfCredits")}
    </label>

    {#if !defaultCreditsAndPriceReceived}
      <p style="color: red">{$t("credits.warning")}</p>
    {/if}

    <div class="flex items-center max-w-[8rem]">
      <button
        type="button"
        id="decrement-button"
        on:click={decrementCredits}
        class="bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-gray-600 hover:bg-gray-200 border border-gray-300 rounded-s-lg p-3 h-11 flex justify-center items-center focus:ring-gray-100 dark:focus:ring-gray-700 focus:ring-2 focus:outline-none"
      >
        <span>-</span>
      </button>
      <input
        type="text"
        id="quantity-input"
        bind:value={amountOfCredits}
        aria-describedby="helper-text-explanation"
        class="bg-gray-50 border-x-0 border-gray-300 h-11 text-center text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 block w-full py-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        required
      />
      <button
        type="button"
        id="increment-button"
        on:click={incrementCredits}
        class="bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-gray-600 hover:bg-gray-200 border border-gray-300 rounded-e-lg p-3 h-11 flex justify-center items-center focus:ring-gray-100 dark:focus:ring-gray-700 focus:ring-2 focus:outline-none"
      >
        +
      </button>
    </div>
  </div>

  <Button
    class="bg-light-p_foreground dark:bg-dark-p_foreground rounded-xl"
    on:click={onConfirmButtonClick}
  >
    SUBMIT
  </Button>
</div>
