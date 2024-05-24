<script>
    import { t } from "$lib/translations/index.js";

    // Create reactive variables
    let studentNumber = '';


    //todo: initial amount of credits and price should be fetched from backend
    let amountOfCredits = 11;
    let price = 10;


    //todo:these two values need to be fetched from the backend
    let creditIncrement=11;
    let priceIncrement=10;


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

    // todo: Function to handle barcode scanning button being clicked
    function handleIconClick() {
        alert('barcode icon clicked!');
    }
</script>

<div>
    <!-- You can use `placeholders` and `modifiers` in your definitions (see docs) -->

    <form class="lg:max-w-7xl mx-auto mt-10 bg-light-s_bg dark:bg-dark-s_bg p-12 rounded-lg">
        <h2 class="text-4xl font-extrabold dark:text-white mb-8">{$t('credits.title')}</h2>

        <!-- for the student number field -->
        <div class="mb-5 relative">
            <label for="student-number" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                {$t('credits.studentNumber')}
            </label>
            <input
                    type="text"
                    id="student-number"
                    bind:value={studentNumber}
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 pr-10 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    required
            />
            <img
                    src="https://static-00.iconduck.com/assets.00/barcode-icon-512x432-m5ui6cos.png"
                    alt="Icon"
                    class="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                    on:click={handleIconClick()}
                    width="24"
                    height="24"
            />
        </div>

        <!-- for the balance field -->
        <label for="quantity-input" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            {$t('credits.amountOfCredits')}
        </label>
        <div class="relative flex items-center max-w-[8rem]">
            <button
                    type="button"
                    id="decrement-button"
                    on:click={decrementCredits}
                    class="bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-gray-600 hover:bg-gray-200 border border-gray-300 rounded-s-lg p-3 h-11 focus:ring-gray-100 dark:focus:ring-gray-700 focus:ring-2 focus:outline-none"
            >
                <svg class="w-3 h-3 text-gray-900 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 2">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 1h16"/>
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
                <svg class="w-3 h-3 text-gray-900 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 1v16M1 9h16"/>
                </svg>
            </button>
        </div>





        <div class="mt-9 block w-40 p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
            <p class="font-normal text-gray-700 dark:text-gray-400">{$t('credits.price')}:</p>
            <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">€{price}</h5>
        </div>

        <button
                type="submit"
                style="background-color: #009C82;"
                class="mt-12 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
            {$t('credits.confirm')}
        </button>
    </form>
</div>
