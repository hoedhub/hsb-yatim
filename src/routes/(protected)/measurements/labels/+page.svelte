<script lang="ts">
    import { invalidateAll } from "$app/navigation";
    import { page } from "$app/stores";
    import { enhance } from "$app/forms";
    import PageHeader from "$lib/components/layout/PageHeader.svelte";
    import { Button, DataTable, ConfirmDialog } from "$lib/components/ui";
    import Input from "$lib/components/ui/input/Input.svelte";
    import Select from "$lib/components/ui/select/Select.svelte";
    import FormControl from "$lib/components/ui/form/FormControl.svelte";
    import FormLabel from "$lib/components/ui/form/FormLabel.svelte";
    import { Plus, Pencil, Trash2, RefreshCw, Filter } from "lucide-svelte";
    import type { PageData } from "./$types";

    let { data } = $props();

    // State
    let showInactive = $state(data.showInactive);
    let isDialogOpen = $state(false);
    let isConfirmOpen = $state(false);
    let editingId = $state<number | null>(null);
    let deletingId = $state<number | null>(null);
    let deletingLabelName = $state("");
    let isReactivating = $state(false);
    let isSubmitting = $state(false);

    // Form data
    let formData = $state({
        name: "",
        default_unit: "cm",
    });

    const unitOptions = [
        { value: "cm", label: "cm" },
        { value: "m", label: "m" },
        { value: "inch", label: "inch" },
    ];

    // Actions
    function handleAdd() {
        editingId = null;
        formData = { name: "", default_unit: "cm" };
        isDialogOpen = true;
    }

    function handleEdit(row: any) {
        editingId = row.id;
        formData = {
            name: row.name,
            default_unit: row.default_unit || "cm",
        };
        isDialogOpen = true;
    }

    function handleDeleteClick(row: any) {
        deletingId = row.id;
        deletingLabelName = row.name;
        isConfirmOpen = true;
    }

    async function handleConfirmDelete() {
        if (!deletingId) return;

        const formDataObj = new FormData();
        formDataObj.append("id", deletingId.toString());

        try {
            await fetch("?/delete", {
                method: "POST",
                body: formDataObj,
            });
            await invalidateAll();
            isConfirmOpen = false;
        } catch (error) {
            console.error("Delete error:", error);
        }
    }

    async function handleReactivate(id: number) {
        const formDataObj = new FormData();
        formDataObj.append("id", id.toString());

        try {
            isReactivating = true;
            await fetch("?/reactivate", {
                method: "POST",
                body: formDataObj,
            });
            await invalidateAll();
        } catch (error) {
            console.error("Reactivate error:", error);
        } finally {
            isReactivating = false;
        }
    }

    function toggleFilter() {
        const url = new URL($page.url);
        if (showInactive) {
            url.searchParams.delete("show_inactive");
        } else {
            url.searchParams.set("show_inactive", "true");
        }
        window.location.href = url.toString();
    }

    // Table configuration
    const columns = [
        { key: "name", label: "Nama Label", sortable: true },
        { key: "default_unit", label: "Satuan", sortable: true },
        {
            key: "is_active",
            label: "Status",
            sortable: true,
            render: (val: boolean) =>
                val
                    ? '<span class="badge badge-success badge-sm">Aktif</span>'
                    : '<span class="badge badge-ghost badge-sm">Non-aktif</span>',
        },
    ];
</script>

<div class="min-h-screen bg-base-200/30">
    <PageHeader
        title="Label Pengukuran"
        subtitle="Kelola jenis-jenis ukuran yang digunakan dalam template"
    >
        {#snippet actions()}
            <div class="flex gap-2">
                <Button
                    variant={showInactive ? "secondary" : "outline"}
                    size="sm"
                    onclick={toggleFilter}
                >
                    <Filter class="h-4 w-4 mr-2" />
                    {showInactive ? "Sembunyikan Arsip" : "Tampilkan Arsip"}
                </Button>
                <Button onclick={handleAdd} size="sm">
                    <Plus class="h-4 w-4 mr-2" />
                    Tambah Label
                </Button>
            </div>
        {/snippet}
    </PageHeader>

    <div class="container mx-auto px-4 py-8">
        <div class="bg-base-100 rounded-box shadow-sm border border-base-300">
            <DataTable data={data.labels} {columns} filterable>
                {#snippet rowActions(row: any)}
                    <div class="flex justify-end gap-1">
                        {#if row.is_active}
                            <Button
                                variant="ghost"
                                size="sm"
                                class="btn-square"
                                onclick={() => handleEdit(row)}
                            >
                                <Pencil class="h-4 w-4 text-warning" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                class="btn-square"
                                onclick={() => handleDeleteClick(row)}
                            >
                                <Trash2 class="h-4 w-4 text-error" />
                            </Button>
                        {:else}
                            <Button
                                variant="ghost"
                                size="sm"
                                class="btn-square"
                                onclick={() => handleReactivate(row.id)}
                                disabled={isReactivating}
                            >
                                <RefreshCw class="h-4 w-4 text-success" />
                            </Button>
                        {/if}
                    </div>
                {/snippet}
            </DataTable>
        </div>
    </div>

    <!-- Form Dialog -->
    {#if isDialogOpen}
        <div
            class="modal modal-open"
            onclick={(e) =>
                e.target === e.currentTarget && (isDialogOpen = false)}
            role="dialog"
            tabindex="-1"
        >
            <div class="modal-box">
                <div class="flex items-start justify-between mb-4">
                    <h3 class="font-bold text-lg">
                        {editingId ? "Edit Label" : "Tambah Label"}
                    </h3>
                    <button
                        class="btn btn-sm btn-circle btn-ghost"
                        onclick={() => (isDialogOpen = false)}
                        aria-label="Close"
                        type="button"
                    >
                        ✕
                    </button>
                </div>

                <form
                    method="POST"
                    action="?/{editingId ? 'update' : 'create'}"
                    use:enhance={() => {
                        isSubmitting = true;
                        return async ({ result, update }) => {
                            isSubmitting = false;
                            if (result.type === "success") {
                                isDialogOpen = false;
                                await update();
                            } else {
                                await update();
                            }
                        };
                    }}
                >
                    {#if editingId}
                        <input type="hidden" name="id" value={editingId} />
                    {/if}

                    <div class="grid gap-4">
                        <FormControl>
                            <FormLabel>Nama Label</FormLabel>
                            <Input
                                id="name"
                                name="name"
                                bind:value={formData.name}
                                placeholder="Contoh: Lingkar Dada"
                                required
                            />
                        </FormControl>

                        <FormControl>
                            <FormLabel>Satuan Standar</FormLabel>
                            <Select
                                id="default_unit"
                                name="default_unit"
                                bind:value={formData.default_unit}
                                options={unitOptions}
                            />
                        </FormControl>
                    </div>

                    <div class="modal-action">
                        <Button
                            variant="ghost"
                            type="button"
                            onclick={() => (isDialogOpen = false)}
                        >
                            Batal
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {editingId ? "Simpan Perubahan" : "Buat Label"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    {/if}

    <!-- Confirm Dialog -->
    <ConfirmDialog
        bind:open={isConfirmOpen}
        title="Hapus Label"
        message="Apakah Anda yakin ingin menghapus label '{deletingLabelName}'? Jika label ini sudah digunakan, label akan diarsipkan. Jika belum, akan dihapus permanen."
        confirmText="Ya, Hapus"
        cancelText="Batal"
        dangerous={true}
        onConfirm={handleConfirmDelete}
    />
</div>
