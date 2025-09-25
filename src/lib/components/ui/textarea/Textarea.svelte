<script lang="ts">
    import type { HTMLTextareaAttributes } from "svelte/elements";

    type TextareaProps = Omit<HTMLTextareaAttributes, "size"> & {
        placeholder?: string;
        value?: string;
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
        rows?: number;
    };

    let {
        placeholder = "",
        value = $bindable(),
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
        rows = 3,
        ...restProps
    }: TextareaProps = $props();

    let baseClasses = "textarea";

    let borderedClass = $derived(bordered ? "textarea-bordered" : "");
    let ghostClass = $derived(ghost ? "textarea-ghost" : "");
    let primaryClass = $derived(primary ? "textarea-primary" : "");
    let secondaryClass = $derived(secondary ? "textarea-secondary" : "");
    let accentClass = $derived(accent ? "textarea-accent" : "");
    let infoClass = $derived(info ? "textarea-info" : "");
    let successClass = $derived(success ? "textarea-success" : "");
    let warningClass = $derived(warning ? "textarea-warning" : "");
    let errorClass = $derived(error ? "textarea-error" : "");

    let classes = $derived(
        `${baseClasses} ${borderedClass} ${ghostClass} ${primaryClass} ${secondaryClass} ${accentClass} ${infoClass} ${successClass} ${warningClass} ${errorClass}`,
    );
</script>

<textarea class={classes} {placeholder} {value} {disabled} {rows} {...restProps}
></textarea>
