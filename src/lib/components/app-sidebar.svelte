<script lang="ts">
	import type { ComponentProps } from 'svelte';

	import * as Sidebar from '$lib/components/ui/sidebar';
	import { Separator } from '$lib/components/ui/separator';

	import { cn } from '$lib/utils';

	import Plus from '@lucide/svelte/icons/plus';
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

	<Sidebar.Content class={cn({ 'px-1': !collapsed })}>
		<Sidebar.Group class="mt-2">
			<Sidebar.Menu class="gap-4">
				<Sidebar.MenuItem>
					<Sidebar.MenuButton
						tooltipContent="Create"
						class="bg-theme hover:bg-theme-hover active:bg-theme mx-auto h-10 w-fit cursor-pointer items-center rounded-full px-4!"
					>
						{#snippet child({ props })}
							<a href="/links/new" {...props}>
								<Plus class={cn({ 'h-5! w-5!': !collapsed })} />
								<span class="font-medium">Create</span>
							</a>
						{/snippet}
					</Sidebar.MenuButton>
				</Sidebar.MenuItem>
			</Sidebar.Menu>
		</Sidebar.Group>
		<Separator />
		<Sidebar.Group class="mt-2">
			<Sidebar.Menu class="gap-4">
				{#each sidebarLinks as link}
					<Sidebar.MenuItem>
						<Sidebar.MenuButton
							tooltipContent={link.name}
							onclick={() => {
								if (sidebar.isMobile) {
									sidebar.toggle();
								}
							}}
						>
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
