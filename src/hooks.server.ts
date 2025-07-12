import { verifyJwtToken } from '$lib/utils/jwt';
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	const token = event.cookies.get('token');
	event.locals.user = null;

	// Check if cookies have a token
	if (token) {
		const user = await verifyJwtToken(token);

		if (!user) {
			// If the token is invalid, clear the cookie
			event.cookies.delete('token', { path: '/' });
			return resolve(event);
		}

		event.locals.user = {
			id: user.userId,
			username: user.username,
			token
		};
	}

	return resolve(event);
};
