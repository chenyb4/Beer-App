<script>
import {t} from "$lib/translations/index.js";

export let credits; //this prop need to be passed from the parent component which is the page to buy credits


//todo: this is the placeholder price. Should make a call to the backend to get the default price
//todo: when the backend api is made available
let defaultPrice=10;
let defaultCredits=11


</script>





<div class="mt-9 block w-40 p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
    <p class="font-normal text-gray-700 dark:text-gray-400">{$t('credits.price')}:</p>
    <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">€{(credits/defaultCredits)*defaultPrice}</h5>
</div>




