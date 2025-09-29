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
