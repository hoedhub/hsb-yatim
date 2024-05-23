<script lang="ts">
	import date from 'date-and-time';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/';
	import { createTable, Render, Subscribe, createRender } from 'svelte-headless-table';
	import { readable } from 'svelte/store';

	import type { DataPekerjaan } from '$lib/types';

	import { addPagination, addHiddenColumns } from 'svelte-headless-table/plugins';
	import Pagination from '$lib/components/ui/Pagination.svelte';
	import PekerjaanActions from '$lib/components/utils/PekerjaanActions.svelte';

	import * as Table from '$lib/components/ui/table';
	import { Input } from '$lib/components/ui/input';
	import { Checkbox } from '$lib/components/ui/checkbox';
	import { Button } from '$lib/components/ui/button';
	import { fade } from 'svelte/transition';
	import { onMount } from 'svelte';

	import { liveQuery } from 'dexie';
	import { db } from '$lib/utils/db';
	import { checkedPekerjaan } from '$lib/stores';

	export let data;
	let filterInput = false;
	let filter: { column: string; keyword: string }[] = []; // Use an array type instead of Record<any, any>
	let keyword: string;
	let filterTimeoutId: ReturnType<typeof setTimeout> | null;
	const filterAll = () => {
		if (filterTimeoutId) clearTimeout(filterTimeoutId);
		filterTimeoutId = setTimeout(
			() => {
				// filter = [...filter, { column: 'all', keyword }]
				if (keyword) {
					//filter dataPekerjaan only for keys that are not false in hideForId
					dataPekerjaan = $data.filter(
						(row: any) =>
							Object.entries(row)
								.filter(([key]) => hideForId[key]) // Filter entries based on hideForId
								.some(([_, value]) => String(value).toLowerCase().includes(keyword.toLowerCase())) // Check if any value matches the keyword
					);
				} else dataPekerjaan = [...$data];
				loadData();
				if (keyword)
					setTimeout(() => {
						const tableElement = document.getElementById('table-pekerjaan');
						if (tableElement) {
							const elements = Array.from(tableElement.querySelectorAll(`.tcell`));
							elements.forEach((element) => {
								if (keyword && element.textContent?.includes(keyword)) {
									const regexPattern = keyword.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
									const keywordRegex = new RegExp(regexPattern, 'gi');
									const highlightedText = element.textContent.replace(
										keywordRegex,
										(match) => `<span class="bg-muted text-muted-foreground">${match}</span>`
									);
									element.innerHTML = highlightedText;
								} else element.innerHTML = element.textContent || '';
							});
						}
					});
			},

			filterInput ? 1300 : 0
		);
	};

	$: if (hideForId && keyword) filterAll();

	let dataPekerjaan: Record<any, any>[] = [];
	$: if ($data) {
		dataPekerjaan = [...$data];
		loadData();
	}
	let table = createTable(readable(dataPekerjaan as DataPekerjaan[]), {
		page: addPagination(),
		hide: addHiddenColumns()
	});

	let columns = table.createColumns([
		table.column({
			accessor: 'id',
			header: 'ID'
		}),
		table.column({
			accessor: 'pekerjaan',
			header: 'Pekerjaan'
		}),

		table.column({
			accessor: 'alokasi',
			header: 'Alokasi',
			cell: ({ value }) => {
				const formatted = new Intl.NumberFormat('id-ID', {
					style: 'currency',
					currency: 'IDR',
					minimumFractionDigits: 0,
					maximumFractionDigits: 0
				}).format(value);
				return formatted;
			}
		}),
		table.column({
			accessor: 'tanggal_masuk',
			header: 'Tanggal Masuk',
			cell: ({ value }) => {
				const formatted = date.format(value, 'YYYY-MM-DD HH:mm:ss');
				return formatted;
			}
		}),
		table.column({
			accessor: 'status',
			header: 'Status'
		})
		// table.column({
		// 	accessor: ({ id }) => id,
		// 	header: ''
		// })
	]);

	let { headerRows, pageRows, tableAttrs, tableBodyAttrs, pluginStates, flatColumns } =
		table.createViewModel(columns);

	let { hasNextPage, hasPreviousPage, pageIndex, pageSize } = pluginStates.page;
	let { hiddenColumnIds } = pluginStates.hide;

	let ids = flatColumns.map((col) => col.id);
	let hideForId = Object.fromEntries(ids.map((id) => [id, true]));

	// $: $hiddenColumnIds = Object.entries(hideForId)
	// 	.filter(([, hide]) => !hide)
	// 	.map(([id]) => id);
	const hidableCols = ['id', 'pekerjaan', 'alokasi', 'tanggal_masuk', 'status'];

	let checkedAll = false;

	let sortedColumn = '';
	let ascending = false;
	const sortColumn = (colId: string) => {
		ascending = colId === sortedColumn ? !ascending : true;
		sortedColumn = colId;
		loadData();
	};
	const loadData = () => {
		//sort dataPekerjaan using sortedColumn variable and ascending variable before passing it to table
		if (sortedColumn)
			dataPekerjaan = [...dataPekerjaan].sort((a, b) => {
				if (a[sortedColumn] < b[sortedColumn]) return ascending ? -1 : 1;
				if (a[sortedColumn] > b[sortedColumn]) return ascending ? 1 : -1;
				return 0;
			});

		table = createTable(readable(dataPekerjaan as DataPekerjaan[]), {
			page: addPagination({ initialPageSize: $pageSize, initialPageIndex: $pageIndex }),
			hide: addHiddenColumns()
		});

		({ headerRows, pageRows, tableAttrs, tableBodyAttrs, pluginStates, flatColumns } =
			table.createViewModel(columns));
		({ hasNextPage, hasPreviousPage, pageIndex, pageSize } = pluginStates.page);

		if (!hideForId) {
			ids = flatColumns.map((col) => col.id);
			hideForId = Object.fromEntries(ids.map((id) => [id, true]));
		}

		$pageRows.forEach((row) => {
			const id = row.cells[0].render().toString();
			$checkedPekerjaan[id] = $checkedPekerjaan.hasOwnProperty(id) ? $checkedPekerjaan[id] : false;
		});
	};
	let checkedCount: number;
	$: if (document.querySelector('#masterCB')) {
		const masterCB = document.querySelector('#masterCB') as HTMLInputElement;
		checkedCount = Object.values($pageRows).filter(
			(row) => $checkedPekerjaan[row.cells[0].render().toString()]
		).length;
		masterCB.indeterminate = checkedCount > 0 && checkedCount !== $pageRows.length;
		masterCB.checked = checkedCount > 0 && checkedCount === $pageRows.length;
	}
	let onlySelected: boolean = false;
	const showSelected = () => {
		// if (!Object.values($checkedPekerjaan).some((checked) => checked)) return;
		setTimeout(() => {
			dataPekerjaan = $data.filter((row: any) => (onlySelected ? $checkedPekerjaan[row.id] : true));
			loadData();
		});
	};
	onMount(() => {
		setTimeout(() => {
			$hiddenColumnIds = ['id'];
			hideForId.id = false;
		});
	});
