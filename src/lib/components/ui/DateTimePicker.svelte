<script lang="ts">
	import { onMount } from 'svelte';
	import date from 'date-and-time';
	import { Calendar as CalendarPrimitive } from 'bits-ui';
	import { DateFormatter, getLocalTimeZone, today } from '@internationalized/date';
	import * as Calendar from '$lib/components/ui/calendar/index.js';
	import * as Select from '$lib/components/ui/select/index.js';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { cn } from '$lib/utils.js';
	import Input from './input/input.svelte';

	type $$Props = {
		value?: CalendarPrimitive.Props['value'];
		placeholder?: CalendarPrimitive.Props['placeholder'];
		weekdayFormat?: CalendarPrimitive.Props['weekdayFormat'];
		dtValue?: string | undefined;
		class?: string | null;
		onChange?: (value?: string | undefined) => void; // Added 'undefined' as a possible value
	};
	type $$Events = CalendarPrimitive.Events;

	export let value: $$Props['value'] = undefined;
	export let placeholder: $$Props['placeholder'] = today(getLocalTimeZone());
	export let weekdayFormat: $$Props['weekdayFormat'] = 'short';

	const monthOptions = [
		'January',
		'February',
		'March',
		'April',
		'May',
		'June',
		'July',
		'August',
		'September',
		'October',
		'November',
		'December'
	].map((month, i) => ({ value: i + 1, label: month }));

	const monthFmt = new DateFormatter('en-US', {
		month: 'long'
	});

	const yearOptions = Array.from({ length: 100 }, (_, i) => ({
		label: String(new Date().getFullYear() - i),
		value: new Date().getFullYear() - i
	}));

	$: defaultYear = placeholder
		? {
				value: placeholder.year,
				label: String(placeholder.year)
			}
		: undefined;

	$: defaultMonth = placeholder
		? {
				value: placeholder.month,
				label: monthFmt.format(placeholder.toDate(getLocalTimeZone()))
			}
		: undefined;

	//get hour value of the hour input reactively
	let hour = date.format(new Date(), 'HH');
	$: hour = String(hour).padStart(2, '0');
	//get hour value of the hour input reactively
	let minute = date.format(new Date(), 'mm');
	$: minute = String(minute).padStart(2, '0');
	export let dtValue: string = '';
	$: if (value) {
		dtValue =
			date.format(value.toDate(getLocalTimeZone()), 'YYYY-MM-DD') + ' ' + hour + ':' + minute;
		onChange();
	}
	let timeChange = false;
	$: if (timeChange) {
		dtValue =
			(dtValue ? dtValue.split(' ')[0] : date.format(new Date(), 'YYYY-MM-DD')) +
			' ' +
			hour +
			':' +
			minute;
		timeChange = false;
		onChange();
	}
	export let onChange = () => {};
	let className: $$Props['class'] = undefined;
	export { className as class };
</script>

<Popover.Root>
	<Popover.Trigger asChild let:builder>
		<Button
			variant="outline"
			size="sm"
			class={cn('w-fit justify-start text-left font-normal', !value && 'text-muted-foreground')}
			builders={[builder]}
		>
			{dtValue ? dtValue : 'Pilih tanggal cetak...'}
		</Button>
	</Popover.Trigger>
	<Popover.Content class="w-auto p-0" align="start">
		<CalendarPrimitive.Root
			bind:value
			bind:placeholder
			{weekdayFormat}
			class={cn('rounded-md border p-3', className)}
			{...$$restProps}
			on:keydown
			let:months
			let:weekdays
		>
			<Calendar.Header>
				<Calendar.Heading class="flex w-full items-center justify-between gap-2">
					<Select.Root
						selected={defaultMonth}
						items={monthOptions}
						onSelectedChange={(v) => {
							if (!v || !placeholder) return;
							if (v.value === placeholder?.month) return;
							placeholder = placeholder.set({ month: v.value });
						}}
					>
						<Select.Trigger aria-label="Select month" class="w-[60%]">
							<Select.Value placeholder="Select month" />
						</Select.Trigger>
						<Select.Content class="max-h-[200px] overflow-y-auto">
							{#each monthOptions as { value, label }}
								<Select.Item {value} {label}>
									{label}
								</Select.Item>
							{/each}
						</Select.Content>
					</Select.Root>
					<Select.Root
						selected={defaultYear}
						items={yearOptions}
						onSelectedChange={(v) => {
							if (!v || !placeholder) return;
							if (v.value === placeholder?.year) return;
							placeholder = placeholder.set({ year: v.value });
						}}
					>
						<Select.Trigger aria-label="Select year" class="w-[40%]">
							<Select.Value placeholder="Select year" />
						</Select.Trigger>
						<Select.Content class="max-h-[200px] overflow-y-auto">
							{#each yearOptions as { value, label }}
								<Select.Item {value} {label}>
									{label}
								</Select.Item>
							{/each}
						</Select.Content>
					</Select.Root>
				</Calendar.Heading>
			</Calendar.Header>
			<Calendar.Months>
				{#each months as month}
					<Calendar.Grid>
						<Calendar.GridHead>
							<Calendar.GridRow class="flex">
								{#each weekdays as weekday}
									<Calendar.HeadCell>
										{weekday.slice(0, 2)}
									</Calendar.HeadCell>
								{/each}
							</Calendar.GridRow>
						</Calendar.GridHead>
						<Calendar.GridBody>
							{#each month.weeks as weekDates}
								<Calendar.GridRow class="mt-2 w-full">
									{#each weekDates as date}
										<Calendar.Cell {date}>
											<Calendar.Day {date} month={month.value} />
										</Calendar.Cell>
									{/each}
								</Calendar.GridRow>
							{/each}
						</Calendar.GridBody>
					</Calendar.Grid>
				{/each}
			</Calendar.Months>
		</CalendarPrimitive.Root>
		<div class="ml-2 flex items-center space-x-2 p-2">
			<div>Jam</div>
			<div class="flex items-center">
				<Input
					id="hour"
					class="w-16"
					type="number"
					min={0}
					max={23}
					bind:value={hour}
					on:change={() => (timeChange = true)}
				/>
				:
				<Input
					id="minute"
					class="w-16"
					type="number"
					min={0}
					max={59}
					bind:value={minute}
					on:change={() => (timeChange = true)}
				/>
			</div>
		</div>
	</Popover.Content>
</Popover.Root>
