import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { PUBLIC_API_URL } from '$env/static/public';

export const POST: RequestHandler = async ({ request, fetch, locals }) => {
	try {
		const data = await request.json();
		if (!data.id) {
			return json({ error: 'Link ID is required' }, { status: 400 });
		}

		const response = await fetch(`${PUBLIC_API_URL}/links/destroy/${data.id}`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${locals.user?.token}`
			}
		});

		if (!response.ok) {
			const errorData = await response.json();
			return json(
				{ error: errorData.message || 'Failed to destroy link' },
				{ status: response.status }
			);
		}
		return json({ success: true });
	} catch (err) {
		return json({ error: 'An unexpected error occurred' }, { status: 500 });
	}
};

export const DELETE: RequestHandler = async ({ request, fetch, locals }) => {
	try {
		const data = await request.json();
		if (!data.id) {
			return json({ error: 'Link ID is required' }, { status: 400 });
		}

		const response = await fetch(`${PUBLIC_API_URL}/links/delete/${data.id}`, {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${locals.user?.token}`
			}
		});

		if (!response.ok) {
			const errorData = await response.json();
			return json(
				{ error: errorData.message || 'Failed to delete link' },
				{ status: response.status }
			);
		}
		return json({ success: true });
	} catch (err) {
		return json({ error: 'An unexpected error occurred' }, { status: 500 });
	}
};
