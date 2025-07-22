<script lang="ts">
	import { Card, CardContent } from '$lib/components/ui/card';
	import { Skeleton } from '$lib/components/ui/skeleton';

	let { cards }: { cards: number } = $props();
</script>

{#each Array(cards) as _}
	<Card class="mx-auto h-full w-full max-w-md">
		<CardContent class="space-y-4 p-6">
			<div class="flex items-start justify-between">
				<Skeleton class="h-6 w-32" />
				<Skeleton class="h-5 w-16 rounded-full" />
			</div>
			<Skeleton class="h-4 w-full" />
			<Skeleton class="h-4 w-3/4" />
			<div class="space-y-2">
				<Skeleton class="h-3 w-1/2" />
				<Skeleton class="h-2 w-full rounded-full" />
				<Skeleton class="h-3 w-1/3" />
			</div>
			<div class="flex gap-2 pt-2">
				<Skeleton class="h-8 flex-1" />
				<Skeleton class="h-8 w-10" />
				<Skeleton class="h-8 w-10" />
			</div>
		</CardContent>
	</Card>
{/each}
