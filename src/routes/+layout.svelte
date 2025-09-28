<script lang="ts">
    import "../app.css";
    import { Toast } from "$lib/components/ui";
    import { toasts, removeToast } from "$lib/stores/toast";
    import type { Snippet } from "svelte";
    import type { PageData } from "./$types";
    import { LayoutDashboard, ShoppingBag, Users, Ruler, Tag, Settings } from "lucide-svelte";
    import Navbar from "$lib/components/layout/Navbar.svelte";
    import Sidebar from "$lib/components/layout/Sidebar.svelte";

    let { data, children }: { data: PageData, children: Snippet } = $props();

    let sidebarOpen = $state(false);

    const navItems = [
        { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
        { href: "/orders", label: "Orders", icon: ShoppingBag },
        { href: "/customers", label: "Customers", icon: Users },
        { href: "/measurements/templates", label: "Templates", icon: Ruler },
        { href: "/measurements/labels", label: "Labels", icon: Tag },
        { href: "/settings", label: "Settings", icon: Settings },
    ];

    function onToggleSidebar() {
        sidebarOpen = !sidebarOpen;
    }
</script>

{#if data.session}
    <div class="drawer lg:drawer-open">
        <input id="my-drawer-2" type="checkbox" class="drawer-toggle" bind:checked={sidebarOpen} />
        <div class="drawer-content flex flex-col items-start justify-start">
            <Navbar session={data.session} onToggleSidebar={onToggleSidebar} />
            <main class="p-4 w-full">
                {@render children()}
            </main>
        </div>
        <Sidebar navItems={navItems} session={data.session} sidebarOpen={sidebarOpen} onToggleSidebar={onToggleSidebar} />
    </div>
{:else}
    <!-- Layout for unauthenticated users (e.g., login page) -->
    {@render children()}
{/if}

<Toast toasts={$toasts} onDismiss={removeToast} />