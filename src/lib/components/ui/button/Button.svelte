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
        | "active"
        | "disabled";
    type ButtonSize = "xs" | "sm" | "md" | "lg" | "xl";

    type ButtonProps = HTMLButtonAttributes & {
        variant?: ButtonVariant;
        size?: ButtonSize;
        disabled?: boolean;
        block?: boolean;
        square?: boolean;
        circle?: boolean;
        wide?: boolean;
    };

    let {
        variant = "primary",
        size = "md",
        disabled = false,
        type = "button",
        block = false,
        square = false,
        circle = false,
        wide = false,
        children,
        ...restProps
    }: ButtonProps & { children: Snippet } = $props();

    let baseClasses = "btn";
    let variantClasses = $derived(
        variant === "primary"
            ? "btn-primary"
            : variant === "secondary"
              ? "btn-secondary"
              : variant === "accent"
                ? "btn-accent"
                : variant === "info"
                  ? "btn-info"
                  : variant === "success"
                    ? "btn-success"
                    : variant === "warning"
                      ? "btn-warning"
                      : variant === "error"
                        ? "btn-error"
                        : variant === "ghost"
                          ? "btn-ghost"
                          : variant === "link"
                            ? "btn-link"
                            : variant === "outline"
                              ? "btn-outline"
                              : variant === "active"
                                ? "btn-active"
                                : variant === "disabled"
                                  ? "btn-disabled"
                                  : "btn-primary",
    );

    let sizeClasses = $derived(
        size === "xs"
            ? "btn-xs"
            : size === "sm"
              ? "btn-sm"
              : size === "lg"
                ? "btn-lg"
                : size === "xl"
                  ? "btn-xl"
                  : "btn-md",
    );

    let blockClass = $derived(block ? "btn-block" : "");
    let squareClass = $derived(square ? "btn-square" : "");
    let circleClass = $derived(circle ? "btn-circle" : "");
    let wideClass = $derived(wide ? "btn-wide" : "");

    let classes = $derived(
        `${baseClasses} ${variantClasses} ${sizeClasses} ${blockClass} ${squareClass} ${circleClass} ${wideClass}`,
    );
</script>

<button class={classes} {type} {disabled} {...restProps}>
    {@render children()}
</button>
