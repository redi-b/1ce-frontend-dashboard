import { PUBLIC_API_URL } from '$env/static/public';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, parent, fetch, depends }) => {
	depends('data:links');
	await parent();

	await new Promise((resolve) => setTimeout(resolve, 1000));
	try {
		const res = await fetch(`${PUBLIC_API_URL}/links`, {
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${locals.user?.token}`
			}
		});

		const data = await res.json();

		if (!res.ok) {
			switch (res.status) {
				case 401:
					return { success: false, error: 'Unauthorized access. Please log in again.' };
				case 403:
					return {
						success: false,
						error: 'Forbidden access. You do not have permission to view this resource.'
					};
				case 404:
					return { success: false, error: 'Resource not found.' };
				case 429:
					return { success: false, error: 'Too many requests. Please try again later.' };
				case 500:
					return { success: false, error: 'Internal server error. Please try again later.' };

				default:
					return {
						success: false,
						error: 'An unexpected error occurred. Please try again later.'
					};
			}
		}

		return { success: true, links: data };
	} catch (err: any) {
		return { success: false, error: 'Unknown error occurred!' };
	}
};
