<script lang="ts">
    import { enhance } from "$app/forms";
    import SearchInput from "$lib/components/ui/SearchInput.svelte";
    import {
        ChevronRight,
        ChevronLeft,
        User,
        FileText,
        Save,
    } from "lucide-svelte";
    import type { PageData } from "./$types";

    let { data } = $props<{ data: PageData }>();

    let currentStep = $state(1);
    let selectedCustomerId = $state<number | null>(null);
    let selectedTemplateIds = $state<number[]>([]);
    let measurements = $state<Record<string, string>>({}); // key: templateId_labelId
    let searchQuery = $state("");

    // Derived values
    let filteredCustomers = $derived(
        data.customers.filter(
            (c: (typeof data.customers)[number]) =>
                c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (c.phone && c.phone.includes(searchQuery)),
        ),
    );

    let selectedCustomer = $derived(
        data.customers.find(
            (c: (typeof data.customers)[number]) => c.id === selectedCustomerId,
        ),
    );

    let selectedTemplates = $derived(
        data.templates.filter((t: (typeof data.templates)[number]) =>
            selectedTemplateIds.includes(t.id),
        ),
    );

    function nextStep() {
        if (currentStep < 4) currentStep++;
    }

    function prevStep() {
        if (currentStep > 1) currentStep--;
    }

    function toggleTemplate(id: number) {
        if (selectedTemplateIds.includes(id)) {
            selectedTemplateIds = selectedTemplateIds.filter(
                (tid) => tid !== id,
            );
        } else {
            selectedTemplateIds = [...selectedTemplateIds, id];
        }
    }
</script>