</script>

<div class="flex items-center py-4">
	<!--- Place the button on the right inside the input, only appear if input is not empty -->
	<div class="relative flex items-center">
		<Input
			id="filterInput"
			class="max-w-sm"
			placeholder="Cari..."
			type="text"
			bind:value={keyword}
			on:blur={() => (filterInput = false)}
			on:focus={() => (filterInput = true)}
		/>
		<Button
			variant="ghost"
			size="sm"
			class={`right-0${!keyword ? ' hidden' : ' absolute'}`}
			on:click={() => {
				setTimeout(() => document.getElementById('filterInput')?.focus());
				keyword = '';
				filterAll();
			}}
			>&Cross;
		</Button>
	</div>
	{#if sortedColumn}
		<div class="flex items-center p-2 text-xs text-muted-foreground">
			Order by:
			<button
				class="p-1 capitalize hover:bg-muted"
				on:click={() => {
					ascending = !ascending;
					loadData();
				}}
			>
				{sortedColumn.replace(/[_]/g, ' ')}
				{ascending ? '↑' : '↓'}
			</button>
			<button
				class="p-1 hover:bg-muted"
				on:click={() => {
					sortedColumn = 'id';
					ascending = true;
					loadData();
					sortedColumn = '';
				}}
			>
				&Cross;
			</button>
		</div>
	{/if}
	<DropdownMenu.Root>
		<DropdownMenu.Trigger asChild let:builder>
			<Button variant="outline" class="ml-auto" builders={[builder]}>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="1em"
					height="1em"
					viewBox="0 0 24 24"
					class="mr-2"
				>
					<path
						fill="currentColor"
						d="M12 16q1.875 0 3.188-1.312T16.5 11.5q0-1.875-1.312-3.187T12 7q-1.875 0-3.187 1.313T7.5 11.5q0 1.875 1.313 3.188T12 16m0-1.8q-1.125 0-1.912-.788T9.3 11.5q0-1.125.788-1.912T12 8.8q1.125 0 1.913.788T14.7 11.5q0 1.125-.787 1.913T12 14.2m0 4.8q-3.65 0-6.65-2.037T1 11.5q1.35-3.425 4.35-5.462T12 4q3.65 0 6.65 2.038T23 11.5q-1.35 3.425-4.35 5.463T12 19m0-2q2.825 0 5.188-1.487T20.8 11.5q-1.25-2.525-3.613-4.012T12 6Q9.175 6 6.813 7.488T3.2 11.5q1.25 2.525 3.613 4.013T12 17"
					/>
				</svg>
				Columns
			</Button>
		</DropdownMenu.Trigger>
		<DropdownMenu.Content>
			{#each flatColumns as col}
				{#if hidableCols.includes(col.id)}
					<DropdownMenu.CheckboxItem bind:checked={hideForId[col.id]}>
						{col.header}
					</DropdownMenu.CheckboxItem>
				{/if}
			{/each}
		</DropdownMenu.Content>
	</DropdownMenu.Root>
</div>
<div class="rounded-md border">
	<Table.Root {...$tableAttrs}>
		<Table.Header>
			{#each $headerRows as headerRow}
				<Subscribe rowAttrs={headerRow.attrs()}>
					<Table.Row>
						<Table.Head class="whitespace-nowrap">
							<input
								type="checkbox"
								id="masterCB"
								class="h-4 w-4 rounded-lg"
								bind:checked={checkedAll}
								on:click={() =>
									$pageRows.forEach((row) =>
										setTimeout(
											() => ($checkedPekerjaan[row.cells[0].render().toString()] = checkedAll)
										)
									)}
							/>
							<DropdownMenu.Root>
								<DropdownMenu.Trigger>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="1em"
										height="1em"
										viewBox="0 0 20 20"
										><path
											fill="currentColor"
											d="M9 15.25a1.25 1.25 0 1 1 2.5 0a1.25 1.25 0 0 1-2.5 0m0-5a1.25 1.25 0 1 1 2.5 0a1.25 1.25 0 0 1-2.5 0m0-5a1.249 1.249 0 1 1 2.5 0a1.25 1.25 0 1 1-2.5 0"
										/></svg
									>
								</DropdownMenu.Trigger>
								<DropdownMenu.Content>
									<DropdownMenu.Item
										on:click={() => {
											$pageRows.forEach(
												(row) => ($checkedPekerjaan[row.cells[0].render().toString()] = true)
											);
										}}
										>Select all
									</DropdownMenu.Item>
									<DropdownMenu.Item
										on:click={() => {
											$pageRows.forEach(
												(row) => ($checkedPekerjaan[row.cells[0].render().toString()] = false)
											);
											if (onlySelected) showSelected();
										}}
										>Deselect all
									</DropdownMenu.Item>
									<DropdownMenu.Item
										on:click={() => {
											$pageRows.forEach(
												(row) =>
													($checkedPekerjaan[row.cells[0].render().toString()] =
														!$checkedPekerjaan[row.cells[0].render().toString()])
											);
											if (onlySelected) showSelected();
										}}>Invert selection</DropdownMenu.Item
									>
									{#if onlySelected || (Object.values($checkedPekerjaan).some((checked) => checked) && Object.values($checkedPekerjaan).some((checked) => !checked))}
										<DropdownMenu.Separator />
										<DropdownMenu.CheckboxItem bind:checked={onlySelected} on:click={showSelected}
											>Show only selected</DropdownMenu.CheckboxItem
										>
									{/if}
								</DropdownMenu.Content>
							</DropdownMenu.Root>
						</Table.Head>
						{#each headerRow.cells as cell (cell.id)}
							{#if hideForId[cell.id]}
								<Subscribe attrs={cell.attrs()} let:attrs props={cell.props()}>
									<Table.Head {...attrs}>
										<Button
											variant="ghost"
											class={`' flex w-full items-center justify-start${cell.id === 'alokasi' ? ' flex-row-reverse' : ''}`}
											on:click={() => sortColumn(cell.id)}
										>
											<Render of={cell.render()} />
											<div
												class="mx-1 transition-all duration-300"
												class:opacity-0={cell.id !== sortedColumn}
											>
												{#if ascending}
													<svg
														in:fade
														xmlns="http://www.w3.org/2000/svg"
														width="1em"
														height="1em"
														viewBox="0 0 16 16"
													>
														<path
															fill="currentColor"
															fill-rule="evenodd"
															d="M1 12.75c0 .414.336.75.75.75h12.5a.75.75 0 0 0 0-1.5H1.75a.75.75 0 0 0-.75.75M3 8c0 .414.336.75.75.75h8.5a.75.75 0 0 0 0-1.5h-8.5A.75.75 0 0 0 3 8m3.75-4a.75.75 0 0 1 0-1.5h2.5a.75.75 0 0 1 0 1.5z"
															clip-rule="evenodd"
														/>
													</svg>{:else}
													<svg
														in:fade
														xmlns="http://www.w3.org/2000/svg"
														width="1em"
														height="1em"
														viewBox="0 0 16 16"
														><path
															fill="currentColor"
															fill-rule="evenodd"
															d="M1 3.25a.75.75 0 0 1 .75-.75h12.5a.75.75 0 0 1 0 1.5H1.75A.75.75 0 0 1 1 3.25M3 8a.75.75 0 0 1 .75-.75h8.5a.75.75 0 0 1 0 1.5h-8.5A.75.75 0 0 1 3 8m3.75 4a.75.75 0 0 0 0 1.5h2.5a.75.75 0 0 0 0-1.5z"
															clip-rule="evenodd"
														/></svg
													>
												{/if}
											</div>
										</Button>
									</Table.Head>
								</Subscribe>
							{/if}
						{/each}
					</Table.Row>
				</Subscribe>
			{/each}
		</Table.Header>
		{#key $pageRows}
			<Table.Body id={'table-pekerjaan'} {...$tableBodyAttrs}>
				{#if $pageRows.length > 0}
					{#each $pageRows as row (row.id)}
						<Subscribe rowAttrs={row.attrs()} let:rowAttrs>
							<Table.Row {...rowAttrs} class="group">
								<Table.Cell class="sticky left-0">
									<Checkbox
										bind:checked={$checkedPekerjaan[row.cells[0].render().toString()]}
										on:click={() =>
											setTimeout(
												() =>
													(checkedAll = Object.keys($checkedPekerjaan)
														.filter((key) =>
															$pageRows.some((row) => row.cells[0].render().toString() === key)
														)
														.every((key) => $checkedPekerjaan[key]))
											)}
									/>
								</Table.Cell>
								{#each row.cells as cell (cell.id)}
									{#if hideForId[cell.id]}
										<Subscribe attrs={cell.attrs()} let:attrs>
											<Table.Cell class="tcell" {...attrs}>
												{#if cell.id === 'alokasi'}
													<div class="text-right">
														<Render of={cell.render()} />
													</div>
												{:else}
													<Render of={cell.render()} />
												{/if}
											</Table.Cell>
										</Subscribe>
									{/if}
								{/each}
								<Table.Cell
									class="sticky right-0 opacity-0 transition-all duration-300 group-hover:opacity-100"
								>
									<PekerjaanActions id={row.id} />
								</Table.Cell>
							</Table.Row>
						</Subscribe>
					{/each}
				{:else}
					<Table.Row>
						<Table.Cell>No Data</Table.Cell>
					</Table.Row>
				{/if}
			</Table.Body>
		{/key}
	</Table.Root>
</div>

<div class="flex items-center justify-end space-x-0 py-4">
	<div class="flex-1 text-sm text-muted-foreground">
		{Object.values($checkedPekerjaan).filter((row) => row).length} of{' '}
		{$pageRows.length} row(s) selected.
	</div>
	<Pagination
		bind:pageSize={$pageSize}
		bind:pageIndex={$pageIndex}
		hasPreviousPage={$hasPreviousPage}
		hasNextPage={$hasNextPage}
		bind:dataSize={dataPekerjaan.length}
	/>
</div>
