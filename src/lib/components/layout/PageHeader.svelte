<script lang="ts">
    import type { Snippet } from "svelte";

    let {
        title,
        subtitle = undefined,
        actions = undefined,
    }: {
        title: string;
        subtitle?: string;
        actions?: Snippet;
    } = $props();
</script>

<div class="flex justify-between items-start mb-4">
    <div>
        <h1 class="text-2xl font-bold">{title}</h1>
        {#if subtitle}
            <p class="text-base-content/70">{subtitle}</p>
        {/if}
    </div>
    {#if actions}
        <div class="flex items-center gap-2">
            {@render actions()}
        </div>
    {/if}
</div>
