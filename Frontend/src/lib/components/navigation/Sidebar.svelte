<script>
  import {
    Sidebar,
    SidebarWrapper,
    SidebarGroup,
    SidebarBrand,
    DarkMode,
  } from "flowbite-svelte";
  import NavBarOption from "$lib/components/navigation/NavBarOption.svelte";
  import { page } from "$app/stores";
  import img from "$lib/images/ada-logo.png";
  import { locale, locales, t } from "$lib/translations/index.js";

  let site = {
    name: "",
    href: "/",
    img: img,
  };

  const handleChange = ({ currentTarget }) => {
    const { value } = currentTarget;

    document.cookie = `lang=${value} ;`;
  };

  $: activeUrl = $page.url.pathname;

  let activeClass =
    "flex items-center p-2 text-light-text dark:text-dark-text bg-light-p_bg dark:bg-dark-p_bg ";
  let nonActiveClass =
    "flex items-center p-2 text-light-text dark:text-dark-text bg-light-s_bg dark:bg-dark-s_bg ";
</script>

{#if activeUrl !== "/login"}
  <Sidebar
    {activeUrl}
    {activeClass}
    {nonActiveClass}
    asideClass="min-w-64 flex flex-col border-r-2 border-dark-p_foreground"
  >
    <SidebarWrapper divClass="bg-light-s_bg dark:bg-dark-s_bg h-full">
      <SidebarGroup>
        <SidebarBrand {site} imgClass="h-7 mt-5 m-1 ml-0 sm:h-7" />
        <NavBarOption title="Home" site="/" />
        <NavBarOption title={$t("homepage.credits.title")} site="/credits" />
        <NavBarOption title={$t("homepage.drinks.title")} site="/drinks" />
        <NavBarOption
          title={$t("homepage.inventory_management.title")}
          site="/inventory_management"
        />
        <NavBarOption
          title={$t("homepage.administration.title")}
          site="/administration"
        />
        <NavBarOption
          title={$t("homepage.transaction_history.title")}
          site="/transaction_history"
        />
        <NavBarOption
          title={$t("homepage.inventory_history.title")}
          site="/inventory_history"
        />
        <div class="bottom-0 absolute">
          <DarkMode />
          <select bind:value={$locale} on:change={handleChange}>
            {#each $locales as value}
              <option {value} selected={$locale === value}
                >{$t(`lang.${value}`)}</option
              >
            {/each}
          </select>
        </div>
      </SidebarGroup>
    </SidebarWrapper>
  </Sidebar>
{/if}
