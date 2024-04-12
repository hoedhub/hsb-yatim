<script lang="ts">
	import Checkbox from '$lib/components/ui/checkbox/checkbox.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import { ScrollArea } from '$lib/components/ui/scroll-area/index.js';
	import { Separator } from '$lib/components/ui/separator/index.js';
	import { db, type Pekerjaan } from '$lib/utils/db';
	import { liveQuery, type Observable } from 'dexie';
	import Button from '$lib/components/ui/button/button.svelte';

	import { onMount, onDestroy } from 'svelte';
	import FormPekerjaan from '$lib/components/structure/FormPekerjaan.svelte';

	let kerjaan: any[] = [];
	let dataKerjaan: Observable<Pekerjaan[]>;
	$: dataKerjaan = liveQuery(async () => {
		const data = await db.pekerjaan.toArray();
		return data;
	});
	let cbKerjaan: Record<number, boolean> = {};
	// const tags = Array.from({ length: 550 }).map((_, i, a) => `v1.2.0-beta.${a.length - i}`);
	let expanded = true;
	let filterPekerjaan: string;
	$: if ($dataKerjaan) {
		kerjaan = $dataKerjaan.filter((row) =>
			filterPekerjaan ? row.pekerjaan.toLowerCase().includes(filterPekerjaan?.toLowerCase()) : true
		);
	}
	const onKerjaanCheck = (e: Event, id: number) => {
		if (!ctrlDown && shiftDown) {
			const start = Math.min(lastSelectedId, id);
			const end = Math.max(lastSelectedId, id);
			for (let i = start; i <= end; i++) {
				cbKerjaan[i] = true;
			}
		} else if (!ctrlDown && !shiftDown) {
			// Unselect everything
			Object.keys(cbKerjaan).forEach((cb) => {
				cbKerjaan[Number(cb)] = false;
			});
			// Select the clicked row
			cbKerjaan[id] = true;
		} else if (ctrlDown) {
			cbKerjaan[id] = !cbKerjaan[id];
		}
		lastSelectedId = id;
	};

	const checkAllKerjaan = () => {
		const cbAllKerjaan = document.getElementById('cb-all-kerjaan') as HTMLInputElement | null;
		if (!cbAllKerjaan) return;
		kerjaan.forEach((row) => {
			cbKerjaan[row.id] = cbAllKerjaan.checked;
		});
	};
	$: if (kerjaan) {
		setTimeout(() => {
			kerjaan.forEach((row) => {
				const cbsKerjaan = document.getElementById(`cb-${row.id}`) as HTMLInputElement | null;
				if (cbsKerjaan) cbsKerjaan.checked = cbKerjaan[row.id];
			});
		});
	}
	let shiftDown = false;
	let ctrlDown = false;
	let lastSelectedId: number;
	$: if (document.querySelector('#cb-all-kerjaan')) {
		const masterCB = document.querySelector('#cb-all-kerjaan') as HTMLInputElement;
		const checkedCount = Object.values(kerjaan).filter((row) => cbKerjaan[row.id]).length;
		masterCB.indeterminate = checkedCount > 0 && checkedCount !== kerjaan.length;
		masterCB.checked = checkedCount > 0 && checkedCount === kerjaan.length;
		if (!masterCB.checked && !masterCB.indeterminate) lastSelectedId = -1;
	}
	onMount(() => {
		//listen to keydown events, assign siftDown and ctrlDown accordingly
		document.addEventListener('keydown', (e) => {
			if (e.key === 'Shift') shiftDown = true;
			if (e.key === 'Control') ctrlDown = true;
		});
		// set sguftDown and ctrlDown to false when key is released
		document.addEventListener('keyup', (e) => {
			if (e.key === 'Shift') shiftDown = false;
			if (e.key === 'Control') ctrlDown = false;
		});
		setTimeout(() => {
			kerjaan.forEach((row) => {
				cbKerjaan[row.id] = true;
				// const cbsKerjaan = document.getElementById(`cb-${row.id}`) as HTMLInputElement | null;
				// if (cbsKerjaan) cbsKerjaan.checked = true;
			});
		});
	});

	//remove event listener on destroy
	onDestroy(() => {
		document.removeEventListener('keydown', (e) => {
			if (e.key === 'Shift') shiftDown = true;
			if (e.key === 'Control') ctrlDown = true;
		});
		document.removeEventListener('keyup', (e) => {
			if (e.key === 'Shift') shiftDown = false;
			if (e.key === 'Control') ctrlDown = false;
		});
	});
</script>

<Button
	size="sm"
	class={`fixed ${expanded ? 'left-64' : 'left-16'} top-[22rem] z-10 my-auto opacity-30 transition-all duration-300 hover:opacity-90`}
	on:click={() => (expanded = !expanded)}
	><div class="origin-center scale-125">{@html expanded ? '&laquo;' : '&raquo;'}</div></Button
>
<div
	class="relative min-h-full w-56 origin-left transition-all duration-300"
	class:scale-x-0={!expanded}
>
	<Button
		size="sm"
		variant="ghost"
		class={`absolute ${!filterPekerjaan ? 'hidden' : ''} right-0`}
		on:click={() => {
			setTimeout(() => document.getElementById('filter-pekerjaan')?.focus());
			filterPekerjaan = '';
		}}
		>&Cross;
	</Button>
	<Input id="filter-pekerjaan" size={20} placeholder="Cari..." bind:value={filterPekerjaan} />
	<ScrollArea class="fixed bottom-2 top-[6.5rem] min-h-0 w-56 rounded-md border">
		<div class="p-4">
			<div class="flex items-center justify-between">
				<h2 class="mb-4 font-semibold leading-none">Pekerjaan</h2>
				<!-- <Switch class="w-2" /> -->
			</div>
			<div class="flex items-center space-x-1">
				<label
					class="w-full cursor-pointer text-muted-foreground hover:bg-muted"
					for={`cb-all-kerjaan`}
				>
					<input
						id={`cb-all-kerjaan`}
						type="checkbox"
						class="cursor-pointer"
						checked={true}
						on:click={checkAllKerjaan}
					/>
					Pilih semua
				</label>
			</div>
			<Separator class="my-2" />
			{#each kerjaan as row}
				<div class="flex items-center space-x-1">
					<label class="cursor-pointer select-none text-sm" for={`cb-${row.id}`}>
						<input
							id={`cb-${row.id}`}
							type="checkbox"
							class="cursor-pointer"
							on:click={(e) => onKerjaanCheck(e, row.id)}
						/>
						{row.pekerjaan}
						<!-- {row} -->
					</label>
				</div>
				<Separator class="my-2" />
			{/each}
		</div></ScrollArea
	>
</div>
