<script lang="ts">
	import AlertTriangle from '@lucide/svelte/icons/alert-triangle';
	import LinkIcon from '@lucide/svelte/icons/link';
	import LinkCard from './LinkCard.svelte';
	import LinkCardSkeleton from './LinkCardSkeleton.svelte';
	import { toast } from 'svelte-sonner';
	import { slide } from 'svelte/transition';
	import { invalidate } from '$app/navigation';
	import type { Link } from '$lib/types/links';
	import { navigating } from '$app/state';

	let { data } = $props();

	let links: Link[] = $state(data?.links || []);

	let actionLoading = $state(false);

	async function destroyLink(id: string) {
		actionLoading = true;
		toast.promise(
			() =>
				fetch(`/api/links`, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({ id })
				})
					.then((res) => {
						if (!res.ok) throw new Error('Failed to destroy link');
						links = links.map((link: any) =>
							link.id === id ? { ...link, destroyed: true } : link
						);
					})
					.catch((err) => {
						console.error('Error destroying link:', err);
						throw err;
					})
					.finally(() => {
						actionLoading = false;
					}),
			{
				richColors: true,
				loading: 'Destroying link...',
				success: 'Link destroyed successfully!',
				error: 'Failed to destroy link. Please try again.',
				dismiss: false
			}
		);
	}

	async function deleteLink(id: string) {
		actionLoading = true;
		toast.promise(
			() =>
				fetch(`/api/links`, {
					method: 'DELETE',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({ id })
				})
					.then((res) => {
						if (!res.ok) throw new Error('Failed to delete link');
						links = links.filter((link: any) => link.id !== id);
						invalidate('data:links');
					})
					.catch((err) => {
						console.error('Error deleting link:', err);
						throw err;
					})
					.finally(() => {
						actionLoading = false;
					}),
			{
				richColors: true,
				loading: 'Deleting link...',
				success: 'Link deleted successfully!',
				error: 'Failed to delete link. Please try again.',
				dismiss: false
			}
		);
	}
</script>

<svelte:head>
	<title>Links - 1ce</title>
	<meta name="description" content="Manage your links on 1ce" />
</svelte:head>

<div class="mx-auto flex h-full max-w-6xl space-y-8 px-4 py-6 md:px-8">
	{#if data?.success}
		{#if links.length === 0}
			<div class="mx-auto self-center text-center">
				<LinkIcon class="mx-auto mb-4 h-12 w-12" />
				<p class="text-lg">No links found.</p>
				<p class="mt-2 text-sm">Create your first link to get started</p>
			</div>
		{:else}
			<div class="grid w-full grid-cols-1 gap-6 max-lg:justify-center lg:grid-cols-2">
				{#each links as link (link.slug)}
					<div class="h-fit w-full" transition:slide>
						<LinkCard
							{link}
							onDestroy={() => destroyLink(link.id)}
							onDelete={() => deleteLink(link.id)}
							{actionLoading}
						/>
					</div>
				{/each}
			</div>
		{/if}
	{:else if data?.error}
		<div class="mx-auto self-center text-center text-red-500">
			<AlertTriangle class="mx-auto mb-4 h-12 w-12" />
			<p class="text-lg font-medium">{data.error}</p>
		</div>
	{:else}
		<!-- Loading State -->
		<div class="grid w-full grid-cols-1 gap-6 max-lg:justify-center lg:grid-cols-2">
			<LinkCardSkeleton cards={2} />
		</div>
	{/if}
</div>
