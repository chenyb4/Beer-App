<script>
    export let label = "";
    export let value = "";
    export let id = "";
    export let type = "text";

    function handleInput(event) {
        // Convert value to the appropriate type based on the input type
        if (type === "number") {
            value = +event.target.value; // Convert to number
        } else {
            value = event.target.value;
        }

        // Dispatch an event to notify the parent component of the change
        const inputEvent = new CustomEvent("input", {
            detail: { value },
        });
        dispatchEvent(inputEvent);
    }
</script>

<div>
    <label class="" for={id}>{label}</label>
    <input {id} {type} {value} on:input={handleInput} />
</div>
