<script lang="ts">
    import type { HTMLAttributes } from "svelte/elements";
    import type { Snippet } from "svelte";

    type SeparatorProps = HTMLAttributes<HTMLDivElement> & {
        orientation?: "horizontal" | "vertical";
        decorative?: boolean;
        children?: Snippet;
    };

    let {
        orientation = "horizontal",
        decorative = false,
        children,
        ...restProps
    }: SeparatorProps = $props();

    let baseClasses = "divider";

    let orientationClasses = $derived(
        orientation === "vertical" ? "divider-vertical" : "",
    );

    let classes = $derived(`${baseClasses} ${orientationClasses}`);
</script>

{#if orientation === "horizontal"}
    <div class={classes} {...restProps}>
        {#if children}
            {@render children()}
        {/if}
    </div>
{:else}
    <div class={classes} {...restProps}></div>
{/if}
