<script lang="ts">
    import { page } from "$app/stores";
    import type { Snippet, SvelteComponent } from "svelte";
    import { Menu, X, LogOut } from "lucide-svelte";
    import { signOut } from "@auth/sveltekit/client";
    import type { Session } from "@auth/sveltekit";

    type NavLink = {
        href: string;
        label: string;
        icon: typeof SvelteComponent;
    };

    let {
        links = [],
        session,
        children,
    }: {
        links?: NavLink[];
        session?: Session | null;
        children: Snippet;
    } = $props();

    let isMobileMenuOpen = $state(false);

    let currentPath = $derived($page.url.pathname);

    function isActive(href: string) {
        return currentPath === href;
    }

    async function handleSignOut() {
        await signOut();
    }
</script>

<div class="drawer lg:drawer-open">
    <input id="my-drawer-2" type="checkbox" class="drawer-toggle" bind:checked={isMobileMenuOpen} />
    <div class="drawer-content flex flex-col">
        <!-- Navbar for mobile -->
        <div class="w-full navbar bg-base-300 lg:hidden">
            <div class="flex-none">
                <label for="my-drawer-2" class="btn btn-square btn-ghost">
                    <Menu class="h-5 w-5" />
                </label>
            </div>
            <div class="flex-1 px-2 mx-2">Aplikasi Tiket Jahit</div>
            <div class="flex-none">
                {#if session?.user}
                    <div class="dropdown dropdown-end">
                        <button tabindex="0" class="btn btn-ghost rounded-btn">
                            {session.user.name || session.user.email}
                        </button>
                        <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
                        <ul tabindex="0" class="menu dropdown-content z-[1] p-2 shadow bg-base-100 rounded-box w-52 mt-4">
                            <li><a href="/profile">Profile</a></li>
                            <li><button onclick={handleSignOut}>Logout</button></li>
                        </ul>
                    </div>
                {/if}
            </div>
        </div>
        <!-- Main content here -->
        {@render children()}
    </div>
    <div class="drawer-side">
        <label for="my-drawer-2" aria-label="close sidebar" class="drawer-overlay"></label>
        <ul class="menu p-4 w-80 min-h-full bg-base-200 text-base-content">
            <div class="flex justify-end lg:hidden">
                <button class="btn btn-ghost btn-circle" onclick={() => (isMobileMenuOpen = false)}>
                    <X class="h-5 w-5" />
                </button>
            </div>
            <!-- Sidebar content here -->
            <li class="menu-title">Aplikasi Tiket Jahit</li>
            {#each links as link}
                <li>
                    <a href={link.href} class:active={isActive(link.href)}>
                        <link.icon class="h-5 w-5" />
                        {link.label}
                    </a>
                </li>
            {/each}
            {#if session?.user}
                <div class="divider"></div>
                <li>
                    <a href="/profile" class:active={isActive("/profile")}>
                        <img src={session.user.image || `https://api.dicebear.com/7.x/initials/svg?seed=${session.user.name || session.user.email}`} alt="User Avatar" class="w-6 h-6 rounded-full" />
                        {session.user.name || session.user.email}
                    </a>
                </li>
                <li>
                    <button onclick={handleSignOut}>
                        <LogOut class="h-5 w-5" />
                        Logout
                    </button>
                </li>
            {/if}
        </ul>
    </div>
</div>
