<script>
    import {Card, DarkMode} from "flowbite-svelte";

    import { t, locale, locales } from '$lib/translations';
    import ClickableCard from "$lib/components/cards/ClickableCard.svelte";

    import {WalletSolid} from 'flowbite-svelte-icons';
</script>
<ClickableCard path="credits" icon="{WalletSolid}" />