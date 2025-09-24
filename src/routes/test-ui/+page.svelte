<script lang="ts">
    import { Button } from "$lib/components/ui";

    function handleClick() {
        alert("Button clicked!");
    }
</script>

<div class="p-4 space-y-4">
    <h1 class="text-2xl font-bold">UI Component Test Page</h1>

    <div class="space-x-2">
        <button class="btn btn-primary">One</button>
        <button class="btn btn-secondary">Two</button>
        <button class="btn btn-accent btn-outline">Three</button>
        <Button onclick={handleClick}>Primary Button</Button>
        <Button variant="secondary" onclick={handleClick}
            >Secondary Button</Button
        >
        <Button variant="danger" onclick={handleClick}>Delete Item</Button>
        <Button variant="outline" onclick={handleClick}>Learn More</Button>
        <Button disabled>Disabled Button</Button>
        <Button variant="primary" onclick={handleClick}>
            <span>With Icon</span>
            <svg
                class="h-5 w-5 ml-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                ><path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                ></path></svg
            >
        </Button>
    </div>
</div>
