<script>
    import {
        Sidebar,
        SidebarWrapper,
        SidebarGroup,
        SidebarBrand,
        DarkMode,
        Select, Button,
    } from "flowbite-svelte";
  import NavBarOption from "$lib/components/navigation/NavBarOption.svelte";
  import { page } from "$app/stores";
  import img from "$lib/images/ada-logo.png";
  import { locale, locales, t } from "$lib/translations/index.js";
  import {setCookie} from "$lib/service/authentication.js"
  import {goto} from "$app/navigation";
    import ProfileTag from "$lib/components/ProfileTag.svelte";

  export let username = "user";
  export let roleName = "";

  $: blur = "";
  $: if (roleName === "seller")
      blur = "blur";

  let site = {
    name: "",
    href: "/",
    img: img,
  };

  const handleChange = ({ currentTarget }) => {
    const { value } = currentTarget;

    document.cookie = `lang=${value} ;`;
  };



  function handleLogOut(){
    setCookie("authToken", "", -1)
    setCookie('username', "", -1);
    setCookie('roleName', "", -1)
    goto("/login?status=302")
  }

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
    asideClass="min-w-64 flex flex-col border-r-2 dark:border-dark-p_foreground border-light-p_foreground"
  >
    <SidebarWrapper divClass="bg-light-s_bg dark:bg-dark-s_bg h-full">
      <SidebarGroup>
        <SidebarBrand {site} imgClass="h-7 mt-5 m-1 ml-0 sm:h-7" />
        <NavBarOption title="Home" site="/" />
        <NavBarOption title={$t("homepage.credits.title")} site="/credits" blur={blur} />
        <NavBarOption title={$t("homepage.drinks.title")} site="/drinks" />
        <NavBarOption
          title={$t("homepage.inventory_management.title")}
          site="/inventory_management"
          blur={blur}
        />
        <NavBarOption
          title={$t("homepage.administration.title")}
          site="/administration"
          blur={blur}
        />
        <NavBarOption
          title={$t("homepage.transaction_history.title")}
          site="/transaction_history"
          blur={blur}
        />
        <NavBarOption
          title={$t("homepage.inventory_history.title")}
          site="/inventory_history"
          blur={blur}
        />
      </SidebarGroup>
        <SidebarGroup class="bottom-0 absolute">
            <ProfileTag username={username} roleName={roleName}/>
                <Button on:click={handleLogOut} class="flex flex-auto text-center m-auto items-center p-2 px-20 text-base font-normal border-2 border-white hover:bg-light-p_bg hover:dark:bg-dark-p_bg">
                    Log out
                </Button>
            <div class="flex items-center p-2 pr-5 w-full text-base font-normal">
                <DarkMode />
                <Select bind:value={$locale} on:change={handleChange} class="">
                    {#each $locales as value}
                        <option {value} selected={$locale === value}
                        >{$t(`lang.${value}`)}</option
                        >
                    {/each}
                </Select>
            </div>
        </SidebarGroup>
    </SidebarWrapper>
  </Sidebar>
{/if}
