import { PUBLIC_API_URL } from '$env/static/public';
import { fail } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions = {
	default: async ({ request, fetch, locals }) => {
		const formData = await request.formData();

		const linkType = formData.get('type') as string;
		const slug = formData.get('slug') as string;
		const message = formData.get('message') as string | null;
		const redirectUrl = formData.get('redirect_url') as string | null;
		const password = formData.get('password') as string | null;
		const viewsAllowed = parseInt(formData.get('views_allowed') as string, 10);
		const expiresAt = (formData.get('expires_at') as string) || '0001-01-01T00:00:00Z';

		if (!linkType || !slug || isNaN(viewsAllowed)) {
			return fail(400, { error: 'Missing required fields.' });
		}

		if (linkType === 'redirect' && !redirectUrl) {
			return fail(400, { error: 'Redirect URL is required for redirect links.' });
		}

		if (linkType === 'message' && !message) {
			return fail(400, { error: 'Message is required for message links.' });
		}

		const payload = {
			slug,
			password,
			views_allowed: viewsAllowed,
			expires_at: expiresAt,
			...(linkType === 'message' ? { message } : { redirect_url: redirectUrl })
		};

		try {
			const res = await fetch(`${PUBLIC_API_URL}/links`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${locals.user?.token}`
				},
				body: JSON.stringify(payload)
			});

			const data = await res.json();

			if (!res.ok) {
				switch (res.status) {
					case 409:
						return fail(409, { error: 'Slug already exists! Please try another one.' });
					default:
						console.error('Error creating link:', data.message);
						return fail(res.status, { error: 'Unknown error occurred.' });
				}
			}

			return { success: true, link: data };
		} catch (err) {
			return fail(500, { error: 'Failed to connect to backend.' });
		}
	}
} satisfies Actions;
