<script lang="ts">
    import PageHeader from "$lib/components/layout/PageHeader.svelte";
    import { Button } from "$lib/components/ui";
    import { Plus } from "lucide-svelte";
</script>

<PageHeader title="Dashboard" subtitle="Welcome back! Here's a summary of your activity.">
    {#snippet actions()}
        <Button onclick={() => alert('Add new item')} class="btn-primary">
            <Plus class="h-4 w-4" />
            Add New
        </Button>
    {/snippet}
</PageHeader>

