<script lang="ts">
    import { Button } from "$lib/components/ui";

    let {
        open = $bindable(false),
        title = "Confirm Action",
        message = "Are you sure you want to proceed?",
        confirmText = "Confirm",
        cancelText = "Cancel",
        dangerous = false,
        onConfirm,
        onCancel,
    }: {
        open?: boolean;
        title?: string;
        message?: string;
        confirmText?: string;
        cancelText?: string;
        dangerous?: boolean;
        onConfirm?: () => void;
        onCancel?: () => void;
    } = $props();

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
            <h3 class="font-bold text-lg">{title}</h3>
            <p class="py-4">{message}</p>
            <div class="modal-action">
                <Button onclick={handleCancel} variant="ghost">
                    {cancelText}
                </Button>
                <Button onclick={handleConfirm} variant={dangerous ? "error" : "primary"}>
                    {confirmText}
                </Button>
            </div>
        </div>
    </div>
{/if}
