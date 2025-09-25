<script lang="ts">
    import type { HTMLInputAttributes } from "svelte/elements";

    type CheckboxProps = Omit<HTMLInputAttributes, "size"> & {
        checked?: boolean;
        disabled?: boolean;
        primary?: boolean;
        secondary?: boolean;
        accent?: boolean;
        success?: boolean;
        warning?: boolean;
        info?: boolean;
        error?: boolean;
    };

    let {
        checked = $bindable(),
        disabled = false,
        primary = false,
        secondary = false,
        accent = false,
        success = false,
        warning = false,
        info = false,
        error = false,
        ...restProps
    }: CheckboxProps = $props();

    let baseClasses = "checkbox";

    let primaryClass = $derived(primary ? "checkbox-primary" : "");
    let secondaryClass = $derived(secondary ? "checkbox-secondary" : "");
    let accentClass = $derived(accent ? "checkbox-accent" : "");
    let successClass = $derived(success ? "checkbox-success" : "");
    let warningClass = $derived(warning ? "checkbox-warning" : "");
    let infoClass = $derived(info ? "checkbox-info" : "");
    let errorClass = $derived(error ? "checkbox-error" : "");

    let classes = $derived(
        `${baseClasses} ${primaryClass} ${secondaryClass} ${accentClass} ${successClass} ${warningClass} ${infoClass} ${errorClass}`,
    );
</script>

<input type="checkbox" class={classes} {checked} {disabled} {...restProps} />
