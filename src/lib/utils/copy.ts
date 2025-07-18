import { toast } from 'svelte-sonner';

export async function copyToClipboard(
	content: string,
	successMessage: string,
	errorMessage: string
) {
	try {
		await navigator.clipboard.writeText(content);
		toast.success(successMessage);
	} catch (err) {
		console.error('Failed to copy link:', err);
		toast.error(errorMessage);
	}
}
