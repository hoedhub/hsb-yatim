<script lang="ts">
    import "../app.css";
    import { Toast } from "$lib/components/ui";
    import { toasts, removeToast } from "$lib/stores/toast";
    import type { Snippet } from "svelte";
    import type { PageData } from "./$types";
    import { onMount } from "svelte";
    import { signOut } from "@auth/sveltekit/client";

    let { data, children }: { data: PageData, children: Snippet } = $props();

    onMount(() => {
        const interval = setInterval(() => {
            if (data.session && new Date(data.session.expires) < new Date()) {
                signOut();
            }
        }, 1000 * 60); // Check every minute

        return () => clearInterval(interval);
    });
</script>

{@render children()}

<Toast toasts={$toasts} onDismiss={removeToast} />