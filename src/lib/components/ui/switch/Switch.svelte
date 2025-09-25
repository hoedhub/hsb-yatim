<script lang="ts">
    import type { HTMLInputAttributes } from "svelte/elements";

    type SwitchProps = Omit<HTMLInputAttributes, "size"> & {
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
    }: SwitchProps = $props();

    let baseClasses = "toggle";

    let primaryClass = $derived(primary ? "toggle-primary" : "");
    let secondaryClass = $derived(secondary ? "toggle-secondary" : "");
    let accentClass = $derived(accent ? "toggle-accent" : "");
    let successClass = $derived(success ? "toggle-success" : "");
    let warningClass = $derived(warning ? "toggle-warning" : "");
    let infoClass = $derived(info ? "toggle-info" : "");
    let errorClass = $derived(error ? "toggle-error" : "");

    let classes = $derived(
        `${baseClasses} ${primaryClass} ${secondaryClass} ${accentClass} ${successClass} ${warningClass} ${infoClass} ${errorClass}`,
    );
</script>

<input
    type="checkbox"
    class={classes}
    {checked}
    {disabled}
    {...restProps}
/>
