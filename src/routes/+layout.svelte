<script lang="ts">
	import '../app.pcss';
	import { Toaster } from '$lib/components/ui/sonner';
	import { dev } from '$app/environment';
	import Dexie from 'dexie';
	const deleteDB = () => {
		Dexie.delete('hsbyatim')
			.then(() => {
				console.log('Database successfully deleted');
			})
			.catch((err) => {
				console.error('Could not delete database');
			});
	};
</script>

<Toaster richColors expand={true} closeButton />
<slot />
{#if dev}
	<button class="absolute bottom-2 right-2 bg-red-500 p-2 text-white" on:click={deleteDB}
		>Delete DB</button
	>
{/if}
