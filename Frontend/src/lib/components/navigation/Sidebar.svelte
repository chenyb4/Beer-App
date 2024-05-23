<script>
    import {Sidebar, SidebarItem, SidebarWrapper, SidebarGroup, SidebarBrand} from "flowbite-svelte";
    import NavBarOption from "$lib/components/navigation/NavBarOption.svelte";

    let site = {
        name: 'Flowbite-Svelte',
        href: '/',
        img: '/images/flowbite-svelte-icon-logo.svg'
    };
</script>

<Sidebar>
    <SidebarWrapper>
        <SidebarGroup>
            <SidebarBrand {site} />
            <NavBarOption title="Home" site="./"/>
            <NavBarOption title="Add credits to balance" site="./credits"/>
            <NavBarOption title="Sell drinks" site="./drinks"/>
            <NavBarOption title="Inventory management" site="./inventory"/>
            <NavBarOption title="Student Administration" site="./administration"/>
            <NavBarOption title="Transaction history" site="./transactions"/>
            <NavBarOption title="Inventory history" site="./inventory_history"/>
        </SidebarGroup>
    </SidebarWrapper>
</Sidebar>