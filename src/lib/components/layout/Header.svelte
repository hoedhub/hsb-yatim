<script lang="ts">
    import { page } from "$app/stores";
    import type { Snippet, SvelteComponent } from "svelte";
    import { LogOut, Menu } from "lucide-svelte";
    import { signOut } from "@auth/sveltekit/client";
    import type { Session } from "@auth/sveltekit";

    type Breadcrumb = {
        label: string;
        href?: string;
    };

    type Action = {
        label: string;
        icon: typeof SvelteComponent;
        onclick: () => void;
    };

    let {
        session,
        breadcrumbs = [],
        actions = [],
    }: {
        session?: Session | null;
        breadcrumbs?: Breadcrumb[];
        actions?: Action[];
    } = $props();

    async function handleSignOut() {
        await signOut();
    }
</script>

<div class="navbar bg-base-100 shadow-sm sticky top-0 z-10">
    <div class="flex-none lg:hidden">
        <label for="my-drawer-2" class="btn btn-square btn-ghost">
            <Menu class="h-5 w-5" />
        </label>
    </div>
    <div class="flex-1 flex items-center">
        <div class="text-xl font-bold flex-1 text-nowrap overflow-hidden text-ellipsis">
            Aplikasi Tiket Jahit
        </div>
        <div class="text-sm breadcrumbs">
            <ul>
                {#each breadcrumbs as breadcrumb}
                    <li>
                        {#if breadcrumb.href}
                            <a href={breadcrumb.href}>{breadcrumb.label}</a>
                        {:else}
                            {breadcrumb.label}
                        {/if}
                    </li>
                {/each}
            </ul>
        </div>
    </div>
    <div class="flex-none gap-2">
        {#if actions.length > 0}
            <div class="flex-none">
                {#each actions as action}
                    <button class="btn btn-ghost btn-circle" onclick={action.onclick}>
                        <action.icon class="h-5 w-5" />
                    </button>
                {/each}
            </div>
        {/if}
        {#if session?.user}
            <div class="dropdown dropdown-end">
                <div tabindex="0" role="button" class="btn btn-ghost btn-circle avatar">
                    <div class="w-8 h-8 rounded-full">
                        <img alt="User Avatar" src={session.user.image || `https://api.dicebear.com/7.x/initials/svg?seed=${session.user.name || session.user.email}`} />
                    </div>
                </div>
                <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
                <ul tabindex="0" class="menu dropdown-content z-[1] p-2 shadow bg-base-100 rounded-box w-52 mt-4">
                    <li><a href="/profile">Profile</a></li>
                    <li>
                        <button onclick={handleSignOut}>
                            <LogOut class="h-5 w-5" />
                            Logout
                        </button>
                    </li>
                </ul>
            </div>
        {/if}
    </div>
</div>
