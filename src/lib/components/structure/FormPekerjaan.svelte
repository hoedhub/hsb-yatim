<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { editPekerjaan, modified } from '$lib/stores';
	import { onDestroy, onMount } from 'svelte';
	import { db } from '$lib/utils/db';
	import { confirm } from '@tauri-apps/api/dialog';
	import { toast } from 'svelte-sonner';

	export let namaPekerjaan = '';
	export let row: Record<string, any> = {};
	export let onCancel = () => null;
	let formFields = { pekerjaan: namaPekerjaan, alokasi: row.alokasi ? row.alokasi : '0' };
	let feedback = { pekerjaan: '', alokasi: '' };
	let focused = { pekerjaan: false, alokasi: false };
	$: if (focused.alokasi) {
		if (!feedback.alokasi) formFields.alokasi = formFields.alokasi.replace(/\D/g, '');
		feedback.alokasi = '';
		if (/\D/g.test(formFields.alokasi)) feedback.alokasi = 'Ketik angka saja';
	} else {
		if (!/\D/g.test(formFields.alokasi))
			formFields.alokasi = new Intl.NumberFormat('id-ID', {
				style: 'currency',
				currency: 'IDR',
				minimumFractionDigits: 0,
				maximumFractionDigits: 0
			}).format(Number(formFields.alokasi));
	}
	let defaultFields: string;
	let mounted = false;
	onMount(() => {
		defaultFields = JSON.stringify(formFields);
		mounted = true;
	});

	onDestroy(() => {
		if (row && $editPekerjaan.includes(row.id))
			$editPekerjaan = $editPekerjaan.filter((id) => id !== row.id);
	});

	$: if (mounted) {
		const defaultObj = JSON.parse(defaultFields);
		const isModified = Object.keys(defaultObj).some((key) => {
			return (
				defaultObj[key as keyof typeof formFields] !== (formFields as Record<string, string>)[key]
			);
		});
		if ($modified[namaPekerjaan] !== isModified)
			$modified = {
				...$modified,
				[namaPekerjaan]: isModified
			};
	}

	const onReset = async () => {
		console.log('row', row);
		if ($modified[namaPekerjaan]) {
			const doReset = await confirm('Yakin reset form?', 'HSB Yatim');
			if (doReset) formFields = { ...JSON.parse(defaultFields) };
		}
	};
	let saving: boolean;
	async function simpanPekerjaan() {
		if (saving) return;
		saving = true;
		let status = '';
		try {
			// Add the new friend!
			let id;
			if (row) {
				id = row.id;
				await db.pekerjaan.update(id, {
					pekerjaan: formFields.pekerjaan,
					alokasi: Number(formFields.alokasi.replace(/\D/g, '')),
					tanggal_masuk: row.tanggal_masuk,
					status: row.status
				});
			} else
				id = await db.pekerjaan.add({
					pekerjaan: formFields.pekerjaan,
					alokasi: Number(formFields.alokasi.replace(/\D/g, '')),
					tanggal_masuk: new Date(),
					status: 'baru'
				});

			status = `Pekerjaan ${formFields.pekerjaan} berhasil disimpan${row ? '' : ` dengan id ${id}`}`;
			toast.success(status);

			// Reset form:
			formFields = JSON.parse(defaultFields);
			onCancel();
		} catch (error) {
			status = `Gagal menyimpan pekerjaan ${formFields.pekerjaan}: ${error}`;
			toast.error(status);
			console.error(status);
		} finally {
			saving = false;
		}
	}
</script>

<Card.Root class="w-full">
	<Card.Header>
		<Card.Title>Tambah Pekerjaan</Card.Title>
		<Card.Description>Deploy your new project in oneclick.</Card.Description>
	</Card.Header>
	<Card.Content>
		<form>
			<div class="grid w-full items-center gap-4">
				<div class="flex flex-col space-y-1.5">
					<Label for="name">Nama Pekerjaan</Label>
					<Input id="name" placeholder="Proyek Baru" bind:value={formFields.pekerjaan} required />
				</div>
				<div class="flex flex-col space-y-1.5">
					<Label for="name">Alokasi Dana</Label>
					<Input
						id="name"
						placeholder="Rp xx.xxxx.xxx,"
						pattern="\d*"
						title="Ketik angka saja"
						bind:value={formFields.alokasi}
						on:focus={() => (focused.alokasi = true)}
						on:blur={() => (focused.alokasi = false)}
					/>
					<p class="text-sm text-red-500">{feedback.alokasi}</p>
				</div>
			</div>
		</form>
	</Card.Content>
	<Card.Footer class="flex flex-row-reverse items-center justify-between">
		<Button
			disabled={!($modified[namaPekerjaan] && formFields.pekerjaan)}
			type="button"
			on:click={simpanPekerjaan}>Simpan</Button
		>
		<div class="flex space-x-4">
			<Button
				type="button"
				variant="outline"
				class="tex-tred-800 ring-1 ring-red-500"
				on:click={onCancel}
			>
				Batal
			</Button>
			<Button
				type="button"
				variant="outline"
				class="bg-gray-200 text-orange-500 ring-1 ring-orange-500"
				on:click={onReset}>Reset Form</Button
			>
		</div>
	</Card.Footer>
</Card.Root>
