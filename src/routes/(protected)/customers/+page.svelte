<script lang="ts">
    import { enhance } from "$app/forms";
    import PageHeader from "$lib/components/layout/PageHeader.svelte";
    import DataTable from "$lib/components/ui/table/DataTable.svelte";
    import CustomerForm from "$lib/components/forms/CustomerForm.svelte";
    import ConfirmDialog from "$lib/components/ui/ConfirmDialog.svelte";
    import { Plus, Pencil, Trash2, Building2, User } from "lucide-svelte";
    import type { PageData } from "./$types";
    import type { Customer } from "$lib/server/db/schema";

    let { data } = $props<{ data: PageData }>();

    let isCreateModalOpen = $state(false);
    let isEditModalOpen = $state(false);
    let isDeleteModalOpen = $state(false);
    let selectedCustomer = $state<Customer | null>(null);

    const columns = [
        {
            key: "name",
            label: "Nama",
            sortable: true,
        },
        {
            key: "type",
            label: "Tipe",
            render: (val: string) =>
                val === "individual"
                    ? '<span class="badge badge-primary badge-sm">Perorangan</span>'
                    : '<span class="badge badge-secondary badge-sm">Institusi</span>',
            align: "center" as const,
        },
        {
            key: "institution_name",
            label: "Institusi",
            render: (val: string | null) => val || "-",
        },
        {
            key: "phone",
            label: "Telepon",
            render: (val: string | null) => val || "-",
        },
    ];

    function handleEdit(customer: Customer) {
        selectedCustomer = customer;
        isEditModalOpen = true;
    }

    function handleDelete(customer: Customer) {
        selectedCustomer = customer;
        isDeleteModalOpen = true;
    }

    function closeModals() {
        isCreateModalOpen = false;
        isEditModalOpen = false;
        isDeleteModalOpen = false;
        selectedCustomer = null;
    }
</script>

<PageHeader title="Data Customer" subtitle="Kelola data pelanggan">
    {#snippet actions()}
        <button
            class="btn btn-primary"
            onclick={() => (isCreateModalOpen = true)}
        >
            <Plus class="h-4 w-4" />
            Customer Baru
        </button>
    {/snippet}
</PageHeader>

<div class="mt-6">
    <DataTable data={data.customers} {columns} filterable paginated>
        {#snippet rowActions(item)}
            <div class="flex justify-end gap-2">
                <button
                    class="btn btn-square btn-ghost btn-sm"
                    onclick={() => handleEdit(item)}
                    title="Edit"
                >
                    <Pencil class="h-4 w-4" />
                </button>

                <button
                    class="btn btn-square btn-ghost btn-sm text-error"
                    onclick={() => handleDelete(item)}
                    title="Hapus"
                >
                    <Trash2 class="h-4 w-4" />
                </button>
            </div>
        {/snippet}

        {#snippet emptyIcon()}
            <div class="p-4 bg-base-200 rounded-full">
                <User class="h-8 w-8 text-base-content/30" />
            </div>
        {/snippet}
    </DataTable>
</div>

<!-- Create Modal -->
{#if isCreateModalOpen}
    <div class="modal modal-open">
        <div class="modal-box w-11/12 max-w-2xl">
            <h3 class="font-bold text-lg mb-4">Tambah Customer Baru</h3>
            <CustomerForm onClose={closeModals} />
        </div>
        <!-- svelte-ignore a11y_click_events_have_key_events -->
        <!-- svelte-ignore a11y_no_static_element_interactions -->
        <div class="modal-backdrop" onclick={closeModals}></div>
    </div>
{/if}

<!-- Edit Modal -->
{#if isEditModalOpen && selectedCustomer}
    <div class="modal modal-open">
        <div class="modal-box w-11/12 max-w-2xl">
            <h3 class="font-bold text-lg mb-4">Edit Customer</h3>
            <CustomerForm
                data={selectedCustomer}
                action="?/update"
                onClose={closeModals}
            />
        </div>
        <!-- svelte-ignore a11y_click_events_have_key_events -->
        <!-- svelte-ignore a11y_no_static_element_interactions -->
        <div class="modal-backdrop" onclick={closeModals}></div>
    </div>
{/if}

<!-- Delete Confirmation -->
<ConfirmDialog
    open={isDeleteModalOpen}
    title="Hapus Customer"
    message={`Apakah Anda yakin ingin menghapus customer "${selectedCustomer?.name}"?`}
    confirmLabel="Hapus"
    cancelLabel="Batal"
    variant="error"
    onConfirm={() => {
        const form = document.getElementById("delete-form") as HTMLFormElement;
        if (form) form.requestSubmit();
    }}
    onCancel={closeModals}
/>

<form
    id="delete-form"
    method="POST"
    action="?/delete"
    use:enhance={() => {
        return async ({ result, update }) => {
            if (result.type === "success") {
                closeModals();
                await update();
            }
        };
    }}
    class="hidden"
>
    <input type="hidden" name="id" value={selectedCustomer?.id} />
</form>
