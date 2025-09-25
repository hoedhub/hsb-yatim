<script lang="ts">
    import type { Snippet } from "svelte";

    type ToastVariant =
        | "default"
        | "primary"
        | "secondary"
        | "accent"
        | "info"
        | "success"
        | "warning"
        | "error";
    type ToastPosition =
        | "top-left"
        | "top-center"
        | "top-right"
        | "bottom-left"
        | "bottom-center"
        | "bottom-right";

    type Toast = {
        id: string;
        message: string | Snippet;
        variant?: ToastVariant;
        duration?: number;
        dismissible?: boolean;
        onDismiss?: () => void;
    };

    let { toasts = [] as Toast[], position = "bottom-right" as ToastPosition } =
        $props();

    let baseClasses = "toast";

    let positionClasses = $derived(
        position === "top-left"
            ? "toast-top toast-start"
            : position === "top-center"
              ? "toast-top toast-center"
              : position === "top-right"
                ? "toast-top toast-end"
                : position === "bottom-left"
                  ? "toast-bottom toast-start"
                  : position === "bottom-center"
                    ? "toast-bottom toast-center"
                    : "toast-bottom toast-end",
    );

    let classes = $derived(`${baseClasses} ${positionClasses}`);

    function dismissToast(id: string) {
        toasts = toasts.filter((toast) => toast.id !== id);
    }

    function getToastClasses(variant: ToastVariant | undefined) {
        return variant === "primary"
            ? "alert alert-primary"
            : variant === "secondary"
              ? "alert alert-secondary"
              : variant === "accent"
                ? "alert alert-accent"
                : variant === "info"
                  ? "alert alert-info"
                  : variant === "success"
                    ? "alert alert-success"
                    : variant === "warning"
                      ? "alert alert-warning"
                      : variant === "error"
                        ? "alert alert-error"
                        : "alert";
    }

    // Auto-dismiss toasts after their duration
    $effect(() => {
        const timers = toasts.map((toast) => {
            if (toast.duration) {
                return setTimeout(() => {
                    dismissToast(toast.id);
                    toast.onDismiss?.();
                }, toast.duration);
            }
        });

        return () => {
            timers.forEach((timer) => {
                if (timer) clearTimeout(timer);
            });
        };
    });
</script>

<div class={classes}>
    {#each toasts as toast}
        <div class={getToastClasses(toast.variant)}>
            {#if typeof toast.message === "string"}
                {toast.message}
            {:else}
                {@render toast.message()}
            {/if}
            {#if toast.dismissible !== false}
                <button
                    class="btn btn-sm btn-ghost"
                    onclick={() => {
                        dismissToast(toast.id);
                        toast.onDismiss?.();
                    }}
                >
                    ✕
                </button>
            {/if}
        </div>
    {/each}
</div>
