<script lang="ts">
	import { enhance } from "$app/forms";
	import { dndzone, type DndEvent } from "svelte-dnd-action";
	import { flip } from "svelte/animate";
	import { Plus, X, GripVertical } from "lucide-svelte";
	import type {
		MeasurementLabel,
		MeasurementTemplate,
	} from "$lib/server/db/schema";

	let {
		data = null,
		labels = [],
		action = "?/create",
		onClose,
	} = $props<{
		data?:
			| (MeasurementTemplate & {
					templateLabels?: { label: MeasurementLabel }[];
			  })
			| null;
		labels: MeasurementLabel[];
		action?: string;
		onClose: () => void;
	}>();

	let name = $state(data?.name ?? "");
	let description = $state(data?.description ?? "");
	let selectedLabels = $state<MeasurementLabel[]>(
		data?.templateLabels?.map((tl: any) => tl.label) ?? [],
	);
	let selectedLabelId = $state<string>("");

	// Filter available labels (exclude already selected)
	let availableLabels = $derived(
		labels.filter(
			(l: MeasurementLabel) =>
				!selectedLabels.find((sl) => sl.id === l.id),
		),
	);

	function addLabel() {
		if (!selectedLabelId) return;
		const label = labels.find(
			(l: MeasurementLabel) => l.id.toString() === selectedLabelId,
		);
		if (label) {
			selectedLabels = [...selectedLabels, label];
			selectedLabelId = "";
		}
	}

	function removeLabel(id: number) {
		selectedLabels = selectedLabels.filter((l) => l.id !== id);
	}

	const flipDurationMs = 300;
	function handleDndConsider(e: CustomEvent<DndEvent<MeasurementLabel>>) {
		selectedLabels = e.detail.items;
	}
	function handleDndFinalize(e: CustomEvent<DndEvent<MeasurementLabel>>) {
		selectedLabels = e.detail.items;
	}
</script>

<form
	method="POST"
	{action}
	use:enhance={() => {
		return async ({ result, update }) => {
			if (result.type === "success") {
				onClose();
				await update();
			}
		};
	}}
	class="space-y-4"
>
	{#if data?.id}
		<input type="hidden" name="id" value={data.id} />
	{/if}

	<!-- Serialize selected labels IDs for submission -->
	<input
		type="hidden"
		name="labels"
		value={JSON.stringify(selectedLabels.map((l) => l.id))}
	/>

	<div class="form-control w-full">
		<label class="label" for="name">
			<span class="label-text">Nama Template</span>
		</label>
		<input
			type="text"
			id="name"
			name="name"
			bind:value={name}
			placeholder="Contoh: Kemeja Pria"
			class="input input-bordered w-full"
			required
			minlength="2"
		/>
	</div>

	<div class="form-control w-full">
		<label class="label" for="description">
			<span class="label-text">Deskripsi (Opsional)</span>
		</label>
		<textarea
			id="description"
			name="description"
			bind:value={description}
			placeholder="Deskripsi singkat template..."
			class="textarea textarea-bordered h-24"
		></textarea>
	</div>

	<div class="divider">Pengaturan Label Ukuran</div>

	<div class="form-control w-full">
		<label class="label" for="label-select">
			<span class="label-text">Tambah Label</span>
		</label>
		<div class="flex gap-2">
			<select
				id="label-select"
				bind:value={selectedLabelId}
				class="select select-bordered flex-1"
			>
				<option value="" disabled selected
					>Pilih label untuk ditambahkan...</option
				>
				{#each availableLabels as label}
					<option value={label.id.toString()}
						>{label.name} ({label.default_unit})</option
					>
				{/each}
			</select>
			<button
				type="button"
				class="btn btn-primary"
				onclick={addLabel}
				disabled={!selectedLabelId}
			>
				<Plus class="h-4 w-4" />
				Tambah
			</button>
		</div>
	</div>

	<div class="mt-4">
		<h4 class="mb-2 text-sm font-medium">
			Label Terpilih (Drag untuk mengurutkan)
		</h4>
		{#if selectedLabels.length === 0}
			<div class="alert alert-info text-sm">
				Belum ada label yang dipilih. Tambahkan label di atas.
			</div>
		{:else}
			<div
				use:dndzone={{ items: selectedLabels, flipDurationMs }}
				onconsider={handleDndConsider}
				onfinalize={handleDndFinalize}
				class="space-y-2 rounded-box bg-base-200 p-2"
			>
				{#each selectedLabels as label (label.id)}
					<div
						class="flex items-center justify-between rounded-lg bg-base-100 p-3 shadow-sm"
						animate:flip={{ duration: flipDurationMs }}
					>
						<div class="flex items-center gap-3">
							<GripVertical
								class="h-5 w-5 cursor-move text-base-content/50"
							/>
							<div>
								<span class="font-medium">{label.name}</span>
								<span
									class="ml-2 text-xs text-base-content/60 badge badge-ghost badge-sm"
									>{label.default_unit}</span
								>
							</div>
						</div>
						<button
							type="button"
							class="btn btn-ghost btn-xs text-error"
							onclick={() => removeLabel(label.id)}
						>
							<X class="h-4 w-4" />
						</button>
					</div>
				{/each}
			</div>
		{/if}
	</div>

	<div class="modal-action">
		<button type="button" class="btn" onclick={onClose}>Batal</button>
		<button type="submit" class="btn btn-primary">Simpan</button>
	</div>
</form>
