import { PUBLIC_API_URL } from '$env/static/public';
import { fail } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions: Actions = {
	default: async ({ request, fetch }) => {
		const formData = await request.formData();
		const username = formData.get('username') as string;
		const password = formData.get('password') as string;
		const confirmPassword = formData.get('confirm-password') as string;

		// Validate input
		if (
			!username ||
			typeof username !== 'string' ||
			!password ||
			typeof password !== 'string' ||
			!confirmPassword ||
			typeof confirmPassword !== 'string'
		) {
			return fail(400, { error: 'Invalid input.' });
		}

		// Validate password
		if (password.length < 6) {
			return fail(400, { error: 'Password must be at least 6 characters long.' });
		}

		// Check if passwords match
		if (password !== confirmPassword) {
			return fail(400, { error: 'Passwords do not match.' });
		}

		try {
			const response = await fetch(`${PUBLIC_API_URL}/register`, {
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
					case 409:
						return fail(409, {
							error: 'Username already exists.'
						});
					case 429:
						return fail(429, { error: 'Too many requests. Please try again later.' });
					default:
						const errorData = await response.json();
						throw new Error(`Unexpected error: ${errorData.error || 'Unknown error'}`);
				}
			}

			return { success: true };
		} catch (error: any) {
			// Rethrow if the error is a redirect (3xx)
			if (error.status && error.status >= 300 && error.status < 400) throw error;

			console.error('Registration error:', error);

			return fail(500, { error: 'Sign up failed. Please try again later.' });
		}
	}
} satisfies Actions;
