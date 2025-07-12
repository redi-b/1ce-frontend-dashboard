<script lang="ts">
	import { cn } from '$lib/utils';

	let { className = '' } = $props();
</script>

<div class={cn('font-logo flex items-center gap-2 text-xl font-bold tracking-wider', className)}>
	<img src="/favicon.svg" alt="logo" class="h-8 w-8" />
	<span>1ce</span>
</div>
