<script lang="ts">
    import type { HTMLLabelAttributes } from "svelte/elements";
    import type { Snippet } from "svelte";

    type LabelProps = Omit<HTMLLabelAttributes, "for"> & {
        for?: string;
        required?: boolean;
        variant?:
            | "primary"
            | "secondary"
            | "accent"
            | "info"
            | "success"
            | "warning"
            | "error";
    };

    let {
        for: htmlFor,
        required = false,
        variant,
        children,
        ...restProps
    }: LabelProps & { children: Snippet } = $props();

    let baseClasses = "label";

    let variantClasses = $derived(
        variant === "primary"
            ? "text-primary"
            : variant === "secondary"
              ? "text-secondary"
              : variant === "accent"
                ? "text-accent"
                : variant === "info"
                  ? "text-info"
                  : variant === "success"
                    ? "text-success"
                    : variant === "warning"
                      ? "text-warning"
                      : variant === "error"
                        ? "text-error"
                        : "",
    );

    let classes = $derived(`${baseClasses} ${variantClasses}`);
</script>

<label class={classes} for={htmlFor} {...restProps}>
    <span class="label-text">
        {@render children()}
        {#if required}
            <span class="text-error">*</span>
        {/if}
    </span>
</label>
