import { json } from '@sveltejs/kit';
import { PUBLIC_RADIOCULT_API_KEY, PUBLIC_API_URL } from '$env/static/public';
import type { RequestHandler } from './$types';

const DEFAULT_MAX_AGE = 300;
const UPPER_MAX_AGE = 604800;

export const GET: RequestHandler = async ({ url }) => {
	const startDate = url.searchParams.get('startDate');
	const endDate = url.searchParams.get('endDate');

	if (!startDate || !endDate) {
		return json({ error: 'Missing startDate or endDate' }, { status: 400 });
	}

	const requestedMaxAge = Number(url.searchParams.get('maxAge'));
	const maxAge = Number.isFinite(requestedMaxAge)
		? Math.min(Math.max(requestedMaxAge, 0), UPPER_MAX_AGE)
		: DEFAULT_MAX_AGE;

	try {
		const response = await fetch(
			`${PUBLIC_API_URL}/schedule?startDate=${startDate}&endDate=${endDate}`,
			{ headers: { 'x-api-key': PUBLIC_RADIOCULT_API_KEY } }
		);

		if (!response.ok) {
			return json({ error: 'Failed to fetch schedule' }, { status: 502 });
		}

		const data = await response.json();

		return json(data, {
			headers: {
				'cache-control': `public, max-age=${maxAge}`
			}
		});
	} catch (error) {
		return json({ error: 'Failed to fetch schedule' }, { status: 500 });
	}
};
