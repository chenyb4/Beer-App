<script>
    import {t} from "$lib/translations/index.js";
    import CtaButton from "$lib/components/CtaButton.svelte";
    import CreateStudent from "$lib/components/CreateStudent.svelte";

    let hideCreateUserDialog = true;
</script>

<body class="bg-dark-800 w-screen h-screen">
<div class="w-full h-full bg-dark-900 p-4 bg-clip-content">
    <CreateStudent hideCreateUserDialog={hideCreateUserDialog} />
    <div class="absolute bottom-12 right-12">
        <CtaButton
                captionText={$t("administration.addUser")}
                onCTAButtonClickFn={() => hideCreateUserDialog = false}
        />
    </div>

</div>
</body>