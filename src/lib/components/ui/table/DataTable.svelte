<script lang="ts">
    import type { Snippet } from "svelte";

    type Column<T> = {
        key: keyof T;
        label: string;
        sortable?: boolean;
        render?: (value: any, item: T) => Snippet;
    };

    type DataTableProps<T> = {
        data: T[];
        columns: Column<T>[];
        striped?: boolean;
        hover?: boolean;
        compact?: boolean;
        loading?: boolean;
        onSort?: (key: keyof T, direction: "asc" | "desc") => void;
    };

    let {
        data = [],
        columns = [],
        striped = false,
        hover = false,
        compact = false,
        loading = false,
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

    function renderCell(column: Column<any>, item: any) {
        if (column.render) {
            return column.render(item[column.key], item);
        }
        return item[column.key];
    }
</script>

<div class="overflow-x-auto">
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
                {#if data.length === 0}
                    <tr>
                        <td colspan={columns.length} class="text-center py-4">
                            No data available
                        </td>
                    </tr>
                {:else}
                    {#each data as item, i}
                        <tr>
                            {#each columns as column}
                                <td>
                                    {renderCell(column, item)}
                                </td>
                            {/each}
                        </tr>
                    {/each}
                {/if}
            </tbody>
        </table>
    {/if}
</div>
