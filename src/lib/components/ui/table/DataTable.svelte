<script lang="ts">
    import type { Snippet } from "svelte";
    import type { HTMLAttributes } from "svelte/elements";
    import SearchInput from "$lib/components/ui/SearchInput.svelte";
    import { 
        ChevronUp, 
        ChevronDown, 
        ChevronsUpDown,
        ChevronLeft,
        ChevronRight,
        ChevronsLeft,
        ChevronsRight,
        Inbox
    } from "lucide-svelte";

    type Column<T> = {
        key: keyof T;
        label: string;
        sortable?: boolean;
        component?: any;
        width?: string;
        align?: "left" | "center" | "right";
        hidden?: boolean;
    };

    type DataTableProps<T> = {
        data: T[];
        columns: Column<T>[];
        striped?: boolean;
        hover?: boolean;
        compact?: boolean;
        loading?: boolean;
        filterable?: boolean;
        paginated?: boolean;
        emptyMessage?: string;
        emptyIcon?: Snippet;
        class?: string;
        rowsPerPageOptions?: number[];
        defaultRowsPerPage?: number;
        onSort?: (key: keyof T, direction: "asc" | "desc") => void;
        onRowClick?: (item: T) => void;
    };

    let {
        data = [],
        columns = [],
        striped = false,
        hover = true,
        compact = false,
        loading = false,
        filterable = false,
        paginated = true,
        emptyMessage = "Tidak ada data tersedia",
        emptyIcon,
        class: className = "",
        rowsPerPageOptions = [5, 10, 20, 50, 100],
        defaultRowsPerPage = 10,
        onSort,
        onRowClick,
    }: DataTableProps<any> = $props();

    // Classes
    let baseClasses = "table w-full";
    let stripedClass = $derived(striped ? "table-zebra" : "");
    let hoverClass = $derived(hover ? "table-hover" : "");
    let compactClass = $derived(compact ? "table-xs" : "");
    let classes = $derived(
        `${baseClasses} ${stripedClass} ${hoverClass} ${compactClass}`.trim().replace(/\s+/g, ' ')
    );

    // Sorting
    let sortKey = $state<keyof any | null>(null);
    let sortDirection = $state<"asc" | "desc">("asc");

    function handleSort(key: keyof any) {
        if (sortKey === key) {
            sortDirection = sortDirection === "asc" ? "desc" : "asc";
        } else {
            sortKey = key;
            sortDirection = "asc";
        }
        if (onSort) {
            onSort(key, sortDirection);
        }
    }

    // Filtering
    let searchTerm = $state('');
    let filteredData = $derived(data.filter((item) => {
        if (!searchTerm) return true;
        return Object.values(item).some((value) =>
            String(value).toLowerCase().includes(searchTerm.toLowerCase())
        );
    }));

    // Pagination
    let currentPage = $state(1);
    let rowsPerPage = $state(defaultRowsPerPage);
    
    let paginatedData = $derived.by(() => {
        if (!paginated) return filteredData;
        const start = (currentPage - 1) * rowsPerPage;
        const end = start + rowsPerPage;
        return filteredData.slice(start, end);
    });

    let totalPages = $derived(Math.ceil(filteredData.length / rowsPerPage));
    let startRow = $derived((currentPage - 1) * rowsPerPage + 1);
    let endRow = $derived(Math.min(currentPage * rowsPerPage, filteredData.length));

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

    function goToFirstPage() {
        currentPage = 1;
    }

    function goToLastPage() {
        currentPage = totalPages;
    }

    function goToPage(page: number) {
        if (page >= 1 && page <= totalPages) {
            currentPage = page;
        }
    }

    // Reset to first page when rows per page changes
    $effect(() => {
        rowsPerPage;
        currentPage = 1;
    });

    // Reset to first page when search term changes
    $effect(() => {
        searchTerm;
        currentPage = 1;
    });

    // Visible columns
    let visibleColumns = $derived(columns.filter(col => !col.hidden));

    // Page numbers to show
    let pageNumbers = $derived.by(() => {
        const pages: number[] = [];
        const maxVisible = 5;
        
        if (totalPages <= maxVisible) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            if (currentPage <= 3) {
                pages.push(1, 2, 3, 4, -1, totalPages);
            } else if (currentPage >= totalPages - 2) {
                pages.push(1, -1, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
            } else {
                pages.push(1, -1, currentPage - 1, currentPage, currentPage + 1, -1, totalPages);
            }
        }
        
        return pages;
    });
