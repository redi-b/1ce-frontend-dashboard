<script lang="ts">
	import '../app.css';

	import { ModeWatcher } from 'mode-watcher';

	import { Toaster } from '$lib/components/ui/sonner';

	import '@fontsource-variable/inter';
	import '@fontsource-variable/manrope';

	let { children } = $props();
</script>

<Toaster position="top-center" />
<ModeWatcher modeStorageKey="1ce-theme" themeStorageKey="1ce-color-scheme" />

{@render children()}
