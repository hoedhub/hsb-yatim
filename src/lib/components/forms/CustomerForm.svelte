<script lang="ts">
	import { useForm } from 'svelte-simple-form';
	import { customerSchema } from '$lib/schemas';
	import Button from '$lib/components/ui/button/Button.svelte';
	import Input from '$lib/components/ui/input/Input.svelte';
	import Select from '$lib/components/ui/select/Select.svelte';
	import Textarea from '$lib/components/ui/textarea/Textarea.svelte';
	import FormControl from '$lib/components/ui/form/FormControl.svelte';
	import FormLabel from '$lib/components/ui/form/FormLabel.svelte';
	import FormMessage from '$lib/components/ui/form/FormMessage.svelte';

	const { form } = useForm({
		initialValues: {
			name: '',
			type: 'individual',
			institution_name: '',
			phone: '',
			address: ''
		},
		validation: { zod: customerSchema },
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
			<FormLabel>Nama</FormLabel>
			<Input id="name" name="name" bind:value={form.data.name} />
			<FormMessage>{form.errors.name?.[0]}</FormMessage>
		</FormControl>

		<FormControl>
			<FormLabel>Tipe</FormLabel>
			<Select id="type" name="type" bind:value={form.data.type}>
				<option value="individual">Perorangan</option>
				<option value="institution">Institusi</option>
			</Select>
			<FormMessage>{form.errors.type?.[0]}</FormMessage>
		</FormControl>

		{#if form.data.type === 'institution'}
			<FormControl>
				<FormLabel>Nama Institusi</FormLabel>
				<Input
					id="institution_name"
					name="institution_name"
					bind:value={form.data.institution_name}
				/>
				<FormMessage>{form.errors.institution_name?.[0]}</FormMessage>
			</FormControl>
		{/if}

		<FormControl>
			<FormLabel>Telepon</FormLabel>
			<Input id="phone" name="phone" bind:value={form.data.phone} />
			<FormMessage>{form.errors.phone?.[0]}</FormMessage>
		</FormControl>

		<FormControl>
			<FormLabel>Alamat</FormLabel>
			<Textarea id="address" name="address" bind:value={form.data.address} />
			<FormMessage>{form.errors.address?.[0]}</FormMessage>
		</FormControl>
	</div>

	<div class="mt-6 flex justify-end">
		<Button type="submit" disabled={form.isSubmitting}>Simpan</Button>
	</div>
</form>
