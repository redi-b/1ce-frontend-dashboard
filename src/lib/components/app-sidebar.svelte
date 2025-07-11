<script lang="ts">
	import type { ComponentProps } from 'svelte';

	import * as Sidebar from '$lib/components/ui/sidebar';
	import { Separator } from '$lib/components/ui/separator';

	import { cn } from '$lib/utils';

	import LayoutDashboard from '@lucide/svelte/icons/layout-dashboard';
	import Link from '@lucide/svelte/icons/link';
	import ChartColumn from '@lucide/svelte/icons/chart-column';

	import NavUser from './nav-user.svelte';
	import Logo from './logo.svelte';

	let {
		ref = $bindable(null),
		collapsible = 'icon',
		...restProps
	}: ComponentProps<typeof Sidebar.Root> = $props();

	const sidebar = Sidebar.useSidebar();
	const collapsed = $derived(sidebar.state == 'collapsed');

	const sidebarLinks = [
		{
			name: 'Dashboard',
			href: '/dashboard',
			icon: LayoutDashboard
		},
		{
			name: 'Links',
			href: '/links',
			icon: Link
		},
		{
			name: 'Analytics',
			href: '/analytics',
			icon: ChartColumn
		}
	];
</script>

<Sidebar.Root {collapsible} {...restProps}>
	<Sidebar.Header class={cn('overflow-hidden', { 'py-4': !collapsed })}>
		<Logo className={cn('overflow-hidden mx-auto transition-all')} />
	</Sidebar.Header>

	<Separator />

	<Sidebar.Content class={cn('mt-6', { 'px-1': !collapsed })}>
		<Sidebar.Group>
			<Sidebar.Menu class="gap-4">
				{#each sidebarLinks as link}
					<Sidebar.MenuItem>
						<Sidebar.MenuButton tooltipContent={link.name}>
							{#snippet child({ props })}
								<a href={link.href} {...props}>
									<link.icon />
									<span>{link.name}</span>
								</a>
							{/snippet}
						</Sidebar.MenuButton>
					</Sidebar.MenuItem>
				{/each}
			</Sidebar.Menu>
		</Sidebar.Group>
	</Sidebar.Content>

	<Sidebar.Footer>
		<NavUser username={'rediet'} />
	</Sidebar.Footer>

	<Sidebar.Rail />
</Sidebar.Root>
