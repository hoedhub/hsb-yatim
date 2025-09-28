<script lang="ts">
    import { Menu, User, Search, LogOut } from 'lucide-svelte';
    import type { Session } from '@auth/sveltekit';
    import type { Snippet } from 'svelte';

    let { session, onToggleSidebar }: {
        session: Session | null;
        onToggleSidebar: () => void;
    } = $props();

    let searchTerm = $state('');

    function handleSearch() {
        console.log('Searching for:', searchTerm);
        // Implement actual search logic here
    }
</script>

<div class="navbar bg-base-100 sticky top-0 z-10 lg:hidden shadow-sm">
    <div class="flex-1">
        <button type="button" class="btn btn-primary drawer-button" onclick={onToggleSidebar}>
            <Menu />
        </button>
    </div>
    <div class="flex flex-none gap-2">
        <div class="form-control">
            <input
                type="text"
                placeholder="Search..."
                class="input input-bordered w-24 md:w-auto"
                bind:value={searchTerm}
                onchange={handleSearch}
            />
        </div>
        <div class="dropdown dropdown-end">
                    <button type="button" class="btn btn-ghost btn-circle avatar">
                        <div class="w-10 rounded-full bg-gray-300 flex items-center justify-center">
                            <User />
                        </div>
                    </button>            <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
            <ul tabindex="0" class="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
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
</div>
