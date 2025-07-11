import { ENV } from '$env/static/private';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ cookies }) => {
	// Clear the token cookie to log out the user
	cookies.delete('token', {
		path: '/',
		httpOnly: true,
		secure: ENV === 'production',
		sameSite: 'strict'
	});

	// Redirect to home page after logout
	return json({ success: true });
};
