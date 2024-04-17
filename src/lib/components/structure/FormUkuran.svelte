<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { editUkuran, modified } from '$lib/stores';
	import { onDestroy, onMount } from 'svelte';
	import { db } from '$lib/utils/db';
	import { confirm } from '@tauri-apps/api/dialog';
	import { toast } from 'svelte-sonner';
	import * as Select from '../ui/select';
	import Checkbox from '../ui/checkbox/checkbox.svelte';
	import { liveQuery } from 'dexie';

	export let namaOrang = '';
	export let row: Record<string, any> = {};
	export let onCancel = () => null;
	$: dataKerjaan = liveQuery(async () => {
		const data = await db.pekerjaan.toArray();
		return data;
	});

	let formFields: Record<string, any> = {
		pekerjaanId: row?.pekerjaanId ? row.pekerjaanId : null,
		nama: namaOrang,
		jurusan: row?.jurusan ? row.jurusan : '',
		jenis_kelamin: row?.jenis_kelamin ? row.jenis_kelamin : 'Pria/Wanita',
		panjang_baju: row?.panjang_baju ? row.panjang_baju : 0,
		bahu: row?.bahu ? row.bahu : 0,
		tangan_pjg: row?.tangan_pjg ? row.tangan_pjg : 0,
		tangan_pdk: row?.tangan_pdk ? row.tangan_pdk : 0,
		l_tgn_pdk: row?.l_tgn_pdk ? row.l_tgn_pdk : 0,
		l_dada: row?.l_dada ? row.l_dada : 0,
		l_pinggang: row?.l_pinggang ? row.l_pinggang : 0,
		l_pinggul: row?.l_pinggul ? row.l_pinggul : 0,
		leher: row?.leher ? row.leher : 0,
		jumlah_baju: row?.jumlah_baju ? row.jumlah_baju : 0,
		catatan_baju: row?.catatan_baju ? row.catatan_baju : '',
		printed_baju: row?.printed_baju ? row.printed_baju : false,
		panjang_celana: row?.panjang_celana ? row.panjang_celana : 0,
		pinggang: row?.pinggang ? row.pinggang : 0,
		pesak: row?.pesak ? row.pesak : 0,
		paha: row?.paha ? row.paha : 0,
		lutut: row?.lutut ? row.lutut : 0,
		l_bawah: row?.l_bawah ? row.l_bawah : 0,
		pinggul: row?.pinggul ? row.pinggul : 0,
		jumlah_celana: row?.jumlah_celana ? row.jumlah_celana : 0,
		catatan_celana: row?.catatan_celana ? row.catatan_celana : '',
		printed_celana: row?.printed_celana ? row.printed_celana : false
	};
	let feedback = Object.fromEntries(
		Object.entries(formFields).map(([key, value]) => [key, ''])
	) as Record<keyof typeof formFields, string>;
	let defaultFields: string;
	let mounted = false;
	let pekerjaanId: any;
	let jenis_kelamin: any;
	onMount(() => {
		setTimeout(() => {
			if (row?.pekerjaanId) {
				const pekerjaan = $dataKerjaan.find((ln) => ln.id === row.pekerjaanId);
				pekerjaanId = { value: pekerjaan?.id, label: pekerjaan?.pekerjaan };
				jenis_kelamin = { value: row.jenis_kelamin, label: row.jenis_kelamin };
			}
			defaultFields = JSON.stringify(formFields);
			mounted = true;
		});
	});

	onDestroy(() => {
		if (row && $editUkuran.includes(row.id))
			$editUkuran = $editUkuran.filter((id) => id !== row.id);
	});

	$: if (mounted) {
		if (pekerjaanId && pekerjaanId.value && pekerjaanId?.value !== formFields.pekerjaanId)
			formFields.pekerjaanId = pekerjaanId.value;
		if (jenis_kelamin && jenis_kelamin.value && jenis_kelamin?.value !== formFields.jenis_kelamin)
			formFields.jenis_kelamin = jenis_kelamin.value;
		const defaultObj = JSON.parse(defaultFields);
		const isModified = Object.keys(defaultObj).some((key) => {
			return defaultObj[key] != formFields[key];
		});
		if ($modified[namaOrang] !== isModified)
			$modified = {
				...$modified,
				[namaOrang]: isModified
			};
	}

	const onReset = async () => {
		if ($modified[namaOrang]) {
			const doReset = await confirm('Yakin reset form?', 'HSB Yatim');
			if (doReset) {
				if (row?.pekerjaanId) {
					const pekerjaan = $dataKerjaan.find((ln) => ln.id === row.pekerjaanId);
					pekerjaanId = { value: pekerjaan?.id, label: pekerjaan?.pekerjaan };
					jenis_kelamin = { value: row.jenis_kelamin, label: row.jenis_kelamin };
				} else {
					pekerjaanId = { value: '', label: '' };
					jenis_kelamin = { value: '', label: '' };
				}
				setTimeout(() => (formFields = { ...JSON.parse(defaultFields) }));
				feedback = {};
			}
		}
	};

	$: if (formFields.pekerjaanId) feedback.pekerjaanId = '';

	const validateForm = (): boolean => {
		feedback = Object.fromEntries(Object.entries(formFields).map(([key, value]) => [key, '']));
		feedback.pekerjaanId = formFields.pekerjaanId ? '' : 'Pekerjaan belum dipilih';
		feedback.nama = formFields.nama ? '' : 'Pemilik ukuran belum puuya nama';
		feedback.jenis_kelamin =
			formFields.jenis_kelamin !== 'Pria/Wanita' ? '' : 'Jenis kelamin harus jelas';
		feedback.jumlah_baju =
			formFields.jumlah_baju || formFields.jumlah_celana ? '' : 'Jumlah baju kurang banyak';
		feedback.jumlah_celana =
			formFields.jumlah_baju || formFields.jumlah_celana ? '' : 'Jumlah celana kurang banyak';
		if (Object.values(feedback).some((value) => value !== '')) {
			Object.values(feedback).forEach((value) => {
				if (value) toast.error(value);
			});

			return false;
		}
		return true;
	};
	let saving: boolean;
	async function simpanPekerjaan() {
		if (saving) return;
		saving = true;
		if (!validateForm()) return;
		try {
			const { nama, jurusan, jenis_kelamin, pekerjaanId } = formFields;
			const rowOrang = {
				nama,
				jurusan,
				jenis_kelamin,
				pekerjaanId
			};
			const ukuranBaju = {
				panjang: formFields.panjang_baju,
				bahu: formFields.bahu,
				tangan_pjg: formFields.tangan_pjg,
				tangan_pdk: formFields.tangan_pdk,
				l_tgn_pdk: formFields.l_tgn_pdk,
				l_dada: formFields.l_dada,
				l_pinggang: formFields.l_pinggang,
				l_pinggul: formFields.l_pinggul,
				leher: formFields.leher,
				jumlah: formFields.jumlah_baju,
				catatan: formFields.catatan_baju,
				printed: formFields.printed_baju
			};
			const ukuranCelana = {
				panjang: formFields.panjang_celana,
				pinggang: formFields.pinggang,
				pesak: formFields.pesak,
				paha: formFields.paha,
				lutut: formFields.lutut,
				l_bawah: formFields.l_bawah,
				pinggul: formFields.pinggul,
				jumlah: formFields.jumlah_celana,
				catatan: formFields.catatan_celana,
				printed: formFields.printed_celana
			};
			let idOrang, idBaju, idCelana;
			if (row) {
				idOrang = row.id;
				await db.orang.update(idOrang, rowOrang);
				const rowBaju = await db.baju.where('orangId').equals(idOrang).toArray();
				idBaju = rowBaju[0].id;
				await db.baju.update(idBaju, ukuranBaju);
				const rowCelana = await db.celana.where('orangId').equals(idOrang).toArray();
				idCelana = rowCelana[0].id;
				await db.baju.update(idCelana, ukuranCelana);
			} else idOrang = await db.orang.add(rowOrang);

			await Promise.all([
				db.baju.add({ ...ukuranBaju, orangId: idOrang }),
				db.celana.add({ ...ukuranCelana, orangId: idOrang })
			]);

			const status = `Berhasil menambah uukuran baru untuk ${pekerjaanId.label}`;
			formFields = JSON.parse(defaultFields);
			onCancel();
			toast.success(status);
		} catch (error) {
			const status = `Gagal menyimpan ukuran ${formFields.nama} untuk pekerjaan ${pekerjaanId.label}: ${error}`;
			console.error(status);
			toast.error(status);
		} finally {
			saving = false;
		}
	}
