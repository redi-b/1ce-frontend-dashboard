import { parseISO, formatDistanceToNow, isBefore } from 'date-fns';

export function getType(link: any): 'message' | 'redirect' {
	return link.redirect_url ? 'redirect' : 'message';
}

export function isExpired(dateStr: string): boolean {
	if (dateStr === '0001-01-01T00:00:00Z') return false;
	const date = new Date(dateStr);
	return date < new Date();
}

export function formatExpiration(dateStr: string): string {
	if (dateStr === '0001-01-01T00:00:00Z') return 'Never expires';

	const date = parseISO(dateStr);
	const now = new Date();

	const isPast = isBefore(date, now);

	const distance = formatDistanceToNow(date, { addSuffix: true });
	return `Expire${isPast ? 'd' : 's'} ${distance}`;
}

export function getUsagePercentage(used: number, allowed: number): number {
	return Math.round((used / allowed) * 100);
}

export function getUsageColor(percentage: number): string {
	if (percentage >= 90) return 'bg-red-500';
	if (percentage >= 70) return 'bg-yellow-500';
	return 'bg-theme';
}
