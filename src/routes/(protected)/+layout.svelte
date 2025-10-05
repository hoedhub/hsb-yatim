<script lang="ts">
    import Navigation from "$lib/components/layout/Navigation.svelte";
    import Header from "$lib/components/layout/Header.svelte";
    import { page } from "$app/stores";
    import type { Snippet, SvelteComponent } from "svelte";
    import type { LayoutData } from "./$types";
    import { LayoutDashboard, ShoppingBag, Users, Ruler, Tag, Settings } from "lucide-svelte";

    let { data, children }: { data: LayoutData, children: Snippet } = $props();

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
</script>

<Navigation links={navItems} session={data.session}>
    <Header session={data.session} breadcrumbs={breadcrumbs} actions={[]} />
    <main class="p-4 w-full">
        {@render children()}
    </main>
</Navigation>
