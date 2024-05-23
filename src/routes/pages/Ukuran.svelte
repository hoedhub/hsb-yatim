<script lang="ts">
	import { confirm } from '@tauri-apps/api/dialog';
	import { db, type Pekerjaan } from '$lib/utils/db';
	import { liveQuery, type IndexableType, type Observable } from 'dexie';
	import Button from '$lib/components/ui/button/button.svelte';

	import { onMount, onDestroy } from 'svelte';
	import FormUkuran from '$lib/components/structure/FormUkuran.svelte';
	import PekerjaanSelector from '$lib/components/structure/PekerjaanSelector.svelte';
	import * as Tabs from '$lib/components/ui/tabs';
	import { Separator } from '$lib/components/ui/separator/index.js';
	import { modified } from '$lib/stores';
	import TableUkuran from '$lib/components/structure/TableUkuran.svelte';
	import { scrollIntoViewIfNeeded } from '$lib/utils/functions';
	import { checkedUkuran, editUkuran } from '$lib/stores';
	import { toast } from 'svelte-sonner';

	let expanded: boolean = true;
	let cbKerjaan: Record<number, boolean> = {};

	$: data = liveQuery(async () => {
		const idKerjaan = Object.keys(cbKerjaan)
			.filter((key: any) => cbKerjaan[key])
			.map((id) => Number(id));
		const orang = await db.orang.where('pekerjaanId').anyOf(idKerjaan).toArray();
		const idOrang = orang.map((row) => row.id).filter((id) => id !== undefined); //remove undefined;
		const baju = await db.baju
			.where('orangId')
			.anyOf(idOrang as IndexableType[])
			.toArray();
		const celana = await db.celana
			.where('orangId')
			.anyOf(idOrang as IndexableType[])
			.toArray();
		const data = orang.map((row, id) => ({
			...row,
			...baju[id],
			panjang_baju: baju[id].panjang,
			jumlah_baju: baju[id].jumlah,
			catatan_baju: baju[id].catatan,
			printed_baju: baju[id].printed,
			...celana[id],
			panjang_celana: celana[id].panjang,
			jumlah_celana: celana[id].jumlah,
			catatan_celana: celana[id].catatan,
			printed_celana: celana[id].printed
		}));
		return data;
	});

	let dataUkuran: Record<any, any>[] = [];
	$: if ($data) {
		dataUkuran = [...$data];
	}

	let tabs: { val: string; mode?: string; pg: any; row?: any; el?: any }[] = [
		{ val: 'Tabel', pg: TableUkuran }
	];
	let tabValue = 'Tabel';

	const closeTab = (value: string) => {
		if (tabValue === value) {
			const openId = tabs.findIndex((tab: any) => tab.val === value);
			if (tabs[tabs.length - 1].val !== tabs[openId].val) tabValue = tabs[openId + 1].val;
			else tabValue = tabs[openId - 1].val;
		}
		tabs = tabs.filter((tab) => tab.val !== value);
	};

	const pekerjaanBaru = () => {
		const newVal = `Ukuran Baru${
			tabs.find((tab) => tab.val.includes('Ukuran Baru'))
				? ` ${
						Number(
							[...tabs]
								.reverse()
								.find((tab) => tab.val.includes('Ukuran Baru'))
								?.val.replace(/\D/g, '')
						) + 1
					}`
				: ''
		}`;
		tabs = [
			...tabs,
			{
				val: newVal,
				mode: 'new',
				pg: FormUkuran
			}
		];
		tabValue = newVal;
		setTimeout(() => scrollIntoViewIfNeeded(tabs.find((tab) => tab.val === tabValue)?.el));
	};

	const pekerjaanEdit = () => {
		if (!Object.values($checkedUkuran).some((val) => val)) {
			toast.error('Belum ada pekerjaan yang dipilih untuk diedit');
			return;
		}
		const orangIds = Object.keys($checkedUkuran)
			.filter((key) => $checkedUkuran[key])
			.map((id) => Number(id));
		if (dataUkuran) {
			// if (!pekerjaanIds.some((id) => $editPekerjaan.includes(id)))
			dataUkuran
				.filter((row) => orangIds.includes(Number(row.id)) && !$editUkuran.includes(Number(row.id)))
				.forEach((row) => {
					tabs = [
						...tabs,
						{
							val: row.nama,
							mode: 'edit',
							row,
							pg: FormUkuran
						}
					];
					$editUkuran = [...$editUkuran, Number(row.id)];
				});
			tabValue = tabs[tabs.length - 1].val;
			setTimeout(() => scrollIntoViewIfNeeded(tabs.find((tab) => tab.val === tabValue)?.el));
			// console.log('tab', tabValue);
			// console.log('pkjid', pekerjaanIds);
		}
	};

	let deleting = false;
	const pekerjaanHapus = () => {
		if (deleting) return;
		const deleteIds = Object.keys($checkedUkuran)
			.filter((key) => $checkedUkuran[key] && !$editUkuran.includes(Number(key)))
			.map((id) => Number(id));
		if (deleteIds.length === 0) {
			toast.error(
				`Belum ada ukuran yang dipilih untuk dihapus.${$editUkuran.length > 0 ? '\n(Ukuran yang sedang diedit tidak akan dihapus)' : ''}`
			);
			return;
		}
		try {
			deleting = true;
			confirm(
				`Hapus ${deleteIds.length} ukuran?${$editUkuran.length > 0 ? '\n(Ukuran yang sedang diedit tidak akan dihapus)' : ''}`,
				'HSB Yatim'
			)
				.then(async (res) => {
					if (!res) return;
					await Promise.all([
						db.baju
							.where('orangId')
							.anyOf(deleteIds as IndexableType[])
							.delete(),
						db.celana
							.where('orangId')
							.anyOf(deleteIds as IndexableType[])
							.delete()
					]);
					//delete orang
					await db.orang.bulkDelete(deleteIds);
					deleteIds.forEach((id) => {
						delete $checkedUkuran[id];
					});
					toast.warning(`${deleteIds.length} ukuran berhasil dihapus`);
				})
				.catch((err) => {
					console.error(err);
				});
		} catch (err) {
			console.error(err);
		} finally {
			deleting = false;
		}
	};
	const pekerjaanPrint = () => {
		if (!Object.values($checkedUkuran).some((val) => val)) {
			toast.error('Belum ada pekerjaan yang dipilih untuk dicetak');
			return;
		}
		const orangIds = Object.keys($checkedUkuran)
			.filter((key) => $checkedUkuran[key])
			.map((id) => Number(id));
		if (dataUkuran) {
			// if (!pekerjaanIds.some((id) => $editPekerjaan.includes(id)))
			dataUkuran
				.filter((row) => orangIds.includes(Number(row.id)) && !$editUkuran.includes(Number(row.id)))
				.forEach((row) => {
					tabs = [
						...tabs,
						{
							val: row.nama,
							mode: 'edit',
							row,
							pg: FormUkuran
						}
					];
					$editUkuran = [...$editUkuran, Number(row.id)];
				});
			tabValue = tabs[tabs.length - 1].val;
			setTimeout(() => scrollIntoViewIfNeeded(tabs.find((tab) => tab.val === tabValue)?.el));
			// console.log('tab', tabValue);
			// console.log('pkjid', pekerjaanIds);
		}
	};

	onMount(() => {
		setTimeout(() => Object.keys(cbKerjaan).forEach((key: any) => (cbKerjaan[key] = true)));
	});
