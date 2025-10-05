<script lang="ts">
    import type { Snippet } from "svelte";
    import type { HTMLAttributes } from "svelte/elements";
    
    interface CardProps {
        children: Snippet;
        title?: Snippet;
        actions?: Snippet;
        figure?: Snippet;
        class?: string;
        bordered?: boolean;
        compact?: boolean;
        hoverable?: boolean;
        [key: string]: any;
    }
    
    let {
        children,
        title,
        actions,
        figure,
        class: className = "",
        bordered = false,
        compact = false,
        hoverable = false,
        ...restProps
    }: CardProps = $props();
    
    let hasHeader = $derived(title !== undefined);
    let hasActions = $derived(actions !== undefined);
    let hasFigure = $derived(figure !== undefined);
    
    // Build dynamic classes
    let cardClasses = $derived(`
        card bg-base-100 shadow-xl
        ${bordered ? 'card-bordered' : ''}
        ${compact ? 'card-compact' : ''}
        ${hoverable ? 'hover:shadow-2xl transition-all duration-300' : ''}
        ${className}
    `.trim().replace(/\s+/g, ' '));
</script>

<div class={cardClasses} {...restProps}>
    {#if hasFigure}
        <figure class="px-10 pt-10">
            {@render figure?.()}
        </figure>
    {/if}
    <div class="card-body" class:p-4={compact}>
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
