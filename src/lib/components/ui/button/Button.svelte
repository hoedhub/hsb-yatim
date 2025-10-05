<script lang="ts">
    import type { HTMLButtonAttributes } from "svelte/elements";
    import type { Snippet } from "svelte";

    type ButtonVariant =
        | "primary"
        | "secondary"
        | "accent"
        | "info"
        | "success"
        | "warning"
        | "error"
        | "ghost"
        | "link"
        | "outline"
        | "neutral";

    type ButtonSize = "xs" | "sm" | "md" | "lg";

    interface ButtonProps extends HTMLButtonAttributes {
        variant?: ButtonVariant;
        size?: ButtonSize;
        disabled?: boolean;
        loading?: boolean;
        block?: boolean;
        square?: boolean;
        circle?: boolean;
        wide?: boolean;
        glass?: boolean;
        noAnimation?: boolean;
        children: Snippet;
    }

    let {
        variant = "primary",
        size = "md",
        disabled = false,
        loading = false,
        type = "button",
        block = false,
        square = false,
        circle = false,
        wide = false,
        glass = false,
        noAnimation = false,
        class: className = "",
        children,
        ...restProps
    }: ButtonProps = $props();

    // Variant mapping using object lookup (more efficient than nested ternary)
    const variantMap: Record<ButtonVariant, string> = {
        primary: "btn-primary",
        secondary: "btn-secondary",
        accent: "btn-accent",
        info: "btn-info",
        success: "btn-success",
        warning: "btn-warning",
        error: "btn-error",
        ghost: "btn-ghost",
        link: "btn-link",
        outline: "btn-outline",
        neutral: "btn-neutral"
    };

    // Size mapping
    const sizeMap: Record<ButtonSize, string> = {
        xs: "btn-xs",
        sm: "btn-sm",
        md: "btn-md",
        lg: "btn-lg"
    };

    // Build classes efficiently
    let classes = $derived.by(() => {
        const classList = [
            "btn",
            variantMap[variant],
            sizeMap[size],
            block && "btn-block",
            square && "btn-square",
            circle && "btn-circle",
            wide && "btn-wide",
            glass && "glass",
            noAnimation && "no-animation",
            (disabled || loading) && "btn-disabled",
            className
        ];

        return classList.filter(Boolean).join(" ");
    });

    // Determine if button should be disabled
    let isDisabled = $derived(disabled || loading);
</script>

<button 
    class={classes} 
    {type} 
    disabled={isDisabled}
    aria-busy={loading}
    aria-disabled={isDisabled}
    {...restProps}
>
    {#if loading}
        <span class="loading loading-spinner loading-sm"></span>
    {/if}
    {@render children()}
</button>

<style>
    button {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
        transition: all 0.2s ease-in-out;
    }

    button:not(.no-animation):hover:not(:disabled) {
        transform: translateY(-1px);
    }

    button:not(.no-animation):active:not(:disabled) {
        transform: translateY(0);
    }

    button:disabled {
        cursor: not-allowed;
        opacity: 0.6;
    }
</style>
