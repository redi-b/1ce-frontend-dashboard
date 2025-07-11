<script lang="ts">
	import { enhance } from '$app/forms';
	import { Button } from '$lib/components/ui/button';
	import {
		Card,
		CardHeader,
		CardTitle,
		CardDescription,
		CardContent
	} from '$lib/components/ui/card';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import * as Alert from '$lib/components/ui/alert';

	import CircleAlert from '@lucide/svelte/icons/circle-alert';
	import CircleCheckBig from '@lucide/svelte/icons/circle-check-big';
	import LoaderCircle from '@lucide/svelte/icons/loader-circle';

	let { form } = $props();

	let isSubmitting = $state(false);
</script>

<svelte:head>
	<title>Sign Up - 1ce</title>
	<meta name="description" content="Sign up for a new 1ce account" />
</svelte:head>

<Card class="w-full max-w-sm">
	<CardHeader class="text-center">
		<CardTitle class="text-xl">Welcome!</CardTitle>
		<CardDescription>Create a new account to get started with 1ce</CardDescription>
	</CardHeader>
	<CardContent>
		<form
			method="POST"
			use:enhance={() => {
				isSubmitting = true;
				return async ({ update }) => {
					await update();
					isSubmitting = false;
				};
			}}
		>
			<Label for="username" class="mb-2">Username</Label>
			<Input
				id="username"
				name="username"
				type="text"
				class="mb-4 w-full"
				aria-label="Username"
				required
			/>

			<Label for="password" class="mb-2">Password</Label>
			<Input
				id="password"
				name="password"
				type="password"
				class="mb-4 w-full"
				aria-label="Password"
				required
			/>

			<Label for="confirm-password" class="mb-2">Confirm Password</Label>
			<Input
				id="confirm-password"
				name="confirm-password"
				type="password"
				class="mb-4 w-full"
				aria-label="Confirm Password"
				required
			/>

			<Button type="submit" class="w-full" disabled={isSubmitting}>
				{#if isSubmitting}
					<LoaderCircle class="animate-spin" />
					Signing up...
				{:else}
					Sign up
				{/if}
			</Button>

			{#if form?.error}
				<Alert.Root class="mt-4" variant="destructive">
					<CircleAlert />
					<Alert.Description>
						{form.error}
					</Alert.Description>
				</Alert.Root>
			{/if}

			{#if form?.success}
				<Alert.Root class="mt-4 items-center text-green-500">
					<CircleCheckBig />
					<Alert.Description>
						<p>
							Account successfuly created! You can now
							<a href="/login" class="text-theme hover:underline">log in</a>.
						</p>
					</Alert.Description>
				</Alert.Root>
			{/if}
		</form>
		<div class="mt-4 text-center">
			<p class="text-muted-foreground text-sm tracking-tight">
				Already have an account?
				<a href="/login" class="text-theme hover:underline">Sign in</a>
			</p>
		</div>
	</CardContent>
</Card>