</script>

<div class:hidden={tabValue !== 'Tabel'}>
	<PekerjaanSelector bind:expanded bind:cbKerjaan />
</div>
<div
	class="fixed bottom-2 right-2 top-0 mt-12 min-h-0 transition-all duration-300"
	class:left-[19rem]={expanded && tabValue === 'Tabel'}
	class:left-16={!expanded || tabValue !== 'Tabel'}
>
	<div class="mt-4 flex h-5 items-center space-x-1 text-sm" class:mb-4={tabs.length > 1}>
		<Button variant="ghost" class="px-2" on:click={pekerjaanBaru}>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="1em"
				height="1em"
				viewBox="0 0 24 24"
				class="h-6 w-6"
			>
				<g fill="currentColor">
					<path
						d="M12 6a1 1 0 0 1 1 1v4h4a1 1 0 1 1 0 2h-4v4a1 1 0 1 1-2 0v-4H7a1 1 0 1 1 0-2h4V7a1 1 0 0 1 1-1"
					/>
					<path
						fill-rule="evenodd"
						d="M5 22a3 3 0 0 1-3-3V5a3 3 0 0 1 3-3h14a3 3 0 0 1 3 3v14a3 3 0 0 1-3 3zm-1-3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1z"
						clip-rule="evenodd"
					/>
				</g>
			</svg>
		</Button>
		<Separator orientation="vertical" />
		<Button variant="ghost" class="px-2" on:click={pekerjaanEdit} disabled={tabValue !== 'Tabel'}>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="1em"
				height="1em"
				viewBox="0 0 24 24"
				class="h-6 w-6"
			>
				<path
					fill="currentColor"
					d="M21 12a1 1 0 0 0-1 1v6a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h6a1 1 0 0 0 0-2H5a3 3 0 0 0-3 3v14a3 3 0 0 0 3 3h14a3 3 0 0 0 3-3v-6a1 1 0 0 0-1-1m-15 .76V17a1 1 0 0 0 1 1h4.24a1 1 0 0 0 .71-.29l6.92-6.93L21.71 8a1 1 0 0 0 0-1.42l-4.24-4.29a1 1 0 0 0-1.42 0l-2.82 2.83l-6.94 6.93a1 1 0 0 0-.29.71m10.76-8.35l2.83 2.83l-1.42 1.42l-2.83-2.83ZM8 13.17l5.93-5.93l2.83 2.83L10.83 16H8Z"
				/>
			</svg>
		</Button>
		<Separator orientation="vertical" />
		<Button variant="ghost" class="px-2" on:click={pekerjaanHapus} disabled={tabValue !== 'Tabel'}>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="1em"
				height="1em"
				viewBox="0 0 24 24"
				class="h-6 w-6"
			>
				<g fill="currentColor" fill-rule="evenodd" clip-rule="evenodd">
					<path
						d="M12.888 16.896c-.526.526-.973.974-1.378 1.283c-.432.329-.902.571-1.478.571s-1.046-.242-1.478-.571c-.405-.31-.852-.757-1.379-1.283l-.07-.071c-.527-.527-.975-.974-1.284-1.38c-.329-.43-.571-.901-.571-1.477c0-.576.242-1.046.571-1.478c.31-.405.757-.852 1.283-1.378l4.008-4.008c.526-.526.973-.974 1.378-1.283c.432-.329.902-.571 1.478-.571s1.046.242 1.478.571c.405.31.852.757 1.379 1.283l.07.071c.527.527.975.974 1.284 1.38c.329.43.571.901.571 1.477c0 .576-.242 1.046-.571 1.478c-.31.405-.757.852-1.283 1.378zM12.137 8.2c.571-.571.948-.946 1.263-1.186c.298-.228.452-.264.568-.264c.116 0 .27.036.568.264c.315.24.692.615 1.264 1.186c.571.572.946.949 1.186 1.264c.228.298.264.452.264.568c0 .116-.036.27-.264.568c-.24.315-.615.692-1.186 1.263l-2.62 2.619l-3.662-3.663zm-3.68 3.68l3.663 3.663l-.257.257c-.571.571-.948.946-1.263 1.186c-.298.228-.452.264-.568.264c-.116 0-.27-.036-.568-.264c-.315-.24-.692-.615-1.264-1.186c-.571-.572-.946-.949-1.186-1.264c-.228-.298-.264-.452-.264-.568c0-.116.036-.27.264-.568c.24-.315.615-.692 1.186-1.263z"
					/><path
						d="M11.943 1.25c-2.309 0-4.118 0-5.53.19c-1.444.194-2.584.6-3.479 1.494c-.895.895-1.3 2.035-1.494 3.48c-.19 1.411-.19 3.22-.19 5.529v.114c0 2.309 0 4.118.19 5.53c.194 1.444.6 2.584 1.494 3.479c.895.895 2.035 1.3 3.48 1.494c1.411.19 3.22.19 5.529.19h.114c2.309 0 4.118 0 5.53-.19c1.444-.194 2.584-.6 3.479-1.494c.895-.895 1.3-2.035 1.494-3.48c.19-1.411.19-3.22.19-5.529v-.114c0-2.309 0-4.118-.19-5.53c-.194-1.444-.6-2.584-1.494-3.479c-.895-.895-2.035-1.3-3.48-1.494c-1.411-.19-3.22-.19-5.529-.19zM3.995 3.995c.57-.57 1.34-.897 2.619-1.069c1.3-.174 3.008-.176 5.386-.176s4.086.002 5.386.176c1.279.172 2.05.5 2.62 1.069c.569.57.896 1.34 1.068 2.619c.174 1.3.176 3.008.176 5.386s-.002 4.086-.176 5.386c-.172 1.279-.5 2.05-1.069 2.62c-.57.569-1.34.896-2.619 1.068c-1.3.174-3.008.176-5.386.176s-4.086-.002-5.386-.176c-1.279-.172-2.05-.5-2.62-1.069c-.569-.57-.896-1.34-1.068-2.619c-.174-1.3-.176-3.008-.176-5.386s.002-4.086.176-5.386c.172-1.279.5-2.05 1.069-2.62"
					/>
				</g>
			</svg>
		</Button>
		<Separator orientation="vertical" />
		<Button
			variant="ghost"
			class="relative px-2"
			on:click={pekerjaanPrint}
			disabled={tabValue !== 'Tabel'}
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="1em"
				height="1em"
				viewBox="0 0 16 16"
				class="h-7 w-7"
				><path
					fill="currentColor"
					d="M4 3.5A1.5 1.5 0 0 1 5.5 2h5A1.5 1.5 0 0 1 12 3.5V4h1a2 2 0 0 1 2 2v4.5a1.5 1.5 0 0 1-1.5 1.5H12v.5a1.5 1.5 0 0 1-1.5 1.5h-5A1.5 1.5 0 0 1 4 12.5V12H2.5A1.5 1.5 0 0 1 1 10.5V6a2 2 0 0 1 2-2h1zM4 11v-.5A1.5 1.5 0 0 1 5.5 9h5a1.5 1.5 0 0 1 1.5 1.5v.5h1.5a.5.5 0 0 0 .5-.5V6a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v4.5a.5.5 0 0 0 .5.5zm1-7h6v-.5a.5.5 0 0 0-.5-.5h-5a.5.5 0 0 0-.5.5zm0 6.5v2a.5.5 0 0 0 .5.5h5a.5.5 0 0 0 .5-.5v-2a.5.5 0 0 0-.5-.5h-5a.5.5 0 0 0-.5.5"
				/></svg
			>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="1.25em"
				height="1em"
				viewBox="0 0 640 512"
				class="absolute right-0 top-1 h-4 w-4"
				><path
					fill="currentColor"
					d="M211.8 0c7.8 0 14.3 5.7 16.7 13.2C240.8 51.9 277.1 80 320 80s79.2-28.1 91.5-66.8C413.9 5.7 420.4 0 428.2 0h12.6c22.5 0 44.2 7.9 61.5 22.3l126.2 105.1c6.6 5.5 10.7 13.5 11.4 22.1s-2.1 17.1-7.8 23.6l-56 64c-11.4 13.1-31.2 14.6-44.6 3.5L480 197.7V448c0 35.3-28.7 64-64 64H224c-35.3 0-64-28.7-64-64V197.7l-51.5 42.9c-13.3 11.1-33.1 9.6-44.6-3.5l-56-64c-5.7-6.5-8.5-15-7.8-23.6s4.8-16.6 11.4-22.1L137.7 22.3C155 7.9 176.7 0 199.2 0z"
				/></svg
			>
		</Button>
		<Separator orientation="vertical" />
		<Button
			variant="ghost"
			class="relative px-2"
			on:click={pekerjaanPrint}
			disabled={tabValue !== 'Tabel'}
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="1em"
				height="1em"
				viewBox="0 0 16 16"
				class="h-7 w-7"
				><path
					fill="currentColor"
					d="M4 3.5A1.5 1.5 0 0 1 5.5 2h5A1.5 1.5 0 0 1 12 3.5V4h1a2 2 0 0 1 2 2v4.5a1.5 1.5 0 0 1-1.5 1.5H12v.5a1.5 1.5 0 0 1-1.5 1.5h-5A1.5 1.5 0 0 1 4 12.5V12H2.5A1.5 1.5 0 0 1 1 10.5V6a2 2 0 0 1 2-2h1zM4 11v-.5A1.5 1.5 0 0 1 5.5 9h5a1.5 1.5 0 0 1 1.5 1.5v.5h1.5a.5.5 0 0 0 .5-.5V6a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v4.5a.5.5 0 0 0 .5.5zm1-7h6v-.5a.5.5 0 0 0-.5-.5h-5a.5.5 0 0 0-.5.5zm0 6.5v2a.5.5 0 0 0 .5.5h5a.5.5 0 0 0 .5-.5v-2a.5.5 0 0 0-.5-.5h-5a.5.5 0 0 0-.5.5"
				/></svg
			>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="1em"
				height="1em"
				viewBox="0 0 512 512"
				class="absolute right-0 top-1 h-4 w-4"
				><path
					fill="currentColor"
					d="M250.45 19.767c-44.556.187-87.24 7.376-118.562 21c-16.176 147.458-32.792 298.827-46.72 425.75l123.344 24.814l34.157-262.844h20.63l34.25 263.75h.218l129.063-26.28c-15.71-141.714-31.023-283.473-46.724-425.19c-38.697-14.307-85.098-21.17-129.655-21z"
				/></svg
			>
		</Button>
	</div>
	<Tabs.Root bind:value={tabValue} class="flex flex-col">
		{#if tabs.length > 1}
			<Tabs.List>
				{#each tabs as tab (tab.val)}
					<Tabs.Trigger
						value={tab.val}
						class="flex items-center"
						on:click={() => (tabValue = tab.val)}
					>
						{#if tab.mode === 'new'}
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="1em"
								height="1em"
								viewBox="0 0 24 24"
								class="mx-1"
							>
								<g fill="currentColor">
									<path
										d="M12 6a1 1 0 0 1 1 1v4h4a1 1 0 1 1 0 2h-4v4a1 1 0 1 1-2 0v-4H7a1 1 0 1 1 0-2h4V7a1 1 0 0 1 1-1"
									/>
									<path
										fill-rule="evenodd"
										d="M5 22a3 3 0 0 1-3-3V5a3 3 0 0 1 3-3h14a3 3 0 0 1 3 3v14a3 3 0 0 1-3 3zm-1-3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1z"
										clip-rule="evenodd"
									/>
								</g>
							</svg>
						{:else if tab.mode === 'edit'}
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="1em"
								height="1em"
								viewBox="0 0 24 24"
								class="mx-1"
							>
								<path
									fill="currentColor"
									d="M21 12a1 1 0 0 0-1 1v6a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h6a1 1 0 0 0 0-2H5a3 3 0 0 0-3 3v14a3 3 0 0 0 3 3h14a3 3 0 0 0 3-3v-6a1 1 0 0 0-1-1m-15 .76V17a1 1 0 0 0 1 1h4.24a1 1 0 0 0 .71-.29l6.92-6.93L21.71 8a1 1 0 0 0 0-1.42l-4.24-4.29a1 1 0 0 0-1.42 0l-2.82 2.83l-6.94 6.93a1 1 0 0 0-.29.71m10.76-8.35l2.83 2.83l-1.42 1.42l-2.83-2.83ZM8 13.17l5.93-5.93l2.83 2.83L10.83 16H8Z"
								/>
							</svg>
						{:else}
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="1em"
								height="1em"
								viewBox="0 0 256 256"
								class="mx-1"
							>
								<path
									fill="currentColor"
									d="M224 48H32a8 8 0 0 0-8 8v136a16 16 0 0 0 16 16h176a16 16 0 0 0 16-16V56a8 8 0 0 0-8-8M40 112h40v32H40Zm56 0h120v32H96Zm-56 48h40v32H40Zm176 32H96v-32h120z"
								/>
							</svg>
						{/if}
						<div bind:this={tab.el} id={tab.val.replace(/\s/g, '_')} class="flex justify-between">
							{tab.val}
							{#if $modified[tab.val]}
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="1em"
									height="1em"
									viewBox="0 0 256 256"
									><path
										fill="currentColor"
										d="M128 80a48 48 0 1 0 48 48a48 48 0 0 0-48-48m0 60a12 12 0 1 1 12-12a12 12 0 0 1-12 12"
										class="h-1 w-1 text-orange-500"
									/>
								</svg>
							{/if}
						</div>
						{#if tab.val !== 'Tabel'}
							<Button
								class="ml-1 mr-0 h-4 w-4 p-1 pr-0 hover:text-red-500"
								variant="ghost"
								on:click={async () => {
									let doClose = false;
									if ($modified[tab.val])
										doClose = await confirm('Batalkan perubahan form?', 'HSB Yatim');
									if (!$modified[tab.val] || doClose) closeTab(tab.val);
								}}
							>
								&Cross;
							</Button>
						{/if}
					</Tabs.Trigger>
				{/each}
			</Tabs.List>
		{/if}
		{#each tabs as tab (tab.val)}
			<Tabs.Content value={tab.val}>
				{#if tab.val === 'Tabel'}
					<svelte:component this={tab.pg} bind:data />
				{:else}
					<svelte:component
						this={tab.pg}
						namaOrang={tab.val}
						row={tab.row}
						onCancel={() => {
							closeTab(tab.val);
							return null;
						}}
					/>
				{/if}
			</Tabs.Content>
		{/each}
	</Tabs.Root>
</div>
