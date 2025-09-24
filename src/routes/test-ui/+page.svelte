<script lang="ts">
    import { Button, Input, Select } from "$lib/components/ui";

    let inputValue = $state("");
    let selectValue = $state("");

    let selectOptions = [
        { value: "option1", label: "Option 1" },
        { value: "option2", label: "Option 2" },
        { value: "option3", label: "Option 3" },
    ];

    function handleClick() {
        alert("Button clicked!");
    }
</script>

<div class="p-4 space-y-4">
    <h1 class="text-2xl font-bold">UI Component Test Page</h1>

    <div class="space-y-4">
        <h2 class="text-xl font-semibold">Buttons</h2>
        <div class="flex flex-wrap gap-2">
            <Button onclick={handleClick}>Primary</Button>
            <Button variant="secondary" onclick={handleClick}>Secondary</Button>
        </div>
    </div>

    <div class="space-y-4">
        <h2 class="text-xl font-semibold">Inputs</h2>
        <div class="flex flex-wrap gap-4">
            <Input placeholder="Default input" bind:value={inputValue} />
        </div>
    </div>

    <div class="space-y-4">
        <h2 class="text-xl font-semibold">Selects</h2>
        <div class="flex flex-wrap gap-4">
            <Select
                placeholder="Default select"
                options={selectOptions}
                bind:value={selectValue}
            />
        </div>
    </div>
</div>
