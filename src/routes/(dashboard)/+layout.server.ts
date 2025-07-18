import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
	if (!locals.user) {
		throw redirect(303, '/login'); // Redirect to the login if not authenticated
	}

	return {
		user: {
			id: locals.user.id,
			username: locals.user.username
		}
	};
};
