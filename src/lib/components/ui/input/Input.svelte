<script lang="ts">
    import type { HTMLInputAttributes } from "svelte/elements";

    type InputType =
        | "text"
        | "password"
        | "email"
        | "number"
        | "tel"
        | "url"
        | "search"
        | "date"
        | "datetime-local"
        | "month"
        | "week"
        | "time"
        | "color";

    type InputProps = Omit<HTMLInputAttributes, "size"> & {
        type?: InputType;
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
        size?: "xs" | "sm" | "md" | "lg";
    };

    let {
        type = "text" as InputType,
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
        size = "md",
        ...restProps
    }: InputProps = $props();

    let baseClasses = "input";
    let borderedClass = $derived(bordered ? "input-bordered" : "");
    let ghostClass = $derived(ghost ? "input-ghost" : "");
    let primaryClass = $derived(primary ? "input-primary" : "");
    let secondaryClass = $derived(secondary ? "input-secondary" : "");
    let accentClass = $derived(accent ? "input-accent" : "");
    let infoClass = $derived(info ? "input-info" : "");
    let successClass = $derived(success ? "input-success" : "");
    let warningClass = $derived(warning ? "input-warning" : "");
    let errorClass = $derived(error ? "input-error" : "");

    let sizeClass = $derived(
        size === "xs"
            ? "input-xs"
            : size === "sm"
              ? "input-sm"
              : size === "lg"
                ? "input-lg"
                : "",
    );

    let classes = $derived(
        `${baseClasses} ${borderedClass} ${ghostClass} ${primaryClass} ${secondaryClass} ${accentClass} ${infoClass} ${successClass} ${warningClass} ${errorClass} ${sizeClass}`,
    );
</script>

<input class={classes} {type} {placeholder} {value} {disabled} {...restProps} />
