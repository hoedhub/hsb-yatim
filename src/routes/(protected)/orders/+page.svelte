<script lang="ts">
    import PageHeader from "$lib/components/layout/PageHeader.svelte";
    import DataTable from "$lib/components/ui/table/DataTable.svelte";
    import { Plus, Eye } from "lucide-svelte";
    import type { PageData } from "./$types";

    let { data } = $props<{ data: PageData }>();

    const columns = [
        {
            key: "order_number",
            label: "No. Pesanan",
            render: (val: any, item: any) => `
                <div class="font-bold">${val}</div>
                <div class="text-xs opacity-50">${item.tracking_code?.substring(0, 8)}...</div>
            `,
        },
        {
            key: "customer",
            label: "Customer",
            render: (val: any) => `
                <div class="font-bold">${val.name}</div>
                <div class="text-xs opacity-50">${val.type === "institution" ? "Institusi" : "Perorangan"}</div>
            `,
        },
        {
            key: "status",
            label: "Status",
            render: (val: any) =>
                `<div class="badge badge-outline">${val}</div>`,
        },
        {
            key: "created_at",
            label: "Tanggal",
            render: (val: any) =>
                val ? new Date(val).toLocaleDateString("id-ID") : "-",
        },
    ];
</script>

<PageHeader title="Daftar Pesanan" subtitle="Kelola pesanan jahit">
    {#snippet actions()}
        <a href="/orders/new" class="btn btn-primary">
            <Plus size={20} /> Buat Pesanan
        </a>
    {/snippet}
</PageHeader>

<div class="card bg-base-100 shadow-xl mt-4">
    <div class="card-body p-0">
        <DataTable
            data={data.orders}
            {columns}
            filterable
            emptyMessage="Belum ada pesanan"
        >
            {#snippet rowActions(item)}
                <a
                    href="/orders/{item.id}"
                    class="btn btn-ghost btn-xs"
                    title="Lihat Detail"
                >
                    <Eye size={16} />
                </a>
            {/snippet}
        </DataTable>
    </div>
</div>
