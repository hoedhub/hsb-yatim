<script lang="ts">
	import { pageId } from '$lib/stores';
	import { scrollIntoViewIfNeeded } from '$lib/utils/functions';
	let xpand = false;
	const menus = ['HSB Yatim', 'pekerjaan', 'ukuran', 'baju', 'celana'];
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
	class="absolute inset-y-0 left-0 z-50 w-[52px] border-r bg-gray-200 p-2 pl-1 transition-all duration-300 hover:w-44"
	on:mousemove={() => (xpand = true)}
	on:mouseleave={() => (xpand = false)}
>
	{#each menus as menu, id}
		<button
			class:bg-gray-300={id === $pageId}
			class="my-2 ml-[2px] flex w-full items-center justify-start space-x-2 p-2 transition-all duration-300 hover:opacity-75 hover:shadow-lg"
			on:click={() => {
				$pageId = id;
				setTimeout(() => scrollIntoViewIfNeeded(menu.toLowerCase().replace(/\s/g, '_')));
			}}
		>
			<div>
				{#if id === 0}
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="1em"
						height="1em"
						viewBox="0 0 24 24"
						class="h-6 w-6"
					>
						<path
							fill="currentColor"
							d="M13 9V3h8v6zM3 13V3h8v10zm10 8V11h8v10zM3 21v-6h8v6zm2-10h4V5H5zm10 8h4v-6h-4zm0-12h4V5h-4zM5 19h4v-2H5zm4-2"
						/>
					</svg>
				{:else if id === 1}
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="1em"
						height="1em"
						viewBox="0 0 512 512"
						class="h-6 w-6"
					>
						<path
							fill="currentColor"
							d="m61.67 119.8l-12.69 68.3c-5.47 29.6-1.02 60.1 12.69 86.8h51.03V119.8zm68.63 0v115.6h2.9c6.2 0 11.2-5.1 11.2-11.3V119.8zm31.8 0v104.3c0 15.9-12.9 28.8-28.9 28.8h-2.9v81.7h14.9v-59.7h19.6s7.6-15.3 13.6-27.7c4.7-9.2 14.1-15.1 24.5-15.1h80.2c15 0 27.2 12.1 27.2 27.1v91.5H25.95l10.57 68.5H455.1l10.5-63.1l-21.1-236.3zm310.1 23.4c-4.9.4-8.5 4.7-8 9.5l4.3 47.4c.4 4.8 4.7 8.4 9.5 8c4.9-.4 8.4-4.8 8-9.6l-4.2-47.3c-.4-4.5-4.2-8-8.7-8zm-86.8.1c21.7 0 39.2 17.5 39.2 39.2c0 21.7-17.5 39.2-39.2 39.2c-21.7 0-39.2-17.5-39.2-39.2c0-21.7 17.5-39.2 39.2-39.2m0 17.5c-11.9 0-21.7 9.8-21.7 21.7c0 12 9.8 21.7 21.7 21.7c11.9 0 21.7-9.7 21.7-21.7c0-11.9-9.8-21.7-21.7-21.7m0 89.9c26.6 0 48.2 21.7 48.2 48.2c0 26.6-21.6 48.2-48.2 48.2s-48.2-21.6-48.2-48.2c0-26.5 21.6-48.2 48.2-48.2m0 17.6c-16.9 0-30.6 13.7-30.6 30.6c0 16.9 13.7 30.5 30.6 30.5c16.9 0 30.5-13.6 30.5-30.5s-13.6-30.6-30.5-30.6M92.71 287.8v17.6h20.09v-17.6zM36.52 438.9v26.5H454.9v-26.5z"
						/>
					</svg>
				{:else if id === 2}
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="1em"
						height="1em"
						viewBox="0 0 48 48"
						class="h-6 w-6"
						><path
							fill="none"
							stroke="currentColor"
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M17.143 18.957c-.49.201.13.552.473.554a.969.969 0 0 0 1.07-1.188c-.307-.865-1.757-1.213-2.887-.94c-1.629.395-2.257 1.74-1.638 2.799c.812 1.392 3.249 1.916 5.165 1.331c2.384-.727 3.266-2.762 2.2-4.357c-1.28-1.913-4.71-2.612-7.389-1.718c-3.13 1.045-4.265 3.767-2.755 5.886c1.732 2.428 6.15 3.302 9.577 2.101c3.87-1.355 5.255-4.76 3.304-7.393c-2.175-2.939-7.571-3.986-11.738-2.482c-4.602 1.661-6.235 5.741-3.85 8.886c2.613 3.444 8.98 4.662 13.88 2.858c5.327-1.963 7.207-6.714 4.39-10.364c-3.047-3.946-10.378-5.336-16.003-3.232c-6.05 2.262-8.175 7.68-4.928 11.831c2.065 2.641 5.994 4.413 10.296 4.708"
						/><path
							fill="none"
							stroke="currentColor"
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M16.31 28.237H43.5v9.043H16.24c-6.618 0-11.735-4.41-11.735-10.173v-7.912m5.086 16.163v-2.26m3.391 3.617v-4.522m3.391 5.087v-2.26m3.391 2.26v-4.522m3.39 4.522v-2.26m3.392 2.26v-4.522m3.39 4.522v-2.26m6.782 2.26v-2.26m-3.39 2.26v-4.522m6.781 4.522v-4.522m-11.868-4.634v-9.833"
						/>
					</svg>{:else if id === 3}
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="1em"
						height="1em"
						viewBox="0 0 512 512"
						class="h-6 w-6"
						><path
							fill="currentColor"
							d="M256 96c33.08 0 60.71-25.78 64-58c.3-3-3-6-6-6a13 13 0 0 0-4.74.9c-.2.08-21.1 8.1-53.26 8.1s-53.1-8-53.26-8.1a16.21 16.21 0 0 0-5.3-.9h-.06a5.69 5.69 0 0 0-5.38 6c3.35 32.16 31 58 64 58"
						/><path
							fill="currentColor"
							d="M485.29 89.9L356 44.64a4 4 0 0 0-5.27 3.16a96 96 0 0 1-189.38 0a4 4 0 0 0-5.35-3.16L26.71 89.9A16 16 0 0 0 16.28 108l16.63 88a16 16 0 0 0 13.92 12.9l48.88 5.52a8 8 0 0 1 7.1 8.19l-7.33 240.9a16 16 0 0 0 9.1 14.94A17.49 17.49 0 0 0 112 480h288a17.49 17.49 0 0 0 7.42-1.55a16 16 0 0 0 9.1-14.94l-7.33-240.9a8 8 0 0 1 7.1-8.19l48.88-5.52a16 16 0 0 0 13.92-12.9l16.63-88a16 16 0 0 0-10.43-18.1"
						/>
					</svg>{:else if id === 4}
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="1em"
						height="1em"
						viewBox="0 0 48 48"
						class="h-6 w-6"
						><g
							fill="none"
							stroke="#000"
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="4"
							><path d="M33 44H42L38 4H10L6 44H15L24 19L33 44Z" /><path d="M24 4V9.5" /><path
								d="M17.0004 4C17.0004 4 17.0004 10 15.0004 12C13.0004 14 8.90039 15 8.90039 15"
							/><path d="M31 4C31 4 31 10 33 12C35 14 39.1 15 39.1 15" /></g
						>
					</svg>
				{/if}
			</div>
			<h4
				class:scale-x-0={!xpand}
				class:opacity-0={!xpand}
				class="origin-left whitespace-nowrap text-start font-medium capitalize transition-all duration-300"
			>
				{menu}
			</h4>
		</button>
	{/each}
</div>
