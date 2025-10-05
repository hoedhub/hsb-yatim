<script lang="ts">
	import { useForm } from 'svelte-simple-form';
	import { measurementTemplateSchema } from '$lib/schemas';
	import { dndzone, type DndEvent } from 'svelte-dnd-action';
	import Button from '$lib/components/ui/button/Button.svelte';
	import Input from '$lib/components/ui/input/Input.svelte';
	import Textarea from '$lib/components/ui/textarea/Textarea.svelte';
	import FormControl from '$lib/components/ui/form/FormControl.svelte';
	import FormLabel from '$lib/components/ui/form/FormLabel.svelte';
	import FormMessage from '$lib/components/ui/form/FormMessage.svelte';

	interface LabelItem {
		id: number;
		name: string;
	}

	// Mock data for available labels
	let availableLabels = $state<LabelItem[]>([
		{ id: 1, name: 'Lingkar Dada' },
		{ id: 2, name: 'Panjang Lengan' },
		{ id: 3, name: 'Lingkar Pinggang' },
		{ id: 4, name: 'Panjang Celana' },
		{ id: 5, name: 'Lebar Bahu' }
	]);

	let selectedLabels = $state<LabelItem[]>([]);

	const { form } = useForm({
		initialValues: {
			name: '',
			description: '',
			labels: [] as number[]
		},
		validation: { zod: measurementTemplateSchema },
		onSubmit: async (values) => {
			// TODO: Implement actual form submission
			console.log('Form submitted:', values);
			alert('Form submitted! Check console.');
		}
	});

	// Function to update form.data.labels whenever selectedLabels changes
	$effect(() => {
		form.data.labels = selectedLabels.map((item) => item.id);
	});

	function handleDndConsider(event: CustomEvent<DndEvent<LabelItem>>) {
		const { items } = event.detail;
		const currentTarget = event.currentTarget as HTMLElement;
		if (currentTarget && currentTarget.id === 'available-zone') {
			availableLabels = items;
		} else if (currentTarget && currentTarget.id === 'selected-zone') {
			selectedLabels = items;
		}
	}

	function handleDndFinalize(event: CustomEvent<DndEvent<LabelItem>>) {
		const { items } = event.detail;
		const currentTarget = event.currentTarget as HTMLElement;
		if (currentTarget && currentTarget.id === 'available-zone') {
			availableLabels = items;
		} else if (currentTarget && currentTarget.id === 'selected-zone') {
			selectedLabels = items;
		}
	}
</script>

<form use:form.handler>
	<div class="grid grid-cols-1 md:grid-cols-2 gap-8">
		<div>
			<FormControl>
				<FormLabel>Nama Template</FormLabel>
				<Input id="name" name="name" bind:value={form.data.name} />
				<FormMessage>{form.errors.name?.[0]}</FormMessage>
			</FormControl>

			<div class="mt-4">
				<FormControl>
					<FormLabel>Deskripsi</FormLabel>
					<Textarea id="description" name="description" bind:value={form.data.description} />
					<FormMessage>{form.errors.description?.[0]}</FormMessage>
				</FormControl>
			</div>

			<div class="mt-6">
				<h3 class="font-semibold mb-2">Live Preview</h3>
				<div class="p-4 border rounded-md bg-base-200 min-h-[100px]">
					{#each selectedLabels as item (item.id)}
						<div class="p-2 bg-base-100 rounded-md mb-2">{item.name}</div>
					{/each}
					{#if selectedLabels.length === 0}
						<div class="text-center text-neutral-500">Drag labels here</div>
					{/if}
				</div>
			</div>
		</div>

		<div class="grid grid-cols-2 gap-4">
			<div>
				<h3 class="font-semibold mb-2 text-center">Label Tersedia</h3>
				<div
					id="available-zone"
					class="p-4 border rounded-md min-h-[300px] bg-base-200"
					use:dndzone={{ items: availableLabels, type: 'label' }}
					onconsider={handleDndConsider}
					onfinalize={handleDndFinalize}
				>
					{#each availableLabels as item (item.id)}
						<div class="p-2 bg-base-100 rounded-md mb-2 cursor-grab">
							{item.name}
						</div>
					{/each}
				</div>
			</div>
			<div>
				<h3 class="font-semibold mb-2 text-center">Label Dipilih</h3>
				<div
					id="selected-zone"
					class="p-4 border rounded-md min-h-[300px] bg-base-200"
					use:dndzone={{ items: selectedLabels, type: 'label' }}
					onconsider={handleDndConsider}
					onfinalize={handleDndFinalize}
				>
					{#each selectedLabels as item (item.id)}
						<div class="p-2 bg-base-100 rounded-md mb-2 cursor-grab">
							{item.name}
						</div>
					{/each}
				</div>
			</div>
		</div>
	</div>

	<div class="mt-6 flex justify-end">
		<Button type="submit" disabled={form.isSubmitting}>Simpan Template</Button>
		<Button type="button" onclick={() => form.reset()} class="ml-2">Reset</Button>
	</div>
</form>