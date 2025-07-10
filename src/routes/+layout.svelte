<script lang="ts">
	import '../app.css';

	import { ModeWatcher } from 'mode-watcher';

	import '@fontsource-variable/inter';
	import '@fontsource-variable/manrope';

	let { children } = $props();
</script>

<ModeWatcher modeStorageKey="1ce-theme" themeStorageKey="1ce-color-scheme" />

{@render children()}
