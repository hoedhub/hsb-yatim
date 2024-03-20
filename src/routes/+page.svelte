<script lang="ts">
	import SideBar from '$lib/components/ui/SideBar.svelte';
	import { pageId } from '$lib/stores';
	import * as Tabs from '$lib/components/ui/tabs';
	import Home from './pages/Home.svelte';
	import Pekerjaan from './pages/Pekerjaan.svelte';
	import Button from '$lib/components/ui/button/button.svelte';

	const tabs = [
		{ val: 'HSB Yatim', pg: Home },
		{ val: 'Pekerjaan', pg: Pekerjaan }
	];
	let openPage = [0];
	$: if (!openPage.some((page) => page === $pageId)) openPage = [...openPage, $pageId];
	const closeTab = (id: number) => {
		if ($pageId === id) {
			const openId = openPage.findIndex((idx: number) => idx === id);
			if (openPage[openPage.length - 1] !== openPage[openId]) $pageId = openId + 1;
			else $pageId = id - 1;
		}
		openPage = openPage.filter((page) => page !== id);
	};
</script>

<SideBar />
<!-- <Card.Root class="absolute inset-0 ml-10"> -->

<Tabs.Root value={tabs[$pageId].val} class="absolute inset-0 my-2 ml-16 mr-2">
	<Tabs.List>
		{#each openPage as page}
			<Tabs.Trigger
				value={tabs[page].val}
				class="flex items-center"
				on:click={() => ($pageId = page)}
			>
				<div id={tabs[page].val.replace(/\s/g, '_').toLowerCase()}>{tabs[page].val}</div>
				{#if page > 0}
					<Button
						class="ml-1 mr-0 h-4 w-4 p-1 pr-0 hover:text-red-500"
						variant="ghost"
						on:click={() => closeTab(page)}
						>&Cross;
					</Button>
				{/if}
			</Tabs.Trigger>
		{/each}
	</Tabs.List>
	{#each openPage as page}
		<Tabs.Content value={tabs[page].val}>
			<svelte:component this={tabs[page].pg} />
		</Tabs.Content>
	{/each}
</Tabs.Root>
