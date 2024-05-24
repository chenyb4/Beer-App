<script>
    import InputField from "$lib/components/InputField.svelte";
    import { t } from "$lib/translations/index.js";

    let identifier = "";

    $: identifier, console.log(identifier);
</script>

<div>
    <h2>{$t("drinks.title")}</h2>
    <p>{$t("drinks.text")}</p>
    <InputField
        label="Identifier"
        id="identifier_input"
        type="number"
        bind:value={identifier}
    ></InputField>
</div>
