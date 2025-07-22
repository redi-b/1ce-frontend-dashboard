<script lang="ts">
	import '../app.css';
	import '@bprogress/core/css';

	import { ModeWatcher } from 'mode-watcher';

	import { Toaster } from '$lib/components/ui/sonner';

	import '@fontsource-variable/inter';
	import '@fontsource-variable/manrope';
	import { TooltipProvider } from '$lib/components/ui/tooltip';
	import { navigating, page } from '$app/state';
	import { BProgress } from '@bprogress/core';
	import { onMount } from 'svelte';

	let { children } = $props();

	$effect(() => {
		if (navigating.from && navigating.to) {
			BProgress.start();
		}
		if (!navigating.from && !navigating.to) {
			BProgress.done();
		}
	});

	onMount(() => {
		BProgress.configure({
			showSpinner: false
		});
	});
</script>

<Toaster position="top-center" />
<ModeWatcher modeStorageKey="1ce-theme" themeStorageKey="1ce-color-scheme" />

<TooltipProvider>
	{@render children()}
</TooltipProvider>
