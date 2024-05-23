<script>
    import {Sidebar, SidebarWrapper, SidebarGroup, SidebarBrand, Footer, DarkMode} from "flowbite-svelte";
    import NavBarOption from "$lib/components/navigation/NavBarOption.svelte";
    import {page} from "$app/stores";
    import img from "$lib/images/ada-logo.png";
    import {locale, locales, t} from "$lib/translations/index.js";

    let site = {
        name: '',
        href: '/',
        img: img
    };

    const handleChange = ({ currentTarget }) => {
        const { value } = currentTarget;

        document.cookie = `lang=${value} ;`;
    };

    $: activeUrl = $page.url.pathname;

    let activeClass = 'flex items-center p-2 text-light-text dark:text-dark-text bg-light-p_bg dark:bg-dark-p_bg ';
    let nonActiveClass = 'flex items-center p-2 text-light-text dark:text-dark-text bg-light-s_bg dark:bg-dark-s_bg ';
</script>

<Sidebar {activeUrl} {activeClass} {nonActiveClass} asideClass="flex h-screen w-1/5">
    <SidebarWrapper divClass="bg-light-s_bg dark:bg-dark-s_bg h-full">
        <SidebarGroup>
            <SidebarBrand {site} imgClass="h-7 mt-5 m-1 ml-0 sm:h-7"/>
            <NavBarOption title="Home" site="/" />
            <NavBarOption title="Add credits to balance" site="/credits"/>
            <NavBarOption title="Sell drinks" site="/drinks"/>
            <NavBarOption title="Inventory management" site="/inventory_management"/>
            <NavBarOption title="Student Administration" site="/administration" />
            <NavBarOption title="Transaction history" site="/transactions_history"/>
            <NavBarOption title="Inventory history" site="/inventory_history"/>
            <div class="bottom-0 absolute">
                <DarkMode/>
                <select bind:value="{$locale}" on:change={handleChange}>
                    {#each $locales as value}
                        <option value="{value}" selected="{$locale === value}">{$t(`lang.${value}`)}</option>
                    {/each}
                </select>
            </div>
        </SidebarGroup>
    </SidebarWrapper>
</Sidebar>