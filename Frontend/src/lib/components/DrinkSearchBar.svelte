<script>
    // @ts-nocheck

    import { t } from "$lib/translations/index.js";
    import { onMount } from "svelte";

    export let filteredProductsOptions = [];
    export let value = "";
    export let selectedProduct;

    let products;
    let errorMessage = "";

    let env = import.meta.env;

    function showProductOptions() {
        document.getElementById("productOptions").style.display = "block";
    }

    async function loadProducts() {
        try {
            const response = await fetch(
                "http://" +
                    env.VITE_APIURL +
                    ":" +
                    env.VITE_APIPORT +
                    "/products",
            );

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            products = await response.json();
            console.log(products);
            errorMessage = "";
        } catch (error) {
            console.error("Failed to fetch user data:", error);
            errorMessage = "Failed to fetch user data. Please try again later.";
        }
    }

    function filterProductOptions() {
        filteredProductsOptions = products.filter(
            (product) =>
                product.name.toLowerCase().match(value.toLowerCase()) ||
                product.EAN.match(value),
        );
        if (value === "") {
            filteredProductsOptions = [];
        }
    }

    function selectProduct(product) {
        selectedProduct = product;
        value = product.name;
        document.getElementById("productOptions").style.display = "none";
    }

    function selectProductWithEnter(event) {
        if (event.key === "Enter") {
            if (filteredProductsOptions.length > 0) {
                selectProduct(filteredProductsOptions[0]);
            }
        }
    }

    onMount(() => {
        loadProducts();
    });
</script>

<div id="searchBar" class="flex flex-col">
    <label class="pb-0.5" for="inputSearchBar"
        >{$t("drinks.drinkScanner")}</label
    >
    <input
        class="dark:bg-dark-800 border-none rounded-lg"
        type="text"
        id="inputSearchBar"
        bind:value
        on:focus={showProductOptions}
        on:input={filterProductOptions}
        on:keydown={selectProductWithEnter}
    />
    <div id="productOptions" class="block">
        {#each filteredProductsOptions as product}
            <button
                class="border border-dark-300 w-full"
                on:click={selectProduct(product)}>{product.name}</button
            >
        {/each}
    </div>
</div>
