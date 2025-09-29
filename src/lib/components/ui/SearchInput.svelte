<script lang="ts">
	import { Search, X } from 'lucide-svelte';

	let {
		value = $bindable(''),
		placeholder = 'Search...',
		disabled = false,
		loading = false,
		onSearch
	}: {
		value?: string;
		placeholder?: string;
		disabled?: boolean;
		loading?: boolean;
		onSearch?: (value: string) => void;
	} = $props();

	let inputRef: HTMLInputElement;

	function clear() {
		value = '';
		if (onSearch) {
			onSearch('');
		}
		inputRef.focus();
	}

	$effect(() => {
		if (onSearch) {
			const handler = setTimeout(() => {
				if (onSearch) {
					onSearch(value);
				}
			}, 300);

			return () => {
				clearTimeout(handler);
			};
		}
	});
</script>

<div class="relative">
	<div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
		{#if loading}
			<span class="loading loading-spinner loading-xs text-base-content/50"></span>
		{:else}
			<Search class="h-5 w-5 text-base-content/50" />
		{/if}
	</div>
	<input
		bind:this={inputRef}
		type="text"
		bind:value
		{placeholder}
		{disabled}
		class="input input-bordered w-full pl-10"
	/>
	{#if value}
		<div class="absolute inset-y-0 right-0 flex items-center pr-3">
			<button onclick={clear} class="btn btn-ghost btn-circle btn-xs">
				<X class="h-4 w-4" />
			</button>
		</div>
	{/if}
</div>