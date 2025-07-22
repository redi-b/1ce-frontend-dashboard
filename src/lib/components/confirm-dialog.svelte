<script lang="ts">
	import * as AlertDialog from '$lib/components/ui/alert-dialog/index.js';
	import type { Snippet } from 'svelte';

	interface Props {
		trigger: Snippet<
			[
				{
					props: Record<string, unknown>;
				}
			]
		>;
		title?: string;
		description: string;
		action?: () => void;
		actionText?: string;
		cancelText?: string;
		disabled?: boolean;
	}

	let {
		trigger,
		description,
		title = 'Are you absolutely sure?',
		action = () => {},
		actionText = 'Confirm',
		cancelText = 'Cancel',
		disabled = false
	}: Props = $props();

	let open = $state(false);
</script>

{@render trigger({ props: { onclick: () => (open = true), disabled } })}

<AlertDialog.Root {open} onOpenChange={(value) => (open = value)}>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>{title}</AlertDialog.Title>
			<AlertDialog.Description>
				{description}
			</AlertDialog.Description>
		</AlertDialog.Header>
		<AlertDialog.Footer>
			<AlertDialog.Cancel>{cancelText}</AlertDialog.Cancel>
			<AlertDialog.Action
				onclick={() => {
					action();
					open = false;
				}}
			>
				{actionText}
			</AlertDialog.Action>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
