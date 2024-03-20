<script lang="ts">
	import date from 'date-and-time';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/';
	import { createTable, Render, Subscribe, createRender } from 'svelte-headless-table';
	import { readable } from 'svelte/store';

	import type { DataPekerjaan } from '$lib/types';

	import { addPagination, addHiddenColumns } from 'svelte-headless-table/plugins';
	import PekerjaanActions from '$lib/components/utils/PekerjaanActions.svelte';

	import * as Table from '$lib/components/ui/table';
	import { Input } from '$lib/components/ui/input';
	import { Checkbox } from '$lib/components/ui/checkbox';
	import { Button } from '$lib/components/ui/button';
	import { fade } from 'svelte/transition';
	import { onMount } from 'svelte';

	export let dataPekerjaan: DataPekerjaan[] = [];

	const table = createTable(readable(dataPekerjaan), {
		page: addPagination(),
		hide: addHiddenColumns()
	});

	const columns = table.createColumns([
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

	const { headerRows, pageRows, tableAttrs, tableBodyAttrs, pluginStates, flatColumns } =
		table.createViewModel(columns);

	const { hasNextPage, hasPreviousPage, pageIndex } = pluginStates.page;
	const { hiddenColumnIds } = pluginStates.hide;

	const ids = flatColumns.map((col) => col.id);
	let hideForId = Object.fromEntries(ids.map((id) => [id, true]));

	$: $hiddenColumnIds = Object.entries(hideForId)
		.filter(([, hide]) => !hide)
		.map(([id]) => id);

	const hidableCols = ['id', 'pekerjaan', 'alokasi', 'tanggal_masuk', 'status'];

	let checkedRows: { [key: string]: boolean } = {};
	let checkedAll = false;

	$pageRows.forEach((row) => (checkedRows[row.id] = false));
	let sortedColumn = '';
	let ascending = false;
	const sortColumn = (colId: string) => {
		ascending = colId === sortedColumn ? !ascending : true;
		sortedColumn = colId;
	};
	onMount(() => ($hiddenColumnIds = ['id']));
</script>

<div class="flex items-center py-4">
	<Input class="max-w-sm" placeholder="Cari..." type="text" readonly={$pageRows.length > 2} />
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
						<Table.Head>
							<Checkbox
								bind:checked={checkedAll}
								on:click={() =>
									$pageRows.forEach((row) => setTimeout(() => (checkedRows[row.id] = checkedAll)))}
							/>
						</Table.Head>
						{#each headerRow.cells as cell (cell.id)}
							<Subscribe attrs={cell.attrs()} let:attrs props={cell.props()}>
								<Table.Head {...attrs}>
									<Button
										variant="ghost"
										class={`' flex items-center justify-between${cell.id === 'alokasi' ? ' flex-row-reverse' : ''}`}
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
						{/each}
					</Table.Row>
				</Subscribe>
			{/each}
		</Table.Header>
		<Table.Body {...$tableBodyAttrs}>
			{#if $pageRows.length > 0}
				{#each $pageRows as row (row.id)}
					<Subscribe rowAttrs={row.attrs()} let:rowAttrs>
						<Table.Row {...rowAttrs} class="group">
							<Table.Cell class="sticky left-0">
								<Checkbox
									bind:checked={checkedRows[row.id]}
									on:click={() =>
										setTimeout(() => (checkedAll = Object.values(checkedRows).every((row) => row)))}
								/>
							</Table.Cell>
							{#each row.cells as cell (cell.id)}
								<Subscribe attrs={cell.attrs()} let:attrs>
									<Table.Cell {...attrs}>
										{#if cell.id === 'alokasi'}
											<div class="text-right">
												<Render of={cell.render()} />
											</div>
										{:else}
											<Render of={cell.render()} />
										{/if}
									</Table.Cell>
								</Subscribe>
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
	</Table.Root>
</div>

<div class="flex items-center justify-end space-x-4 py-4">
	<div class="flex-1 text-sm text-muted-foreground">
		{Object.values(checkedRows).filter((row) => row).length} of{' '}
		{$pageRows.length} row(s) selected.
	</div>
	<Button
		variant="outline"
		size="sm"
		on:click={() => ($pageIndex = $pageIndex - 1)}
		disabled={!$hasPreviousPage}>Previous</Button
	>
	<Button
		variant="outline"
		size="sm"
		disabled={!$hasNextPage}
		on:click={() => ($pageIndex = $pageIndex + 1)}>Next</Button
	>
</div>
