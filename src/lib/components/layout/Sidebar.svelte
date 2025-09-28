<script lang="ts">
    import { page } from '$app/stores';
    import { User, LogOut } from 'lucide-svelte';
    import type { Session } from '@auth/sveltekit';
    import type { SvelteComponent } from 'svelte';

    let { navItems, session, sidebarOpen, onToggleSidebar }: {
        navItems: { href: string; label?: string; icon?: any }[];
        session: Session | null;
        sidebarOpen: boolean;
        onToggleSidebar: () => void;
    } = $props();

    const currentPath = $derived($page.url.pathname);
</script>

<div class="drawer-side">
    <button type="button" aria-label="close sidebar" class="drawer-overlay" onclick={onToggleSidebar}></button>
    <ul class="menu space-y-2 p-4 w-80 min-h-full bg-base-200 text-base-content">
        <!-- Sidebar content here -->
        <li class="text-xl font-bold p-4">Tiket Jahit</li>
        {#each navItems as item}
            <li>
                <a href={item.href} class:active={currentPath === item.href}>
                    {#if item.icon}
                        {@const IconComponent = item.icon}
                        <IconComponent />
                    {/if}
                    {item.label}
                </a>
            </li>
        {/each}
        <div class="flex-grow"></div>
        <div class="p-4">
            <div class="dropdown dropdown-top w-full">
                <button type="button" class="btn m-1 w-full flex justify-between">
                    <div class="flex items-center">
                        <div class="avatar mr-2">
                            <div class="w-8 rounded-full bg-gray-300 flex items-center justify-center">
                                <User />
                            </div>
                        </div>
                        <span>{session?.user?.name}</span>
                    </div>
                </button>
                <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
                <ul tabindex="0" class="dropdown-content z-[1] menu p-2 space-y-2 shadow bg-base-100 rounded-box w-full">
                    <li><a href="/profile" class="w-full h-full block flex justify-start items-center cursor-pointer px-4"><User class="mr-2 h-4 w-4" /><span>Profile</span></a></li>
                    <li>
                        <form action="/auth/signout" method="POST" class="w-full h-full block">
                            <button type="submit" class="w-full flex justify-start items-center cursor-pointer px-4">
                                <LogOut class="mr-2 h-4 w-4" />
                                <span>Logout</span>
                            </button>
                        </form>
                    </li>
                </ul>
            </div>
        </div>
    </ul>
</div>
