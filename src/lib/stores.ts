import { writable } from 'svelte/store';

export const pageId = writable(0);
export const modified = writable<Record<string, boolean>>({});//writable<{ form: string, modified: boolean }[]>([]);
