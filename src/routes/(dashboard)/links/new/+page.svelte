<script lang="ts">
	import { enhance } from '$app/forms';

	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Textarea } from '$lib/components/ui/textarea';
	import { Select, SelectItem, SelectTrigger, SelectContent } from '$lib/components/ui/select';
	import { Alert, AlertDescription } from '$lib/components/ui/alert';
	import { Switch } from '$lib/components/ui/switch';

	import TriangleAlert from '@lucide/svelte/icons/triangle-alert';
	import LockKeyhole from '@lucide/svelte/icons/lock-keyhole';
	import Clock from '@lucide/svelte/icons/clock-10';

	import { format, formatDistanceToNow } from 'date-fns';

	import DateTimePicker from '$lib/components/DateTimePicker.svelte';

	import CreatedAlert from './CreatedAlert.svelte';

	let { form } = $props();

	let loading = $state(false);

	let hasPassword = $state(false);
	let hasExpiry = $state(false);

	let linkType = $state<'message' | 'redirect'>('message');

	let expiresAt: string | null = $state(null);
	let expiryNote = $derived.by(() => {
		if (!expiresAt) return null;

		const localDate = new Date(expiresAt);

		const formatted = format(localDate, "EEE, MMM d, yyyy 'at' hh:mm a");
		const relative = formatDistanceToNow(localDate, { addSuffix: true });

		return `Link will expire ${relative} (${formatted})`;
	});
</script>

<svelte:head>
	<title>Create New Link</title>
	<meta name="description" content="Create a new link with custom settings." />
</svelte:head>

{#if form?.success}
	<CreatedAlert
		slug={form.link.slug}
		clear={() => {
			form = null;
		}}
	/>
{:else}
	<form
		use:enhance={() => {
			loading = true;
			return async ({ update }) => {
				loading = false;
				await update();
			};
		}}
		method="POST"
		class="mx-auto w-full max-w-xl space-y-4 px-2 py-4"
	>
		<div>
			<Label class="mb-1.5" for="type">Type</Label>
			<input type="hidden" name="type" value={linkType} />
			<Select type="single" bind:value={linkType}>
				<SelectTrigger id="type" class="w-full cursor-pointer">
					{#if linkType}
						{linkType[0].toUpperCase() + linkType.slice(1)}
					{:else}
						'Select link type'
					{/if}
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="message">Message</SelectItem>
					<SelectItem value="redirect">Redirect</SelectItem>
				</SelectContent>
			</Select>
		</div>

		<div>
			<Label class="mb-1.5" for="slug">Slug</Label>
			<Input id="slug" name="slug" placeholder="your-custom-slug" />
		</div>

		{#if linkType === 'message'}
			<div>
				<Label class="mb-1.5" for="message">Message</Label>
				<Textarea id="message" name="message" placeholder="Enter your message..." />
			</div>
		{:else}
			<div>
				<Label class="mb-1.5" for="redirect_url">Redirect URL</Label>
				<Input id="redirect_url" name="redirect_url" type="url" placeholder="https://example.com" />
			</div>
		{/if}

		<div>
			<Label class="mb-1.5" for="views_allowed">Views Allowed</Label>
			<Input id="views_allowed" name="views_allowed" type="number" min="1" defaultValue="1" />
		</div>

		<div class="flex gap-4">
			<Switch id="has_password" bind:checked={hasPassword} />
			<Label for="has_password" class="flex items-center gap-2">
				<LockKeyhole size={18} />
				Password Protection
			</Label>
		</div>
		{#if hasPassword}
			<div>
				<Label class="mb-1.5" for="password">Password</Label>
				<Input id="password" name="password" type="password" />
			</div>
		{/if}

		<div class="flex gap-4">
			<Switch id="has_expiry" bind:checked={hasExpiry} />
			<Label for="has_expiry" class="flex items-center gap-2">
				<Clock size={18} />
				Expiry Date
			</Label>
		</div>
		{#if hasExpiry}
			<div>
				<Label class="mb-1.5">Expires At</Label>
				<input name="expires_at" type="hidden" value={expiresAt} />
				<DateTimePicker bind:value={expiresAt} />
				{#if expiresAt}
					<div class="mt-2 flex items-center justify-between">
						<p class="text-muted-foreground text-sm">{expiryNote}</p>
						<button
							type="button"
							class=" text-theme cursor-pointer text-sm hover:underline"
							onclick={() => (expiresAt = null)}
						>
							Remove
						</button>
					</div>
				{/if}
			</div>
		{/if}

		{#if form?.error}
			<Alert class="mt-4 border-red-400" variant="destructive">
				<TriangleAlert />
				<AlertDescription>{form.error}</AlertDescription>
			</Alert>
		{/if}

		<Button type="submit" disabled={loading} class="w-full">
			{loading ? 'Creating...' : 'Create Link'}
		</Button>
	</form>
{/if}
