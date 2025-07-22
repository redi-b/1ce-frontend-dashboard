<script lang="ts">
	import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import { Badge } from '$lib/components/ui/badge';
	import { Separator } from '$lib/components/ui/separator';
	import { cn } from '$lib/utils.js';
	import Copy from '@lucide/svelte/icons/copy';
	import ExternalLink from '@lucide/svelte/icons/external-link';
	import Trash from '@lucide/svelte/icons/trash-2';
	import AlertTriangle from '@lucide/svelte/icons/alert-triangle';
	import Eye from '@lucide/svelte/icons/eye';
	import Calendar from '@lucide/svelte/icons/calendar';
	import LinkIcon from '@lucide/svelte/icons/link';
	import { Tooltip, TooltipTrigger } from '$lib/components/ui/tooltip';
	import TooltipContent from '$lib/components/ui/tooltip/tooltip-content.svelte';
	import ConfirmDialog from '$lib/components/confirm-dialog.svelte';
	import { PUBLIC_LINKS_URL } from '$env/static/public';
	import {
		formatExpiration,
		getType,
		getUsageColor,
		getUsagePercentage,
		isExpired
	} from '$lib/utils/links';
	import { copyToClipboard } from '$lib/utils/copy';
	import { format, parseISO } from 'date-fns';
	import type { Link } from '$lib/types/links';

	interface Props {
		link: Link;
		onDestroy?: () => void;
		onDelete?: () => void;
		actionLoading?: boolean;
	}

	let { link, onDelete = () => {}, onDestroy = () => {}, actionLoading }: Props = $props();

	const expires = link.expires_at !== '0001-01-01T00:00:00Z';
</script>

<Card class="mx-auto h-full w-full max-w-md">
	<CardHeader class="pb-3">
		<div class="flex items-start justify-between gap-4">
			<div class="min-w-2 flex-1">
				<CardTitle class="truncate text-xl font-semibold">
					/{link.slug}
				</CardTitle>
			</div>
			<div class="flex flex-wrap items-center gap-2">
				{#if link.destroyed}
					<Badge variant="destructive" class="rounded-full font-medium">Destroyed</Badge>
				{/if}
				{#if isExpired(link.expires_at)}
					<Badge
						variant="outline"
						class="rounded-full border-red-200 bg-red-50 font-medium text-red-600"
					>
						Expired
					</Badge>
				{/if}
				<Badge
					class={cn('flex-shrink-0 rounded-full font-medium', {
						'border-blue-200 bg-blue-100 text-blue-700': getType(link) === 'redirect',
						'border-purple-200 bg-purple-100 text-purple-700': getType(link) === 'message'
					})}
					variant="outline"
				>
					{#if getType(link) === 'redirect'}
						<ExternalLink class="mr-1 h-3 w-3" />
						Redirect
					{:else}
						<LinkIcon class="mr-1 h-3 w-3" />
						Message
					{/if}
				</Badge>
			</div>
		</div>
	</CardHeader>

	<CardContent class="space-y-4">
		<!-- Content Preview -->
		<div class="space-y-2">
			{#if getType(link) === 'redirect'}
				<p class="text-sm">Redirects to:</p>
				<p class="bg-accent truncate rounded px-2 py-2 text-sm font-medium text-blue-500">
					{link.redirect_url}
				</p>
			{:else}
				<p class="text-sm">Message:</p>
				<p class="bg-accent line-clamp-3 rounded px-3 py-2 text-sm italic">
					"{link.message}"
				</p>
			{/if}
		</div>

		<Separator />

		<!-- Usage Statistics -->
		<div class="space-y-3">
			<div class="flex items-center justify-between text-sm">
				<span class="flex items-center">
					<Eye class="mr-1 h-4 w-4" />
					Usage
				</span>
				<span class="font-medium">
					{link.views_used} / {link.views_allowed}
				</span>
			</div>

			<!-- Usage Progress Bar -->
			<div class="h-2 w-full rounded-full bg-slate-200">
				<div
					class={cn(
						'h-2 rounded-full transition-all duration-300',
						getUsageColor(getUsagePercentage(link.views_used, link.views_allowed))
					)}
					style="width: {getUsagePercentage(link.views_used, link.views_allowed)}%"
				></div>
			</div>

			<div class="flex items-center justify-between text-sm">
				<span class="flex items-center">
					<Calendar class="mr-1 h-4 w-4" />
					Expiry
				</span>
				<div class="flex flex-col items-end gap-1">
					<span
						class={cn('font-medium', {
							'text-green-600': formatExpiration(link.expires_at) === 'Never expires'
						})}
					>
						{formatExpiration(link.expires_at)}
					</span>
					{#if expires}
						<span class="text-muted-foreground text-xs">
							{format(link.expires_at, 'PPPp')}
						</span>
					{/if}
				</div>
			</div>
		</div>
	</CardContent>

	<CardFooter class="relative flex flex-col gap-3 border-t pt-4">
		<div class="flex w-full gap-2">
			<Button
				onclick={async () => {
					await copyToClipboard(
						`${PUBLIC_LINKS_URL}/${link.slug}`,
						'Link copied to clipboard!',
						'Failed to copy link. Please try again.'
					);
				}}
				variant="outline"
				size="sm"
				class="w-full flex-1"
			>
				<Copy class="mr-1 h-4 w-4" />
				Copy Link
			</Button>

			<ConfirmDialog
				title="Do you want to destroy this link?"
				description="
					Are you sure you want to destroy this link?
					This will make it inaccessible.
					The action cannot be undone.
				"
				action={onDestroy}
				actionText="Destroy"
				disabled={link.destroyed || actionLoading}
			>
				{#snippet trigger({ props: dProps })}
					<Tooltip delayDuration={100}>
						<TooltipTrigger>
							{#snippet child({ props: tProps })}
								<div {...tProps}>
									<Button
										variant="outline"
										size="sm"
										class="not-disabled:hover:text-yellow-500"
										{...dProps}
									>
										<AlertTriangle class="h-4 w-4" />
									</Button>
								</div>
							{/snippet}
						</TooltipTrigger>
						<TooltipContent>
							{#if link.destroyed}
								Link already destroyed
							{:else}
								Destroy Link
							{/if}
						</TooltipContent>
					</Tooltip>
				{/snippet}
			</ConfirmDialog>

			<ConfirmDialog
				title="Do you want to delete this link?"
				description="
					Are you sure you want to delete this link?
					This will permanently remove it from your account.
					The action cannot be undone.
				"
				action={onDelete}
				actionText="Delete"
				disabled={actionLoading}
			>
				{#snippet trigger({ props: dProps })}
					<Tooltip delayDuration={100}>
						<TooltipTrigger disabled={actionLoading}>
							{#snippet child({ props: tProps })}
								<div {...tProps}>
									<Button
										variant="outline"
										size="sm"
										class="not-disabled:hover:text-red-500"
										{...dProps}
									>
										<Trash class="h-4 w-4" />
									</Button>
								</div>
							{/snippet}
						</TooltipTrigger>
						<TooltipContent>Delete Link</TooltipContent>
					</Tooltip>
				{/snippet}
			</ConfirmDialog>
		</div>
		<div class="text-muted-foreground w-full text-end text-xs">
			<span class="font-semibold not-italic">Created at </span>
			<span>
				{format(parseISO(link.created_at), 'PPPp')}
			</span>
		</div>
	</CardFooter>
</Card>