<div class="container mx-auto p-4 max-w-4xl">
    <!-- Stepper Header -->
    <ul class="steps w-full mb-8">
        <li class="step {currentStep >= 1 ? 'step-primary' : ''}">
            Pilih Customer
        </li>
        <li class="step {currentStep >= 2 ? 'step-primary' : ''}">
            Pilih Model
        </li>
        <li class="step {currentStep >= 3 ? 'step-primary' : ''}">Ukuran</li>
        <li class="step {currentStep >= 4 ? 'step-primary' : ''}">Review</li>
    </ul>

    <div class="card bg-base-100 shadow-xl">
        <div class="card-body">
            <!-- Step 1: Customer Selection -->
            {#if currentStep === 1}
                <h2 class="card-title mb-4">Pilih Customer</h2>
                <div class="mb-4">
                    <SearchInput
                        bind:value={searchQuery}
                        placeholder="Cari nama atau telepon..."
                    />
                </div>

                <div class="overflow-x-auto h-96">
                    <table class="table table-pin-rows">
                        <thead>
                            <tr>
                                <th></th>
                                <th>Nama</th>
                                <th>Tipe</th>
                                <th>Telepon</th>
                            </tr>
                        </thead>
                        <tbody>
                            {#each filteredCustomers as customer}
                                <tr
                                    class="hover cursor-pointer {selectedCustomerId ===
                                    customer.id
                                        ? 'bg-base-200'
                                        : ''}"
                                    onclick={() =>
                                        (selectedCustomerId = customer.id)}
                                >
                                    <td>
                                        <input
                                            type="radio"
                                            name="customer"
                                            class="radio radio-primary"
                                            checked={selectedCustomerId ===
                                                customer.id}
                                            readonly
                                        />
                                    </td>
                                    <td>
                                        <div class="font-bold">
                                            {customer.name}
                                        </div>
                                        {#if customer.institution_name}
                                            <div class="text-xs opacity-50">
                                                {customer.institution_name}
                                            </div>
                                        {/if}
                                    </td>
                                    <td>
                                        <div
                                            class="badge {customer.type ===
                                            'institution'
                                                ? 'badge-secondary'
                                                : 'badge-ghost'}"
                                        >
                                            {customer.type === "institution"
                                                ? "Institusi"
                                                : "Perorangan"}
                                        </div>
                                    </td>
                                    <td>{customer.phone || "-"}</td>
                                </tr>
                            {/each}
                        </tbody>
                    </table>
                </div>
            {/if}

            <!-- Step 2: Template Selection -->
            {#if currentStep === 2}
                <h2 class="card-title mb-4">Pilih Model / Template</h2>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {#each data.templates as template}
                        <div
                            class="card border-2 cursor-pointer transition-all hover:border-primary {selectedTemplateIds.includes(
                                template.id,
                            )
                                ? 'border-primary bg-primary/5'
                                : 'border-base-200'}"
                            onclick={() => toggleTemplate(template.id)}
                            onkeydown={(e) =>
                                e.key === "Enter" &&
                                toggleTemplate(template.id)}
                            role="button"
                            tabindex="0"
                        >
                            <div class="card-body p-4">
                                <div class="flex items-center justify-between">
                                    <h3 class="font-bold">{template.name}</h3>
                                    <input
                                        type="checkbox"
                                        class="checkbox checkbox-primary"
                                        checked={selectedTemplateIds.includes(
                                            template.id,
                                        )}
                                        readonly
                                    />
                                </div>
                                {#if template.description}
                                    <p class="text-sm opacity-70">
                                        {template.description}
                                    </p>
                                {/if}
                                <div class="mt-2 text-xs opacity-50">
                                    {template.templateLabels.length} ukuran
                                </div>
                            </div>
                        </div>
                    {/each}
                </div>
            {/if}

            <!-- Step 3: Measurements -->
            {#if currentStep === 3}
                <h2 class="card-title mb-4">Input Ukuran</h2>
                <div class="space-y-6">
                    {#each selectedTemplates as template}
                        <div class="collapse collapse-arrow bg-base-200">
                            <input type="checkbox" checked />
                            <div class="collapse-title text-xl font-medium">
                                {template.name}
                            </div>
                            <div class="collapse-content bg-base-100 pt-4">
                                <div
                                    class="grid grid-cols-1 md:grid-cols-2 gap-4"
                                >
                                    {#each template.templateLabels as tl}
                                        <div class="form-control">
                                            <label
                                                class="label"
                                                for="m_{template.id}_{tl.label
                                                    .id}"
                                            >
                                                <span class="label-text"
                                                    >{tl.label.name}</span
                                                >
                                                {#if tl.label.default_unit}
                                                    <span class="label-text-alt"
                                                        >({tl.label
                                                            .default_unit})</span
                                                    >
                                                {/if}
                                            </label>
                                            <input
                                                type="text"
                                                id="m_{template.id}_{tl.label
                                                    .id}"
                                                bind:value={
                                                    measurements[
                                                        `${template.id}_${tl.label.id}`
                                                    ]
                                                }
                                                class="input input-bordered"
                                            />
                                        </div>
                                    {/each}
                                </div>
                            </div>
                        </div>
                    {/each}
                </div>
            {/if}

            <!-- Step 4: Review -->
            {#if currentStep === 4}
                <h2 class="card-title mb-4">Review Pesanan</h2>

                <div class="space-y-6">
                    <div class="bg-base-200 p-4 rounded-lg">
                        <h3 class="font-bold flex items-center gap-2 mb-2">
                            <User size={16} /> Customer
                        </h3>
                        <p class="text-lg">{selectedCustomer?.name}</p>
                        {#if selectedCustomer?.institution_name}
                            <p class="opacity-70">
                                {selectedCustomer.institution_name}
                            </p>
                        {/if}
                        <p class="opacity-70">
                            {selectedCustomer?.phone || "No phone"}
                        </p>
                    </div>

                    <div class="bg-base-200 p-4 rounded-lg">
                        <h3 class="font-bold flex items-center gap-2 mb-2">
                            <FileText size={16} /> Model & Ukuran
                        </h3>
                        {#each selectedTemplates as template}
                            <div class="mb-4 last:mb-0">
                                <h4 class="font-semibold">{template.name}</h4>
                                <div
                                    class="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2 text-sm"
                                >
                                    {#each template.templateLabels as tl}
                                        {#if measurements[`${template.id}_${tl.label.id}`]}
                                            <div
                                                class="flex justify-between bg-base-100 p-2 rounded"
                                            >
                                                <span class="opacity-70"
                                                    >{tl.label.name}:</span
                                                >
                                                <span class="font-mono"
                                                    >{measurements[
                                                        `${template.id}_${tl.label.id}`
                                                    ]}</span
                                                >
                                            </div>
                                        {/if}
                                    {/each}
                                </div>
                            </div>
                        {/each}
                    </div>
                </div>
            {/if}

            <!-- Navigation Buttons -->
            <div class="card-actions justify-between mt-8">
                <button
                    class="btn btn-ghost"
                    onclick={prevStep}
                    disabled={currentStep === 1}
                >
                    <ChevronLeft size={20} /> Kembali
                </button>

                {#if currentStep < 4}
                    <button
                        class="btn btn-primary"
                        onclick={nextStep}
                        disabled={(currentStep === 1 && !selectedCustomerId) ||
                            (currentStep === 2 &&
                                selectedTemplateIds.length === 0)}
                    >
                        Lanjut <ChevronRight size={20} />
                    </button>
                {:else}
                    <form method="POST" action="?/create" use:enhance>
                        <input
                            type="hidden"
                            name="customer_id"
                            value={selectedCustomerId}
                        />
                        <input
                            type="hidden"
                            name="template_ids"
                            value={JSON.stringify(selectedTemplateIds)}
                        />
                        <input
                            type="hidden"
                            name="measurements"
                            value={JSON.stringify(measurements)}
                        />

                        <button type="submit" class="btn btn-primary">
                            <Save size={20} /> Buat Pesanan
                        </button>
                    </form>
                {/if}
            </div>
        </div>
    </div>
</div>
