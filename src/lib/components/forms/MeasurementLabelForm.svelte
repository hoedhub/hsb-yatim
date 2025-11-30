<script lang="ts">
	import Input from "$lib/components/ui/input/Input.svelte";
	import Select from "$lib/components/ui/select/Select.svelte";
	import FormControl from "$lib/components/ui/form/FormControl.svelte";
	import FormLabel from "$lib/components/ui/form/FormLabel.svelte";
	import FormMessage from "$lib/components/ui/form/FormMessage.svelte";

	let { form = $bindable() } = $props();

	const unitOptions = [
		{ value: "cm", label: "cm" },
		{ value: "m", label: "m" },
		{ value: "inch", label: "inch" },
	];
</script>

<div class="grid gap-4">
	<FormControl>
		<FormLabel>Nama Label</FormLabel>
		<Input
			id="name"
			name="name"
			bind:value={form.data.name}
			placeholder="Contoh: Lingkar Dada"
		/>
		<FormMessage>{form.errors.name?.[0]}</FormMessage>
	</FormControl>

	<FormControl>
		<FormLabel>Satuan Standar</FormLabel>
		<Select
			id="default_unit"
			name="default_unit"
			bind:value={form.data.default_unit}
			options={unitOptions}
		/>
		<FormMessage>{form.errors.default_unit?.[0]}</FormMessage>
	</FormControl>
</div>
