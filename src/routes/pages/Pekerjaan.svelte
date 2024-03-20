<script lang="ts">
	import type { DataPekerjaan } from '$lib/types';
	import Pekerjaan from '$lib/components/structure/Pekerjaan.svelte';
	import * as Tabs from '$lib/components/ui/tabs';
	import Button from '$lib/components/ui/button/button.svelte';
	import FormPekerjaan from '$lib/components/structure/FormPekerjaan.svelte';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import { scrollIntoViewIfNeeded } from '$lib/utils/functions';
	import { modified } from '$lib/stores';

	import { liveQuery } from 'dexie';
	import { db } from '$lib/utils/db';

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
	let dataPekerjaan: Record<any, any> = [];
	$: if ($data) dataPekerjaan = [...$data];

	// let dataPekerjaan: DataPekerjaan[] = [];

	let tabs: { val: string; pg: any; el?: any }[] = [{ val: 'Tabel', pg: Pekerjaan }];
	let tabValue = 'Tabel';
	// $: if (!openPage.some((page) => page === pageId)) openPage = [...openPage, pageId];
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
				pg: FormPekerjaan
			}
		];
		tabValue = newVal;
		setTimeout(() => scrollIntoViewIfNeeded(tabs.find((tab) => tab.val === tabValue)?.el));
	};
</script>

<div class="my-4 flex h-5 items-center space-x-4 text-sm">
	<Button variant="ghost" on:click={pekerjaanBaru}>
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
	<div>Docs</div>
	<Separator orientation="vertical" />
	<div>Source</div>
</div>
<Tabs.Root bind:value={tabValue} class="flex flex-col">
	{#if tabs.length > 1}
		<Tabs.List>
			{#each tabs as tab}
				<Tabs.Trigger
					value={tab.val}
					class="flex items-center"
					on:click={() => (tabValue = tab.val)}
				>
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
							on:click={() => {
								if (!$modified[tab.val] || confirm('Batalkan perubahan form?')) closeTab(tab.val);
							}}
						>
							&Cross;
						</Button>
					{/if}
				</Tabs.Trigger>
			{/each}
		</Tabs.List>
	{/if}
	{#each tabs as tab (tab)}
		<Tabs.Content value={tab.val}>
			{#if tab.val === 'Tabel'}
				{#if dataPekerjaan.length > 0}
					<svelte:component this={tab.pg} bind:dataPekerjaan />
				{:else}
					...
				{/if}
			{:else}
				<svelte:component
					this={tab.pg}
					namaPekerjaan={tab.val}
					onCancel={() => closeTab(tab.val)}
				/>
			{/if}
		</Tabs.Content>
	{/each}
</Tabs.Root>
