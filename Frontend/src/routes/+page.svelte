<script>
    import {Card, DarkMode} from "flowbite-svelte";

    import { t, locale, locales } from '$lib/translations';


</script>

<div>
    <h2>{$t('homepage.title')}</h2>
    <p>{$t('homepage.text')}</p>
</div>