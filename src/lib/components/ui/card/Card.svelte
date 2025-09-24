<script lang="ts">
    import type { Snippet } from "svelte";

    let {
        children,
        title,
        actions,
        figure,
    }: {
        children: Snippet;
        title?: Snippet;
        actions?: Snippet;
        figure?: Snippet;
    } = $props();

    let hasHeader = $derived(title !== undefined);
    let hasActions = $derived(actions !== undefined);
    let hasFigure = $derived(figure !== undefined);
</script>

<div class="card bg-base-100 shadow-xl">
    {#if hasFigure}
        <figure class="px-10 pt-10">
            {@render figure?.()}
        </figure>
    {/if}
    <div class="card-body">
        {#if hasHeader}
            <h2 class="card-title">
                {@render title?.()}
            </h2>
        {/if}
        {@render children()}
        {#if hasActions}
            <div class="card-actions justify-end">
                {@render actions?.()}
            </div>
        {/if}
    </div>
</div>
