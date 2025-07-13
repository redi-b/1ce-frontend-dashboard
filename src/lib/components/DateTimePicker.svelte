<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Popover, PopoverContent, PopoverTrigger } from '$lib/components/ui/popover';
	import { Card, CardContent, CardFooter } from '$lib/components/ui/card';
	import { Calendar } from '$lib/components/ui/calendar';

	import CalendarIcon from '@lucide/svelte/icons/calendar';

	import { getLocalTimeZone, type DateValue, today, fromDate } from '@internationalized/date';

	type DatePickerPresets = {
		label: string;
		value: number;
	};

	interface Props {
		value: string | null;
		showPresets?: boolean;
		presets?: DatePickerPresets[];
	}

	let { value = $bindable(), showPresets = true, presets }: Props = $props();

	let open = $state(false);

	let date = $state<DateValue | undefined>();
	let time = $state('23:59');

	const todayDate = today(getLocalTimeZone());
	if (showPresets && !presets) {
		presets = [
			{ label: 'Today', value: 0 },
			{ label: 'Tomorrow', value: 1 },
			{ label: 'In 3 days', value: 3 },
			{ label: 'In a week', value: 7 },
			{ label: 'In two weeks', value: 14 }
		] as DatePickerPresets[];
	}

	$effect(() => {
		if (!date || !time) {
			value = null;
			return;
		}

		const dateTime = date.toDate(getLocalTimeZone());

		// Combine date with selected time
		const [hours, minutes, seconds] = time.split(':').map(Number);
		dateTime.setHours(hours ?? 0, minutes ?? 0, seconds ?? 0);

		value = dateTime.toISOString();
	});

	$effect(() => {
		if (!value) {
			date = undefined;
			time = '23:59';
			return;
		}

		const dateTime = fromDate(new Date(value), getLocalTimeZone());
		date = dateTime;
		time = `${dateTime.hour}:${dateTime.minute}`;
	});
</script>

<Popover bind:open>
	<div class="grid w-full grid-cols-2 items-center justify-between gap-2">
		<PopoverTrigger class="justify-start text-left">
			{#snippet child({ props })}
				<Button variant="outline" {...props}>
					<CalendarIcon />
					<span>
						{#if date}
							{date.toDate(getLocalTimeZone()).toLocaleDateString()}
						{:else}
							Date
						{/if}
					</span>
				</Button>
			{/snippet}
		</PopoverTrigger>
		<Input
			type="time"
			bind:value={time}
			disabled={!date}
			class="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
		/>
	</div>
	<PopoverContent class="w-auto p-0">
		<Card class="max-w-[300px] rounded-md">
			<CardContent class="flex px-4">
				<Calendar
					type="single"
					bind:value={date}
					initialFocus
					captionLayout="dropdown"
					onValueChange={() => {
						open = false;
					}}
					isDateDisabled={(date) => {
						return date < todayDate;
					}}
					class="w-full! p-0 [--cell-size:--spacing(9.5)]"
				/>
			</CardContent>
			{#if showPresets && presets}
				<CardFooter class="flex flex-wrap gap-2 border-t px-4 !pt-4">
					{#each presets as preset (preset.value)}
						<Button
							variant="outline"
							size="sm"
							class="flex-1"
							onclick={() => {
								date = todayDate?.add({ days: preset.value });
							}}
						>
							{preset.label}
						</Button>
					{/each}
				</CardFooter>
			{/if}
		</Card>
	</PopoverContent>
</Popover>
