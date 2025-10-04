<script lang="ts">
	import { useForm } from 'svelte-simple-form';
	import { measurementLabelSchema } from '$lib/schemas';
	import Button from '$lib/components/ui/button/Button.svelte';
	import Input from '$lib/components/ui/input/Input.svelte';
	import Select from '$lib/components/ui/select/Select.svelte';
	import FormControl from '$lib/components/ui/form/FormControl.svelte';
	import FormLabel from '$lib/components/ui/form/FormLabel.svelte';
	import FormMessage from '$lib/components/ui/form/FormMessage.svelte';

	const { form } = useForm({
		initialValues: {
			name: '',
			default_unit: 'cm'
		},
		validation: { zod: measurementLabelSchema },
		onSubmit: async (values) => {
			// TODO: Implement actual form submission
			console.log('Form submitted:', values);
			alert('Form submitted! Check console.');
		}
	});
</script>

<form use:form.handler>
	<div class="grid gap-4">
		<FormControl>
			<FormLabel>Nama Label</FormLabel>
			<Input id="name" name="name" bind:value={form.data.name} />
			<FormMessage>{form.errors.name?.[0]}</FormMessage>
		</FormControl>

		<FormControl>
			<FormLabel>Satuan Standar</FormLabel>
			<Select id="default_unit" name="default_unit" bind:value={form.data.default_unit}>
				<option value="cm">cm</option>
				<option value="m">m</option>
				<option value="inch">inch</option>
			</Select>
			<FormMessage>{form.errors.default_unit?.[0]}</FormMessage>
		</FormControl>
	</div>

	<div class="mt-6 flex justify-end">
		<Button type="submit" disabled={form.isSubmitting}>Simpan</Button>
	</div>
</form>