</script>

<Card.Root class="fixed bottom-2 left-16 right-2 top-40 overflow-auto">
	<!-- <Card.Header>
		<Card.Title>Tambah Ukuran</Card.Title>
		<Card.Description>Deploy your new project in oneclick.</Card.Description>
	</Card.Header> -->
	<Card.Content class="mt-4">
		<form>
			<div class="grid w-full items-center gap-4">
				<div class="flex flex-col space-y-1.5">
					<Label for="pekerjaan">Pekerjaan</Label>
					<Select.Root bind:selected={pekerjaanId}>
						<Select.Trigger class="w-96">
							<Select.Value placeholder="Nama Pekerjaan" />
						</Select.Trigger>
						<Select.Content>
							{#each $dataKerjaan as kerjaan}
								<Select.Item value={kerjaan.id} label={kerjaan.pekerjaan}>
									{kerjaan.pekerjaan}
								</Select.Item>
							{/each}
						</Select.Content>
					</Select.Root>
					<p
						class="origin-top text-sm text-red-500 transition-all duration-300"
						class:scale-y-100={feedback.pekerjaanId}
						class:scale-y-0={!feedback.pekerjaanId}
					>
						{feedback.pekerjaanId}&nbsp;
					</p>
				</div>
				<div class="flex flex-col space-y-1.5">
					<Label for="name">Nama</Label>
					<Input id="name" placeholder="Pemilik Ukuran" bind:value={formFields.nama} required />
					<p
						class="origin-top text-sm text-red-500 transition-all duration-300"
						class:scale-y-100={feedback.nama}
						class:scale-y-0={!feedback.nama}
					>
						{feedback.nama}&nbsp;
					</p>
				</div>
				<div class="flex flex-col space-y-1.5">
					<Label for="jurusan">Jurusan</Label>
					<Input id="jurusan" placeholder="Jurusan" bind:value={formFields.jurusan} />
				</div>
				<div class="flex flex-col space-y-1.5">
					<Label for="jenis_kelamin">Jenis Kelamin</Label>
					<Select.Root bind:selected={jenis_kelamin}>
						<Select.Trigger class="w-[180px]">
							<Select.Value placeholder="Pria/Wanita" />
						</Select.Trigger>
						<Select.Content>
							<Select.Item value="Pria" label="Pria">Pria</Select.Item>
							<Select.Item value="Wanita" label="Wanita">Wanita</Select.Item>
						</Select.Content>
					</Select.Root>
					<p
						class="origin-top text-sm text-red-500 transition-all duration-300"
						class:scale-y-100={feedback.jenis_kelamin}
						class:scale-y-0={!feedback.jenis_kelamin}
					>
						{feedback.jenis_kelamin}&nbsp;
					</p>
				</div>
				<Card.Root>
					<Card.Description class="m-2 mx-3">Ukuran Baju</Card.Description>
					<Card.Content>
						<div class="grid grid-cols-2 gap-2 md:grid-cols-4 lg:grid-cols-6">
							{#each Object.keys(formFields).slice(4, 13) as field (field)}
								<div class="flex w-fit flex-col space-y-1.5">
									<Label for={field}
										>{field.replace(/_/g, ' ').replace(/^([a-z])|\s+([a-z])/g, function ($1) {
											return $1.toUpperCase();
										})}</Label
									>
									<Input type="number" id={field} bind:value={formFields[field]} min={0} />
								</div>
							{/each}
						</div>
						<div class="my-3 flex w-fit flex-col space-y-1.5">
							<Label for="jumlah_baju">Jumlah Baju</Label>
							<Input type="number" id="jumlah_baju" bind:value={formFields.jumlah_baju} />
							<p
								class="origin-top text-sm text-red-500 transition-all duration-300"
								class:scale-y-100={feedback.jumlah_baju}
								class:scale-y-0={!feedback.jumlah_baju}
							>
								{feedback.jumlah_baju}&nbsp;
							</p>
						</div>
						<div class="my-3 flex flex-col space-y-1.5">
							<Label for="catatan_baju">Catatan Baju</Label>
							<textarea
								class="rounded-sm border border-muted bg-transparent"
								id="catatan_baju"
								bind:value={formFields.catatan_baju}
							/>
						</div>
						<div class="my-3 flex items-center space-x-2">
							Status:&nbsp;
							<Checkbox id="printed_baju" class="mx-1" bind:checked={formFields.printed_baju} />
							<Label for="printed_baju">
								{formFields.printed_baju ? 'Sudah' : 'Belum'} Cetak</Label
							>
						</div>
					</Card.Content>
				</Card.Root>
				<Card.Root>
					<Card.Description class="m-2 mx-3">Ukuran Celana</Card.Description>
					<Card.Content>
						<div class="grid grid-cols-2 gap-2 md:grid-cols-4 lg:grid-cols-6">
							{#each Object.keys(formFields).slice(16, 23) as field (field)}
								<div class="flex w-fit flex-col space-y-1.5">
									<Label for={field}
										>{field.replace(/_/g, ' ').replace(/^([a-z])|\s+([a-z])/g, function ($1) {
											return $1.toUpperCase();
										})}</Label
									>
									<Input type="number" id={field} bind:value={formFields[field]} min={0} />
								</div>
							{/each}
						</div>
						<div class="my-3 flex w-fit flex-col space-y-1.5">
							<Label for="jumlah_celana">Jumlah Celana</Label>
							<Input type="number" id="jumlah_celana" bind:value={formFields.jumlah_celana} />
							<p
								class="origin-top text-sm text-red-500 transition-all duration-300"
								class:scale-y-100={feedback.jumlah_celana}
								class:scale-y-0={!feedback.jumlah_celana}
							>
								{feedback.jumlah_celana}&nbsp;
							</p>
						</div>
						<div class="my-3 flex flex-col space-y-1.5">
							<Label for="catatan_celana">Catatan Celana</Label>
							<textarea
								class="rounded-sm border border-muted bg-transparent"
								id="catatan_celana"
								bind:value={formFields.catatan_celana}
							/>
						</div>
						<div class="my-3 flex items-center space-x-2">
							Status:&nbsp;
							<Checkbox id="printed_celana" class="mx-1" bind:checked={formFields.printed_celana} />
							<Label for="printed_celana">
								{formFields.printed_baju ? 'Sudah' : 'Belum'} Cetak</Label
							>
						</div>
					</Card.Content>
				</Card.Root>
			</div>
		</form>
	</Card.Content>
	<Card.Footer
		class="sticky bottom-0 flex flex-row-reverse items-center justify-between bg-inherit"
	>
		<Button
			disabled={!($modified[namaOrang] && formFields.nama)}
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
