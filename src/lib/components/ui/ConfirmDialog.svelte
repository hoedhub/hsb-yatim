<script lang="ts">
    import { Button } from "$lib/components/ui";

    let {
        open = $bindable(false),
        title = "Confirm Action",
        message = "Are you sure you want to proceed?",
        confirmText = "Confirm",
        cancelText = "Cancel",
        confirmLabel = "Confirm",
        cancelLabel = "Cancel",
        dangerous = false,
        variant = "primary",
        onConfirm,
        onCancel,
    }: {
        open?: boolean;
        title?: string;
        message?: string;
        confirmText?: string;
        cancelText?: string;
        confirmLabel?: string;
        cancelLabel?: string;
        dangerous?: boolean;
        variant?: "primary" | "error";
        onConfirm?: () => void;
        onCancel?: () => void;
    } = $props();

    // Support both confirmText/cancelText and confirmLabel/cancelLabel
    const confirmButtonText = confirmLabel || confirmText;
    const cancelButtonText = cancelLabel || cancelText;

    let dialogRef: HTMLDivElement | undefined = $state();

    function close() {
        open = false;
    }

    function handleConfirm() {
        onConfirm?.();
        close();
    }

    function handleCancel() {
        onCancel?.();
        close();
    }

    function handleBackdropClick(e: Event) {
        if (e.target === e.currentTarget) {
            close();
        }
    }

    function handleKeyDown(e: KeyboardEvent) {
        if (e.key === "Escape") {
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
            <h3 class="font-bold text-lg">{title}</h3>
            <p class="py-4">{message}</p>
            <div class="modal-action">
                <Button onclick={handleCancel} variant="ghost">
                    {cancelButtonText}
                </Button>
                <Button
                    onclick={handleConfirm}
                    variant={variant === "error" || dangerous
                        ? "error"
                        : "primary"}
                >
                    {confirmButtonText}
                </Button>
            </div>
        </div>
    </div>
{/if}
