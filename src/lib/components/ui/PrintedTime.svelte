<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import DateTimePicker from './DateTimePicker.svelte';

	export let timesString: string;

	//make sure timestring is multiline of time strings or empty
	function isValidDateTime(dateTime: string) {
		const dateTimeFormat = /^\d{4}-\d{2}-\d{2} ([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
		return dateTimeFormat.test(dateTime);
	}

	let dtValue: string;

	let onTimeString = () => {
		let newTimesString = [];
		setTimeout(() => {
			let buttons = container.getElementsByTagName('button');
			for (let i = 0; i < buttons.length; i++) {
				newTimesString.push(buttons[i].textContent);
			}
			timesString = newTimesString.join('\n');
		});
		console.log('changing');
	};
	let container: HTMLDivElement;
	$: console.log('timeString', timesString);
</script>

<p>Riwayat Cetak</p>
<div class="flex space-x-2">
	<div bind:this={container} class="block rounded-md border p-1">
		{#if timesString}
			{#key timesString}
				{#each [...timesString.split('\n').filter((t) => isValidDateTime(t))].sort((a, b) => {
					const dateA = new Date(a.split(' ')[0] + 'T' + a.split(' ')[1]);
					const dateB = new Date(b.split(' ')[0] + 'T' + b.split(' ')[1]);
					return dateA > dateB ? 1 : dateA < dateB ? -1 : 0;
				}) as ta (ta)}
					<div class="flex items-center justify-between">
						<DateTimePicker bind:dtValue={ta} onChange={onTimeString} />
						<Button
							variant="ghost"
							class="text-red-500"
							on:click={() =>
								(timesString = timesString
									.split('\n')
									.filter((t) => t !== ta)
									.join('\n'))}>&Cross;</Button
						>
					</div>
				{/each}
			{/key}
		{:else}
			Belum pernah dicetak.
		{/if}
	</div>
	<DateTimePicker bind:dtValue />
	{#if dtValue}
		<Button
			on:click={() => {
				timesString = timesString
					? [...timesString?.split('\n').filter((t) => t !== dtValue), dtValue].join('\n')
					: dtValue;
				dtValue = '';
			}}
		>
			Tambahkan
		</Button>
	{/if}
</div>
