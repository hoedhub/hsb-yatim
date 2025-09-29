<script lang="ts">
    import type { Snippet } from "svelte";
    import SearchInput from "$lib/components/ui/SearchInput.svelte";

    type Column<T> = {
        key: keyof T;
        label: string;
        sortable?: boolean;
        render?: (value: any, item: T) => string;
    };

    type DataTableProps<T> = {
        data: T[];
        columns: Column<T>[];
        striped?: boolean;
        hover?: boolean;
        compact?: boolean;
        loading?: boolean;
        filterable?: boolean;
        onSort?: (key: keyof T, direction: "asc" | "desc") => void;
    };

    let {
        data = [],
        columns = [],
        striped = false,
        hover = false,
        compact = false,
        loading = false,
        filterable = false,
        onSort,
    }: DataTableProps<any> = $props();

    let baseClasses = "table";

    let stripedClass = $derived(striped ? "table-zebra" : "");
    let hoverClass = $derived(hover ? "table-hover" : "");
    let compactClass = $derived(compact ? "table-xs" : "");

    let classes = $derived(
        `${baseClasses} ${stripedClass} ${hoverClass} ${compactClass}`,
    );

    let sortKey = $state<keyof any | null>(null);
    let sortDirection = $state<"asc" | "desc">("asc");
    let searchTerm = $state('');

    function handleSort(key: keyof any) {
        if (!onSort) return;

        if (sortKey === key) {
            sortDirection = sortDirection === "asc" ? "desc" : "asc";
        } else {
            sortKey = key;
            sortDirection = "asc";
        }

        onSort(key, sortDirection);
    }

    let filteredData = $derived(data.filter((item) => {
        if (!searchTerm) return true;
        return Object.values(item).some((value) =>
            String(value).toLowerCase().includes(searchTerm.toLowerCase())
        );
    }));

    let currentPage = $state(1);
    let rowsPerPage = $state(10);

    let paginatedData = $derived.by(() => {
        const start = (currentPage - 1) * rowsPerPage;
        const end = start + rowsPerPage;
        return filteredData.slice(start, end);
    });

    let totalPages = $derived(Math.ceil(filteredData.length / rowsPerPage));

    function nextPage() {
        if (currentPage < totalPages) {
            currentPage++;
        }
    }

    function prevPage() {
        if (currentPage > 1) {
            currentPage--;
        }
    }

    function goToPage(page: number) {
        currentPage = page;
    }
</script>

<div class="overflow-x-auto">
    {#if filterable}
        <div class="mb-4">
            <SearchInput bind:value={searchTerm} />
        </div>
    {/if}
    {#if loading}
        <div class="flex justify-center items-center h-32">
            <span class="loading loading-spinner loading-md"></span>
        </div>
    {:else}
        <table class={classes}>
            <thead>
                <tr>
                    {#each columns as column}
                        <th
                            class={column.sortable
                                ? "cursor-pointer hover:bg-base-200"
                                : ""}
                            onclick={() =>
                                column.sortable && handleSort(column.key)}
                        >
                            {column.label}
                            {#if column.sortable && sortKey === column.key}
                                {sortDirection === "asc" ? " ↑" : " ↓"}
                            {/if}
                        </th>
                    {/each}
                </tr>
            </thead>
            <tbody>
                {#if paginatedData.length === 0}
                    <tr>
                        <td colspan={columns.length} class="text-center py-4">
                            No data available
                        </td>
                    </tr>
                {:else}
                    {#each paginatedData as item, i}
                        <tr>
                            {#each columns as column}
                                <td>
                                    {#if column.render}
                                        {@html column.render(item[column.key], item)}
                                    {:else}
                                        {item[column.key]}
                                    {/if}
                                </td>
                            {/each}
                        </tr>
                    {/each}
                {/if}
            </tbody>
        </table>
        <div class="flex justify-between items-center mt-4">
            <div>
                <select bind:value={rowsPerPage} class="select select-bordered select-sm">
                    <option value={5}>5 rows</option>
                    <option value={10}>10 rows</option>
                    <option value={20}>20 rows</option>
                    <option value={50}>50 rows</option>
                </select>
            </div>
            <div class="join">
                <button onclick={prevPage} class="join-item btn btn-sm" disabled={currentPage === 1}>«</button>
                <button class="join-item btn btn-sm">Page {currentPage} of {totalPages}</button>
                <button onclick={nextPage} class="join-item btn btn-sm" disabled={currentPage === totalPages}>»</button>
            </div>
        </div>
    {/if}
</div>