</script>

<style>
    .skeleton-loader {
        background: linear-gradient(
            90deg,
            rgba(255, 255, 255, 0.05) 25%,
            rgba(255, 255, 255, 0.1) 50%,
            rgba(255, 255, 255, 0.05) 75%
        );
        background-size: 1000px 100%;
        animation: shimmer 2s infinite;
    }

    @keyframes shimmer {
        0% {
            background-position: -1000px 0;
        }
        100% {
            background-position: 1000px 0;
        }
    }

    .table-row-clickable {
        cursor: pointer;
        transition: all 0.2s ease;
    }

    .table-row-clickable:hover {
        transform: scale(1.01);
    }
</style>

<div class={`space-y-4 ${className}`}>
    <!-- Search Bar -->
    {#if filterable}
        <div class="flex items-center justify-between gap-4">
            <div class="flex-1 max-w-md">
                <SearchInput bind:value={searchTerm} placeholder="Cari data..." />
            </div>
            <div class="text-sm text-base-content/60">
                Menampilkan {filteredData.length} dari {data.length} data
            </div>
        </div>
    {/if}

    <!-- Table Container -->
    <div class="overflow-x-auto rounded-lg border border-base-300 bg-base-100">
        {#if loading}
            <!-- Loading Skeleton -->
            <table class={classes}>
                <thead>
                    <tr class="border-base-300">
                        {#each visibleColumns as column}
                            <th class="bg-base-200/50">
                                <div class="skeleton-loader h-4 w-24 rounded"></div>
                            </th>
                        {/each}
                    </tr>
                </thead>
                <tbody>
                    {#each Array(rowsPerPage) as _, i}
                        <tr>
                            {#each visibleColumns as column}
                                <td>
                                    <div class="skeleton-loader h-4 w-32 rounded"></div>
                                </td>
                            {/each}
                        </tr>
                    {/each}
                </tbody>
            </table>
        {:else}
            <table class={classes}>
                <thead>
                    <tr class="border-base-300">
                        {#each visibleColumns as column}
                            <th 
                                class={`
                                    bg-base-200/50
                                    ${column.sortable ? 'cursor-pointer hover:bg-base-300 transition-colors select-none' : ''}
                                    ${column.align === 'center' ? 'text-center' : column.align === 'right' ? 'text-right' : ''}
                                `}
                                style={column.width ? `width: ${column.width}` : ''}
                                onclick={() => column.sortable && handleSort(column.key)}
                            >
                                <div class="flex items-center gap-2 {column.align === 'center' ? 'justify-center' : column.align === 'right' ? 'justify-end' : ''}">
                                    <span class="font-semibold">{column.label}</span>
                                    {#if column.sortable}
                                        <span class="text-base-content/50">
                                            {#if sortKey === column.key}
                                                {#if sortDirection === "asc"}
                                                    <ChevronUp class="h-4 w-4" />
                                                {:else}
                                                    <ChevronDown class="h-4 w-4" />
                                                {/if}
                                            {:else}
                                                <ChevronsUpDown class="h-4 w-4" />
                                            {/if}
                                        </span>
                                    {/if}
                                </div>
                            </th>
                        {/each}
                    </tr>
                </thead>
                <tbody>
                    {#if paginatedData.length === 0}
                        <tr>
                            <td colspan={visibleColumns.length} class="text-center py-12">
                                <div class="flex flex-col items-center gap-3">
                                    {#if emptyIcon}
                                        {@render emptyIcon()}
                                    {:else}
                                        <div class="p-4 bg-base-200 rounded-full">
                                            <Inbox class="h-8 w-8 text-base-content/30" />
                                        </div>
                                    {/if}
                                    <div>
                                        <p class="font-medium text-base-content/70">{emptyMessage}</p>
                                        {#if searchTerm}
                                            <p class="text-sm text-base-content/50">
                                                Coba kata kunci pencarian yang berbeda
                                            </p>
                                        {/if}
                                    </div>
                                </div>
                            </td>
                        </tr>
                    {:else}
                        {#each paginatedData as item, i}
                            <tr 
                                class={onRowClick ? 'table-row-clickable' : ''}
                                onclick={() => onRowClick?.(item)}
                            >
                                {#each visibleColumns as column}
                                    <td class={column.align === 'center' ? 'text-center' : column.align === 'right' ? 'text-right' : ''}>
                                        {#if column.component}
                                            <column.component value={item[column.key]} item={item} />
                                        {:else}
                                            {item[column.key] ?? '-'}
                                        {/if}
                                    </td>
                                {/each}
                            </tr>
                        {/each}
                    {/if}
                </tbody>
            </table>
        {/if}
    </div>

    <!-- Pagination -->
    {#if paginated && !loading && paginatedData.length > 0}
        <div class="flex flex-col sm:flex-row justify-between items-center gap-4 pt-2">
            <!-- Rows per page -->
            <div class="flex items-center gap-2">
                <span class="text-sm text-base-content/60">Baris per halaman:</span>
                <select 
                    bind:value={rowsPerPage} 
                    class="select select-bordered select-sm w-20"
                >
                    {#each rowsPerPageOptions as option}
                        <option value={option}>{option}</option>
                    {/each}
                </select>
                <span class="text-sm text-base-content/60 ml-4">
                    {startRow}-{endRow} dari {filteredData.length}
                </span>
            </div>

            <!-- Page navigation -->
            <div class="flex items-center gap-1">
                <button 
                    onclick={goToFirstPage} 
                    class="btn btn-sm btn-ghost"
                    disabled={currentPage === 1}
                    title="Halaman pertama"
                >
                    <ChevronsLeft class="h-4 w-4" />
                </button>
                
                <button 
                    onclick={prevPage} 
                    class="btn btn-sm btn-ghost"
                    disabled={currentPage === 1}
                    title="Halaman sebelumnya"
                >
                    <ChevronLeft class="h-4 w-4" />
                </button>

                <!-- Page numbers -->
                <div class="hidden sm:flex items-center gap-1">
                    {#each pageNumbers as page}
                        {#if page === -1}
                            <span class="px-2 text-base-content/40">...</span>
                        {:else}
                            <button
                                onclick={() => goToPage(page)}
                                class={`btn btn-sm ${currentPage === page ? 'btn-primary' : 'btn-ghost'}`}
                            >
                                {page}
                            </button>
                        {/if}
                    {/each}
                </div>

                <!-- Mobile: current page indicator -->
                <div class="sm:hidden px-4 py-2 text-sm">
                    {currentPage} / {totalPages}
                </div>

                <button 
                    onclick={nextPage} 
                    class="btn btn-sm btn-ghost"
                    disabled={currentPage === totalPages}
                    title="Halaman selanjutnya"
                >
                    <ChevronRight class="h-4 w-4" />
                </button>

                <button 
                    onclick={goToLastPage} 
                    class="btn btn-sm btn-ghost"
                    disabled={currentPage === totalPages}
                    title="Halaman terakhir"
                >
                    <ChevronsRight class="h-4 w-4" />
                </button>
            </div>
        </div>
    {/if}
</div>
