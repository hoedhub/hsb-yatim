<script lang="ts">
    import type { Snippet } from "svelte";

    type Path<T> = any; // Using any for Path<T> for now

    type Form<T = any> = {
        initialValues: T;
        data: T;
        errors: Record<Path<T>, string[] | undefined> & { _errors?: string[] };
        isValid: boolean;
        isSubmitting: boolean;
        isDirty: boolean;
        touched: Record<Path<T>, boolean | undefined>;
        setInitialValues(values: T, options?: { reset?: boolean }): void;
        setIsDirty(dirty?: boolean): void;
        setIsSubmitting(submitting?: boolean): void;
        reset(): void;
        resetField(field: Path<T>): void;
        setError(field: Path<T>, error: string | string[]): void;
        validate(field?: Path<T> | Path<T>[]): boolean;
        submit(callback?: (data: T) => any): Promise<void>;
        handler(node: HTMLFormElement): void;
    };

    let {
        open = $bindable(false),
        title = "",
        description = "",
        closable = true,
        form = null as Form | null,
        children,
        footer,
        error,
        onOpenChange,
    }: {
        open?: boolean;
        title?: string;
        description?: string;
        closable?: boolean;
        form?: Form | null;
        children: Snippet;
        footer?: Snippet;
        error?: Snippet<[{ errors: string[] }]>;
        onOpenChange?: (open: boolean) => void;
    } = $props();

    let dialogRef: HTMLDivElement | undefined = $state();

    function close() {
        open = false;
        onOpenChange?.(false);
    }

    function handleBackdropClick(e: Event) {
        if (e.target === e.currentTarget) {
            close();
        }
    }

    function handleKeyDown(e: KeyboardEvent) {
        if (e.key === 'Escape') {
            close();
        }
    }

    $effect(() => {
        if (open && dialogRef) {
            dialogRef.focus();
        }
    });
</script>

{#if open}
    <div
        bind:this={dialogRef}
        class="modal modal-open"
        onclick={handleBackdropClick}
        onkeydown={handleKeyDown}
        role="dialog"
        tabindex="-1"
    >
        <div class="modal-box">
            <div class="flex items-start justify-between">
                <div class="flex-1">
                    {#if title}
                        <h3 class="font-bold text-lg">{title}</h3>
                    {/if}
                    {#if description}
                        <p class="text-sm text-gray-500 py-2">{description}</p>
                    {/if}
                </div>
                {#if closable}
                    <button
                        class="btn btn-sm btn-circle btn-ghost"
                        onclick={close}
                        aria-label="Close"
                        type="button"
                    >
                        ✕
                    </button>
                {/if}
            </div>

            <form use:form?.handler>
                {#if form?.errors?._errors && error}
                    <div class="py-2">
                        {@render error({ errors: form.errors._errors })}
                    </div>
                {/if}
                <div class="py-4">
                    {@render children()}
                </div>

                {#if footer}
                    <div class="modal-action">
                        {@render footer()}
                    </div>
                {/if}
            </form>
        </div>
    </div>
{/if}
