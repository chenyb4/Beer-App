<script>
  import "../app.css";
  import Sidebar from "$lib/components/navigation/Sidebar.svelte";
  import { locale } from "$lib/translations/index.js";
  $: $locale;
  export let data;

</script>

<!-- Import fonts -->
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" />
<link href="https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,100;0,300;0,400;0,700;0,900;1,100;1,300;1,400;1,700;1,900&display=swap" rel="stylesheet"/>

<div class="h-screen flex">
  <!--  Implement Sidebar on every page. Parameters for username and roleName-->
  <Sidebar username={data.user?.username || "user"} roleName={data.user?.roleName || ""}/>
  <!-- Content of each page -->
  <slot></slot>
</div>