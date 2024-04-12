<script lang="ts">
	import { Tooltip } from 'bits-ui';

	export let pageSize: number = 10;
	export let sizes: number[] = [10, 20, 30];
	export let pageIndex: number = 0;
	export let hasPreviousPage: boolean = false;
	export let hasNextPage: boolean = false;
	export let dataSize: number = 10;
</script>

<div class="flex items-center justify-end space-x-1 py-4">
	<Tooltip.Root>
		<Tooltip.Trigger>
			<select
				class="mx-2 rounded-sm bg-transparent p-1 text-xs text-muted-foreground ring-1 ring-muted-foreground ring-opacity-20"
				bind:value={pageSize}
			>
				{#each sizes as size}
					<option class="bg-background" value={size}>{size}</option>
				{/each}
			</select>
		</Tooltip.Trigger>
		<Tooltip.Content>Baris per halaman</Tooltip.Content>
	</Tooltip.Root>
	<Tooltip.Root>
		<Tooltip.Trigger>
			<button
				class="m-1 rounded p-1 ring-1 ring-muted-foreground ring-opacity-20"
				class:hover:text-muted-foreground={pageIndex !== 0}
				class:hover:bg-accent={pageIndex !== 0}
				class:text-muted-foreground={pageIndex === 0}
				class:disabled={pageIndex === 0}
				disabled={pageIndex === 0}
				on:click={() => (pageIndex = 0)}
			>
				<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 20 20">
					<path fill="currentColor" d="M3 1h2v18H3zm13.5 1.5L15 1l-9 9l9 9l1.5-1.5L9 10z" />
				</svg>
			</button>
		</Tooltip.Trigger>
		{#if pageIndex !== 0}
			<Tooltip.Content>Halaman pertama</Tooltip.Content>
		{/if}
	</Tooltip.Root>
	<Tooltip.Root>
		<Tooltip.Trigger>
			<button
				class="m-1 rounded p-1 ring-1 ring-muted-foreground ring-opacity-20"
				class:hover:bg-accent={hasPreviousPage}
				class:hover:text-muted-foreground={hasPreviousPage}
				class:text-muted-foreground={!hasPreviousPage}
				class:disabled={!hasPreviousPage}
				disabled={!hasPreviousPage}
				on:click={() => (pageIndex = pageIndex - 1)}
			>
				<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 20 20">
					<path fill="currentColor" d="m4 10l9 9l1.4-1.5L7 10l7.4-7.5L13 1z" />
				</svg>
			</button>
		</Tooltip.Trigger>
		{#if hasPreviousPage}
			<Tooltip.Content>Halaman sebelumnya</Tooltip.Content>
		{/if}
	</Tooltip.Root>
	<div class="m-1 flex-1 text-sm text-muted-foreground">
		{pageIndex + 1} of {Math.ceil(dataSize / pageSize)}
	</div>
	<Tooltip.Root>
		<Tooltip.Trigger>
			<button
				class="m-1 rounded p-1 ring-1 ring-muted-foreground ring-opacity-20"
				class:hover:bg-accent={hasNextPage}
				class:hover:text-muted-foreground={hasNextPage}
				class:text-muted-foreground={!hasNextPage}
				class:disabled={!hasNextPage}
				disabled={!hasNextPage}
				on:click={() => (pageIndex = pageIndex + 1)}
			>
				<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 20 20">
					<path fill="currentColor" d="M7 1L5.6 2.5L13 10l-7.4 7.5L7 19l9-9z" />
				</svg>
			</button>
		</Tooltip.Trigger>
		{#if hasNextPage}
			<Tooltip.Content>Halaman selanjutnya</Tooltip.Content>
		{/if}
	</Tooltip.Root>
	<Tooltip.Root>
		<Tooltip.Trigger>
			<button
				class="m-1 rounded p-1 ring-1 ring-muted-foreground ring-opacity-20"
				class:hover:bg-accent={hasNextPage}
				class:hover:text-muted-foreground={hasNextPage}
				class:text-muted-foreground={!hasNextPage}
				class:disabled={!hasNextPage}
				disabled={!hasNextPage}
				on:click={() => (pageIndex = dataSize - 1)}
			>
				<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 20 20">
					<path fill="currentColor" d="M15 1h2v18h-2zM3.5 2.5L11 10l-7.5 7.5L5 19l9-9l-9-9z" />
				</svg>
			</button>
		</Tooltip.Trigger>
		{#if hasNextPage}
			<Tooltip.Content>Halaman terakhir</Tooltip.Content>
		{/if}
	</Tooltip.Root>
</div>
