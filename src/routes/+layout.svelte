<script lang="ts">
    import "../app.css";
    import { Toast } from "$lib/components/ui";
    import { toasts, removeToast } from "$lib/stores/toast";
    import type { Snippet, SvelteComponent } from "svelte";
    import type { PageData } from "./$types";
    import { LayoutDashboard, ShoppingBag, Users, Ruler, Tag, Settings } from "lucide-svelte";
    import Navigation from "$lib/components/layout/Navigation.svelte";
    import Header from "$lib/components/layout/Header.svelte";
    import { onMount } from "svelte";
    import { signOut } from "@auth/sveltekit/client";
    import { page } from "$app/stores";

    let { data, children }: { data: PageData, children: Snippet } = $props();

    const navItems = [
        { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard as typeof SvelteComponent },
        { href: "/orders", label: "Orders", icon: ShoppingBag as typeof SvelteComponent },
        { href: "/customers", label: "Customers", icon: Users as typeof SvelteComponent },
        { href: "/measurements/templates", label: "Templates", icon: Ruler as typeof SvelteComponent },
        { href: "/measurements/labels", label: "Labels", icon: Tag as typeof SvelteComponent },
        { href: "/settings", label: "Settings", icon: Settings as typeof SvelteComponent },
    ];

    let breadcrumbs = $derived($page.url.pathname.split('/').filter(p => p).map((p, i, arr) => ({
        label: p.charAt(0).toUpperCase() + p.slice(1),
        href: '/' + arr.slice(0, i + 1).join('/'),
    })));

    onMount(() => {
        const interval = setInterval(() => {
            if (data.session && new Date(data.session.expires) < new Date()) {
                signOut();
            }
        }, 1000 * 60); // Check every minute

        return () => clearInterval(interval);
    });
</script>

{#if data.session}
    <Navigation links={navItems} session={data.session}>
        <Header session={data.session} breadcrumbs={breadcrumbs} actions={[]} />
        <main class="p-4 w-full">
            {#if data.session && import.meta.env.DEV}
                <div class="bg-yellow-200 text-black p-2 rounded-md mb-4">
                    <p class="font-bold">Session Debug (Dev Only):</p>
                    <p>Expires: {new Date(data.session.expires).toLocaleString()}</p>
                </div>
            {/if}
            {@render children()}
        </main>
    </Navigation>
{:else}
    <!-- Layout for unauthenticated users (e.g., login page) -->
    {@render children()}
{/if}

<Toast toasts={$toasts} onDismiss={removeToast} />