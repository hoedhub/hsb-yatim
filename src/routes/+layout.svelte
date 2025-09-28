<script lang="ts">
    import "../app.css";
    import { Toast } from "$lib/components/ui";
    import { toasts, removeToast } from "$lib/stores/toast";
    import type { Snippet } from "svelte";
    import type { PageData } from "./$types";
    import { Menu, User, LogOut } from "lucide-svelte";

    let { data, children }: { data: PageData, children: Snippet } = $props();

    let sidebarOpen = $state(false);

    const navItems = [
        { href: "/dashboard", label: "Dashboard" },
        { href: "/orders", label: "Orders" },
        { href: "/customers", label: "Customers" },
        { href: "/measurements/templates", label: "Templates" },
        { href: "/measurements/labels", label: "Labels" },
        { href: "/settings", label: "Settings" },
    ];
</script>

{#if data.session}
    <div class="drawer lg:drawer-open">
        <input id="my-drawer-2" type="checkbox" class="drawer-toggle" bind:checked={sidebarOpen} />
        <div class="drawer-content flex flex-col items-start justify-start">
            <!-- Page content here -->
            <div class="navbar bg-base-100 lg:hidden">
                <div class="flex-1">
                    <label for="my-drawer-2" class="btn btn-primary drawer-button"><Menu /></label>
                </div>
                <div class="flex-none">
                    <div class="dropdown dropdown-end">
                        <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
                        <label tabindex="0" class="btn btn-ghost btn-circle avatar">
                            <div class="w-10 rounded-full bg-gray-300 flex items-center justify-center">
                                <User />
                            </div>
                        </label>
                        <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
                        <ul tabindex="0" class="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
                            <li><a href="/profile">Profile</a></li>
                            <li>
                                <form action="/auth/signout" method="POST">
                                    <button type="submit" class="w-full text-left">Logout</button>
                                </form>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <main class="p-4 w-full">
                {@render children()}
            </main>
        </div>
        <div class="drawer-side">
            <label for="my-drawer-2" aria-label="close sidebar" class="drawer-overlay"></label>
            <ul class="menu p-4 w-80 min-h-full bg-base-200 text-base-content">
                <!-- Sidebar content here -->
                <li class="text-xl font-bold p-4">Tiket Jahit</li>
                {#each navItems as item}
                    <li><a href={item.href}>{item.label}</a></li>
                {/each}
                <div class="flex-grow"></div>
                <div class="p-4">
                    <div class="dropdown dropdown-top w-full">
                        <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
                        <label tabindex="0" class="btn m-1 w-full flex justify-between">
                            <div class="flex items-center">
                                <div class="avatar mr-2">
                                    <div class="w-8 rounded-full bg-gray-300 flex items-center justify-center">
                                        <User />
                                    </div>
                                </div>
                                <span>{data.session.user?.name}</span>
                            </div>
                        </label>
                        <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
                        <ul tabindex="0" class="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-full">
                            <li><a href="/profile">Profile</a></li>
                            <li>
                                <form action="/auth/signout" method="POST">
                                    <button type="submit" class="w-full text-left">Logout</button>
                                </form>
                            </li>
                        </ul>
                    </div>
                </div>
            </ul>
        </div>
    </div>
{:else}
    <!-- Layout for unauthenticated users (e.g., login page) -->
    {@render children()}
{/if}

<Toast toasts={$toasts} onDismiss={removeToast} />