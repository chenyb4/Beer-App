<script>

import {Button, ButtonGroup, Dropdown, DropdownItem} from "flowbite-svelte";
import {DotsVerticalOutline} from "flowbite-svelte-icons";

export let buttonText = "";
export let dropDownText = "";

export let handleButton = function(){}
export let handleDropDownButton = function(){}
</script>

<ButtonGroup
        class="text-dark-text bg-light-p_foreground dark:bg-dark-p_foreground rounded-full"
>
    <Button
            class="bg-light-p_foreground dark:bg-dark-p_foreground text-white"
            on:click={handleButton}
    >
        {buttonText}
    </Button>
    <Button
            class="bg-light-p_foreground dark:bg-dark-p_foreground p-1 text-white"
    >
        <DotsVerticalOutline class="dots-menu" />
    </Button>
    <Dropdown placement="top" triggeredBy=".dots-menu" class="w-32">
        <DropdownItem on:click={handleDropDownButton} class="text-center"
        >{dropDownText}</DropdownItem
        >
    </Dropdown>
</ButtonGroup>
