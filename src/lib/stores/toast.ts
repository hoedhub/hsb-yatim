import type { Snippet } from 'svelte';
import { writable } from 'svelte/store';

type ToastVariant =
    | 'default'
    | 'primary'
    | 'secondary'
    | 'accent'
    | 'info'
    | 'success'
    | 'warning'
    | 'error';

export type ToastPosition =
    | 'top-left'
    | 'top-center'
    | 'top-right'
    | 'bottom-left'
    | 'bottom-center'
    | 'bottom-right';

export type Toast = {
    id: string;
    message: string | Snippet;
    variant?: ToastVariant;
    duration?: number;
    position?: ToastPosition;
};

const { subscribe, update } = writable<Toast[]>([]);

export function removeToast(id: string) {
    update((toasts) => toasts.filter((t) => t.id !== id));
}

export function showToast(
    message: string | Snippet,
    options?: {
        variant?: ToastVariant;
        duration?: number;
        position?: ToastPosition;
    },
) {
    const id = Date.now().toString();
    const duration = options?.duration ?? 3000;

    const newToast: Toast = {
        id,
        message,
        variant: options?.variant ?? 'default',
        duration,
        position: options?.position ?? 'bottom-right',
    };

    update((toasts) => [...toasts, newToast]);

    setTimeout(() => {
        removeToast(id);
    }, duration);
}

export const toasts = { subscribe };
