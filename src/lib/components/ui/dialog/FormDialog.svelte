<script lang="ts">
    import type { Snippet } from "svelte";

    let {
        open = $bindable(false),
        title = "",
        description = "",
        closable = true,
        children,
        footer,
        onOpenChange,
    }: {
        open?: boolean;
        title?: string;
        description?: string;
        closable?: boolean;
        children: Snippet;
        footer?: Snippet;
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

            <div class="py-4">
                {@render children()}
            </div>

            {#if footer}
                <div class="modal-action">
                    {@render footer()}
                </div>
            {/if}
        </div>
    </div>
{/if}
