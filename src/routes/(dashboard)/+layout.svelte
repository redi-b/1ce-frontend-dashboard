<script lang="ts">
	import { page } from '$app/state';

	import { Separator } from '$lib/components/ui/separator';
	import { SidebarProvider, SidebarInset, SidebarTrigger } from '$lib/components/ui/sidebar';

	import AppSidebar from '$lib/components/app-sidebar.svelte';

	let { children } = $props();

	let currentTab = $derived.by(() => {
		const path = page.url.pathname;
		if (path.startsWith('/dashboard')) return 'Dashboard';
		if (path.startsWith('/links')) return 'Links';
		if (path.startsWith('/analytics')) return 'Analytics';
		return 'Home';
	});
</script>

<SidebarProvider>
	<AppSidebar />
	<SidebarInset>
		<header
			class="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12"
		>
			<div class="flex items-center gap-2 px-4">
				<SidebarTrigger class="-ml-1" />
				<Separator orientation="vertical" class="mr-2 data-[orientation=vertical]:h-4" />
				{currentTab}
			</div>
		</header>
		<div class="flex min-h-[calc(100vh_-4rem)] flex-col items-center justify-center">
			{@render children()}
		</div>
	</SidebarInset>
</SidebarProvider>
