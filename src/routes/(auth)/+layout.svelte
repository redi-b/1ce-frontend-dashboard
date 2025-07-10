<script lang="ts">
	import Logo from '$lib/components/logo.svelte';

	let { children } = $props();
</script>

<div class="flex min-h-screen flex-col items-center justify-center">
	<Logo className="absolute top-4 left-4" />
	{@render children()}
</div>
