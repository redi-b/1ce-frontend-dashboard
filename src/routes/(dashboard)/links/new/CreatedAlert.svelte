<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Card, CardHeader, CardContent, CardTitle } from '$lib/components/ui/card';

	import CircleCheck from '@lucide/svelte/icons/circle-check-big';
	import Clipboard from '@lucide/svelte/icons/clipboard';
	import X from '@lucide/svelte/icons/twitter';
	import Telegram from '@lucide/svelte/icons/send';
	import Whatsapp from '@lucide/svelte/icons/message-circle';
	import { PUBLIC_LINKS_URL } from '$env/static/public';
	import { toast } from 'svelte-sonner';

	interface Props {
		slug: string;
		clear: () => void;
	}

	let { slug, clear }: Props = $props();
</script>

<Card class="w-full max-w-xl rounded-lg py-4 shadow-lg transition-all duration-300">
	<CardHeader class="flex flex-col items-center">
		<CircleCheck class="h-8! w-8! text-green-500!" />
		<CardTitle class="w-full text-center text-xl font-semibold dark:text-white">
			Link Created Successfully!
		</CardTitle>
	</CardHeader>
	<CardContent class="mt-4 flex w-full flex-col items-center gap-4 px-6!">
		<div
			class="flex w-full items-center gap-2 rounded-md border border-gray-700 bg-gray-800 p-2 shadow-sm transition-all hover:shadow-md"
		>
			<p class="flex-1 truncate text-sm text-gray-200">
				{`${PUBLIC_LINKS_URL}/${slug}`}
			</p>
			<Button
				variant="ghost"
				size="sm"
				onclick={() => {
					try {
						navigator.clipboard.writeText(`${PUBLIC_LINKS_URL}/${slug}`);
						toast.success('Copied to clipboard!');
					} catch (error) {
						toast.error('Failed to copy!');
					}
				}}
				class="flex items-center gap-1 bg-gray-700 text-gray-200 hover:bg-gray-600"
			>
				<Clipboard size={16} />
				Copy
			</Button>
		</div>
		<div class="flex gap-2">
			<Button
				variant="outline"
				size="sm"
				onclick={() =>
					window.open(
						`https://twitter.com/intent/tweet?url=${encodeURIComponent(
							`${PUBLIC_LINKS_URL}/${slug}`
						)}`,
						'_blank'
					)}
			>
				<X size={16} class="mr-1" />
				Share on X
			</Button>
			<Button
				variant="outline"
				size="sm"
				onclick={() =>
					window.open(
						`https://t.me/share/url?url=${encodeURIComponent(`${PUBLIC_LINKS_URL}/${slug}`)}`,
						'_blank'
					)}
			>
				<Telegram size={16} class="mr-1" />
				Share on Telegram
			</Button>
			<Button
				variant="outline"
				size="sm"
				onclick={() =>
					window.open(
						`https://api.whatsapp.com/send?text=${encodeURIComponent(
							`${PUBLIC_LINKS_URL}/${slug}`
						)}`,
						'_blank'
					)}
			>
				<Whatsapp size={16} class="mr-1" />
				Share on WhatsApp
			</Button>
		</div>
		<div class="mt-2">
			<img
				src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(
					`${PUBLIC_LINKS_URL}/${slug}`
				)}`}
				alt="QR Code for link"
				class="border border-gray-200"
			/>
			<p class="mt-1 text-center text-xs text-gray-500">Scan to share</p>
		</div>
		<Button variant="outline" size="sm" onclick={clear} class="mt-2 w-fit">
			Create Another Link
		</Button>
	</CardContent>
</Card>
