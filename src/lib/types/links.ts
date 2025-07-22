export type Link = {
	id: string;
	slug: string;
	created_at: string;
	expires_at: string;
	destroyed: boolean;
	views_allowed: number;
	views_used: number;
	redirect_url?: string;
	message?: string;
};
