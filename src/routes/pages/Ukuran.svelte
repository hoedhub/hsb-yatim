<script lang="ts">
	import { Separator } from '$lib/components/ui/separator/index.js';
	import { db, type Pekerjaan } from '$lib/utils/db';
	import { liveQuery, type Observable } from 'dexie';
	import Button from '$lib/components/ui/button/button.svelte';

	import { onMount, onDestroy } from 'svelte';
	import FormPekerjaan from '$lib/components/structure/FormPekerjaan.svelte';
	import PekerjaanSelector from '$lib/components/structure/PekerjaanSelector.svelte';

	let expanded: boolean = true;
	let tabValue: string = 'Tabel';
	let tabs: { val: string; mode?: string; pg: any; row?: any; el?: any }[] = [
		{ val: 'Tabel', pg: '' }
	];
	const pekerjaanBaru = () => {};
	const pekerjaanEdit = () => {};
	const pekerjaanHapus = () => {};
</script>

<PekerjaanSelector bind:expanded />
<div
	class="fixed bottom-2 top-0 mt-12 min-h-0 w-full transition-all duration-300"
	class:ml-56={expanded}
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
	</div>
</div>
