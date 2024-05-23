<script>
    import {Card, DarkMode} from "flowbite-svelte";

    import { t, locale, locales } from '$lib/translations';
    import Sidebar from "$lib/components/navigation/Sidebar.svelte";

    const handleChange = ({ currentTarget }) => {
        const { value } = currentTarget;

        document.cookie = `lang=${value} ;`;
    };
</script>

<Sidebar>

</Sidebar>

<Card href="/cards">
    <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Flowbite works!</h5>
    <p class="font-normal text-gray-700 dark:text-gray-400 leading-tight">When this is a card...</p>
</Card>

Check darkmode:
<DarkMode/>
<br>
<select bind:value="{$locale}" on:change={handleChange}>
    {#each $locales as value}
        <option value="{value}" selected="{$locale === value}">{$t(`lang.${value}`)}</option>
    {/each}
</select>

<div>
    <!-- you can use `placeholders` and `modifiers` in your definitions (see docs) -->
    <h2>{$t('homepage.title')}</h2>
    <p>{$t('homepage.text')}</p>
</div>