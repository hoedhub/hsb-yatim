<script lang="ts">
    import type { HTMLInputAttributes } from "svelte/elements";

    type SearchInputProps = Omit<HTMLInputAttributes, "size"> & {
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
        debounce?: number;
        onSearch?: (value: string) => void;
    };

    let {
        placeholder = "Search...",
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
        debounce = 300,
        onSearch,
        ...restProps
    }: SearchInputProps = $props();

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

    let classes = $derived(
        `${baseClasses} ${borderedClass} ${ghostClass} ${primaryClass} ${secondaryClass} ${accentClass} ${infoClass} ${successClass} ${warningClass} ${errorClass}`,
    );

    let timeoutId = $state<number | null>(null);

    function handleInput(e: Event) {
        const target = e.target as HTMLInputElement;
        const newValue = target.value;
        value = newValue;

        // Clear previous timeout
        if (timeoutId) {
            clearTimeout(timeoutId);
        }

        // Set new timeout
        timeoutId = setTimeout(() => {
            onSearch?.(newValue);
        }, debounce) as unknown as number;
    }
</script>

<div class="relative">
    <input
        class={classes}
        {placeholder}
        {value}
        {disabled}
        oninput={handleInput}
        {...restProps}
    />
    <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
        <svg
            class="w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            ></path>
        </svg>
    </div>
</div>
