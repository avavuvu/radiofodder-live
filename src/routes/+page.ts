import { fetchArtists } from '$lib/radiocult-schedule';
import type { PageLoad } from './$types';

export const load: PageLoad = ({ fetch }) => {
	return {
		artists: fetchArtists(fetch)
	};
};
