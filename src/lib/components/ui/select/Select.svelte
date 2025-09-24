<script lang="ts">
    import type { HTMLSelectAttributes } from "svelte/elements";

    type SelectProps = Omit<HTMLSelectAttributes, "size"> & {
        options?: Array<{ value: string; label: string }>;
        value?: string;
        placeholder?: string;
        disabled?: boolean;
        bordered?: boolean;
        ghost?: boolean;
        primary?: boolean;
        secondary?: boolean;
        accent?: boolean;
        info?: boolean;
        success?: boolean;
        warning?: boolean;
        error?: boolean;
        size?: "xs" | "sm" | "md" | "lg";
    };

    let {
        options = [],
        value = $bindable(),
        placeholder = "Select an option",
        disabled = false,
        bordered = true,
        ghost = false,
        primary = false,
        secondary = false,
        accent = false,
        info = false,
        success = false,
        warning = false,
        error = false,
        size = "md",
        ...restProps
    }: SelectProps = $props();

    let baseClasses = "select";
    let borderedClass = $derived(bordered ? "select-bordered" : "");
    let ghostClass = $derived(ghost ? "select-ghost" : "");
    let primaryClass = $derived(primary ? "select-primary" : "");
    let secondaryClass = $derived(secondary ? "select-secondary" : "");
    let accentClass = $derived(accent ? "select-accent" : "");
    let infoClass = $derived(info ? "select-info" : "");
    let successClass = $derived(success ? "select-success" : "");
    let warningClass = $derived(warning ? "select-warning" : "");
    let errorClass = $derived(error ? "select-error" : "");

    let sizeClass = $derived(
        size === "xs"
            ? "select-xs"
            : size === "sm"
              ? "select-sm"
              : size === "lg"
                ? "select-lg"
                : "",
    );

    let classes = $derived(
        `${baseClasses} ${borderedClass} ${ghostClass} ${primaryClass} ${secondaryClass} ${accentClass} ${infoClass} ${successClass} ${warningClass} ${errorClass} ${sizeClass}`,
    );
</script>

<select class={classes} {value} {disabled} {...restProps}>
    {#if placeholder}
        <option value="" disabled selected>{placeholder}</option>
    {/if}
    {#each options as option}
        <option value={option.value}>{option.label}</option>
    {/each}
</select>
