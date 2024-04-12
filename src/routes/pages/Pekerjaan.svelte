<script lang="ts">
	import Pekerjaan from '$lib/components/structure/TablePekerjaan.svelte';
	import * as Tabs from '$lib/components/ui/tabs';
	import Button from '$lib/components/ui/button/button.svelte';
	import FormPekerjaan from '$lib/components/structure/FormPekerjaan.svelte';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import { scrollIntoViewIfNeeded } from '$lib/utils/functions';
	import { modified } from '$lib/stores';
	import { confirm } from '@tauri-apps/api/dialog';
	import { checkedPekerjaan, editPekerjaan } from '$lib/stores';
	import { liveQuery, type Observable } from 'dexie';
	import { db } from '$lib/utils/db';
	import { toast } from 'svelte-sonner';

	let tabs: { val: string; mode?: string; pg: any; row?: any; el?: any }[] = [
		{ val: 'Tabel', pg: Pekerjaan }
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
		const newVal = `Pekerjaan Baru${
			tabs.find((tab) => tab.val.includes('Pekerjaan Baru'))
				? ` ${
						Number(
							[...tabs]
								.reverse()
								.find((tab) => tab.val.includes('Pekerjaan Baru'))
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
				pg: FormPekerjaan
			}
		];
		tabValue = newVal;
		setTimeout(() => scrollIntoViewIfNeeded(tabs.find((tab) => tab.val === tabValue)?.el));
	};

	//
	// Query
	//
	$: data = liveQuery(async () => {
		//
		// Query Dexie's API
		//
		const data = await db.pekerjaan
			// .where('age')
			// .between(minAge, maxAge)
			.toArray();

		// Return result
		return data;
	});

	let dataKerjaan: Record<any, any>[] = [];
	$: if ($data) {
		dataKerjaan = [...$data];
	}
	const pekerjaanEdit = () => {
		if (!Object.values($checkedPekerjaan).some((val) => val)) {
			toast.error('Belum ada pekerjaan yang dipilih untuk diedit');
			return;
		}
		const pekerjaanIds = Object.keys($checkedPekerjaan)
			.filter((key) => $checkedPekerjaan[key])
			.map((id) => Number(id));
		if (dataKerjaan) {
			// if (!pekerjaanIds.some((id) => $editPekerjaan.includes(id)))
			dataKerjaan
				.filter((row) => pekerjaanIds.includes(row.id) && !$editPekerjaan.includes(row.id))
				.forEach((row) => {
					tabs = [
						...tabs,
						{
							val: row.pekerjaan,
							mode: 'edit',
							row,
							pg: FormPekerjaan
						}
					];
					$editPekerjaan = [...$editPekerjaan, row.id];
				});
			tabValue = tabs[tabs.length - 1].val;
			setTimeout(() => scrollIntoViewIfNeeded(tabs.find((tab) => tab.val === tabValue)?.el));
			// console.log('tab', tabValue);
			// console.log('pkjid', pekerjaanIds);
		}
	};
	const pekerjaanHapus = () => {
		const deleteIds = Object.keys($checkedPekerjaan)
			.filter((key) => $checkedPekerjaan[key] && !$editPekerjaan.includes(Number(key)))
			.map((id) => Number(id));
		if (deleteIds.length === 0) {
			toast.error(
				'Belum ada pekerjaan yang dipilih untuk dihapus. \n(Pekerjaan yang sedang diedit tidak akan dihapus)'
			);
			return;
		}
		confirm(
			`Hapus ${deleteIds.length} pekerjaan? \n(Pekerjaan yang sedang diedit tidak akan dihapus)`,
			'HSB Yatim'
		).then((res) => {
			if (!res) return;
			db.pekerjaan
				.bulkDelete(deleteIds)
				.then(() => {
					$checkedPekerjaan = {};
					toast.success('Pekerjaan berhasil dihapus');
				})
				.catch((err) => {
					console.error(err);
				});
		});
	};
</script>

<div class="my-4 flex h-5 items-center space-x-1 text-sm">
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
	<Button variant="ghost" class="px-2" on:click={pekerjaanEdit}>
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
	<Button variant="ghost" class="px-2" on:click={pekerjaanHapus}>
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
							<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 256 256"
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
				<FormPekerjaan
					namaPekerjaan={tab.val}
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
