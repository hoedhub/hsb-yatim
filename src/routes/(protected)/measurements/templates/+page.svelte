<script lang="ts">
    import { enhance } from "$app/forms";
    import PageHeader from "$lib/components/layout/PageHeader.svelte";
    import DataTable from "$lib/components/ui/table/DataTable.svelte";
    import TemplateForm from "$lib/components/forms/TemplateForm.svelte";
    import ConfirmDialog from "$lib/components/ui/ConfirmDialog.svelte";
    import { Plus, Pencil, Trash2, Copy, Ruler } from "lucide-svelte";
    import type { PageData } from "./$types";
    import type { MeasurementTemplate } from "$lib/server/db/schema";

    let { data } = $props<{ data: PageData }>();

    let isCreateModalOpen = $state(false);
    let isEditModalOpen = $state(false);
    let isDeleteModalOpen = $state(false);
    let selectedTemplate = $state<
        (MeasurementTemplate & { templateLabels?: any[] }) | null
    >(null);

    const columns = [
        { key: "name", label: "Nama Template", sortable: true },
        { key: "description", label: "Deskripsi", sortable: true },
        {
            key: "labels_count",
            label: "Jumlah Label",
            render: (_: any, item: any) =>
                item.templateLabels?.length.toString() || "0",
            align: "center" as const,
        },
        {
            key: "is_active",
            label: "Status",
            render: (val: boolean) =>
                val
                    ? '<span class="badge badge-success badge-sm">Aktif</span>'
                    : '<span class="badge badge-ghost badge-sm">Non-aktif</span>',
            align: "center" as const,
        },
    ];

    function handleEdit(template: any) {
        selectedTemplate = template;
        isEditModalOpen = true;
    }

    function handleDelete(template: any) {
        selectedTemplate = template;
        isDeleteModalOpen = true;
    }

    function closeModals() {
        isCreateModalOpen = false;
        isEditModalOpen = false;
        isDeleteModalOpen = false;
        selectedTemplate = null;
    }
</script>

<PageHeader
    title="Template Ukuran"
    subtitle="Kelola template pengukuran untuk pesanan"
>
    {#snippet actions()}
        <button
            class="btn btn-primary"
            onclick={() => (isCreateModalOpen = true)}
        >
            <Plus class="h-4 w-4" />
            Template Baru
        </button>
    {/snippet}
</PageHeader>

<div class="mt-6">
    <DataTable data={data.templates} {columns} filterable paginated>
        {#snippet rowActions(item)}
            <div class="flex justify-end gap-2">
                <form method="POST" action="?/clone" use:enhance>
                    <input type="hidden" name="id" value={item.id} />
                    <button
                        type="submit"
                        class="btn btn-square btn-ghost btn-sm"
                        title="Duplikasi"
                    >
                        <Copy class="h-4 w-4" />
                    </button>
                </form>

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
                <Ruler class="h-8 w-8 text-base-content/30" />
            </div>
        {/snippet}
    </DataTable>
</div>

<!-- Create Modal -->
{#if isCreateModalOpen}
    <div class="modal modal-open">
        <div class="modal-box w-11/12 max-w-3xl">
            <h3 class="font-bold text-lg mb-4">Buat Template Baru</h3>
            <TemplateForm labels={data.labels} onClose={closeModals} />
        </div>
        <!-- svelte-ignore a11y_click_events_have_key_events -->
        <!-- svelte-ignore a11y_no_static_element_interactions -->
        <div class="modal-backdrop" onclick={closeModals}></div>
    </div>
{/if}

<!-- Edit Modal -->
{#if isEditModalOpen && selectedTemplate}
    <div class="modal modal-open">
        <div class="modal-box w-11/12 max-w-3xl">
            <h3 class="font-bold text-lg mb-4">Edit Template</h3>
            <TemplateForm
                data={selectedTemplate}
                labels={data.labels}
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
    title="Hapus Template"
    message={`Apakah Anda yakin ingin menghapus template "${selectedTemplate?.name}"?`}
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
    <input type="hidden" name="id" value={selectedTemplate?.id} />
</form>
