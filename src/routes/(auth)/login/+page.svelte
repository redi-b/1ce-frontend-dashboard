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
	import LoaderCircle from '@lucide/svelte/icons/loader-circle';

	let { form } = $props();

	let isSubmitting = $state(false);
</script>

<svelte:head>
	<title>Sign In - 1ce</title>
	<meta name="description" content="Sign in to your 1ce account" />
</svelte:head>

<Card class="w-full max-w-sm">
	<CardHeader class="text-center">
		<CardTitle class="text-xl">Welcome back!</CardTitle>
		<CardDescription>Enter your credentials to access your account</CardDescription>
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
				class="mb-4 w-full text-sm"
				aria-label="Username"
				required
			/>

			<Label for="password" class="mb-2">Password</Label>
			<Input
				id="password"
				name="password"
				type="password"
				class="mb-4 w-full text-sm"
				aria-label="Password"
				required
			/>

			<Button type="submit" class="w-full" disabled={isSubmitting}>
				{#if isSubmitting}
					<LoaderCircle class="animate-spin" />
					Signing in...
				{:else}
					Sign in
				{/if}
			</Button>

			{#if form?.error}
				<Alert.Root class="mt-4 border-red-400" variant="destructive">
					<CircleAlert />
					<Alert.Description>
						{form.error}
					</Alert.Description>
				</Alert.Root>
			{/if}
		</form>
		<div class="mt-4 text-center">
			<p class="text-muted-foreground text-sm tracking-tight">
				Don't have an account yet?
				<a href="/signup" class="text-theme hover:underline">Sign up</a>
			</p>
		</div>
	</CardContent>
</Card>
