<script lang="ts">
	import { page } from '$app/state';

	import { Separator } from '$lib/components/ui/separator';
	import { SidebarProvider, SidebarInset, SidebarTrigger } from '$lib/components/ui/sidebar';

	import AppSidebar from '$lib/components/app-sidebar.svelte';

	let { children, data } = $props();

	let currentTab = $derived.by(() => {
		const path = page.url.pathname;
		if (path.startsWith('/dashboard')) return 'Dashboard';
		if (path.startsWith('/links/new')) return 'Create New Link';
		if (path.startsWith('/links')) return 'Your Links';
		if (path.startsWith('/analytics')) return 'Analytics';
		return 'Home';
	});
</script>

<SidebarProvider>
	<AppSidebar username={data.user.username} />
	<SidebarInset>
		<header
			class="bg-background fixed z-10 flex h-16 w-full shrink-0 items-center gap-2 shadow-md transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 dark:shadow-black/35"
		>
			<div class="flex items-center gap-2 px-4">
				<SidebarTrigger class="-ml-1" />
				<Separator orientation="vertical" class="mr-2 data-[orientation=vertical]:h-4" />
				{currentTab}
			</div>
		</header>
		<div class="mt-16 min-h-[calc(100vh_-4rem)]">
			{@render children()}
		</div>
	</SidebarInset>
</SidebarProvider>
