<script>
  export let captionText;
  export let price;
</script>

<div
  class="block w-60 p-5 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
>
  <p class="font-normal text-gray-700 dark:text-gray-400 text-2xl">
    {captionText}:
  </p>
  <h5
    class="mb-2 text-4xl font-bold tracking-tight text-gray-900 dark:text-white"
  >
    €{price}
  </h5>
</div>
