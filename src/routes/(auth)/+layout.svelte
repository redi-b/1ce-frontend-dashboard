<script lang="ts">
	let { children } = $props();
</script>

<div class="flex min-h-screen flex-col items-center justify-center">
	<div
		class="font-logo absolute top-4 left-4 flex items-center gap-2 text-xl font-bold tracking-wider"
	>
		<img src="favicon.svg" alt="logo" class="h-8 w-8" />
		<span>1ce</span>
	</div>
	{@render children()}
</div>
