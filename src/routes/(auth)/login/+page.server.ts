import { PUBLIC_API_URL } from '$env/static/public';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { ENV } from '$env/static/private';

export const actions: Actions = {
	default: async ({ request, cookies, fetch }) => {
		const formData = await request.formData();
		const username = formData.get('username') as string;
		const password = formData.get('password') as string;

		// Validate input
		if (!username || typeof username !== 'string' || !password || typeof password !== 'string') {
			return fail(400, { error: 'Invalid input.' });
		}

		try {
			const response = await fetch(`${PUBLIC_API_URL}/login`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ username, password })
			});

			if (!response.ok) {
				switch (response.status) {
					case 400:
						return fail(400, { error: 'Invalid input. Please check your data.' });
					case 401:
						return fail(401, { error: 'Invalid username or password.' });
					case 429:
						return fail(429, { error: 'Too many requests. Please try again later.' });
					default:
						const errorData = await response.json();
						throw new Error(`Unexpected error: ${errorData.error || 'Unknown error'}`);
				}
			}

			const user = await response.json();

			if (!user || !user.token) {
				throw new Error('User data is missing or token is not provided.');
			}

			// Set the user token in cookies
			cookies.set('token', user.token, {
				path: '/',
				httpOnly: true,
				secure: ENV === 'production', // Use secure cookies in production
				sameSite: 'strict',
				maxAge: 60 * 60 * 24 * 7 // 1 week
			});

			redirect(303, '/');
		} catch (error: any) {
			// Rethrow if the error is a redirect (3xx)
			if (error.status && error.status >= 300 && error.status < 400) throw error;

			console.error('Login error:', error);

			return fail(500, { error: 'Login failed. Please try again later.' });
		}
	}
} satisfies Actions;
