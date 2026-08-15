import type { TipTapNode } from './radiocult-content';

export type ScheduleEvent = {
	id: string;
	title: string;
	start: string;
	end: string;
	timezone: string;
	color?: string;
	artistIds?: string[];
	media: { type: 'mix' | 'playlist' | 'live' };
};

export type Artist = {
	id: string;
	name?: string;
	socials?: { instagramHandle?: string };
	description?: TipTapNode;
	logo?: { default?: string };
};

const fetchScheduleViaProxy = async (
	fetchFn: typeof fetch,
	startDate: Date,
	endDate: Date,
	maxAgeSeconds: number
): Promise<ScheduleEvent[]> => {
	const url = `/api/schedule?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}&maxAge=${maxAgeSeconds}`;
	const response = await fetchFn(url);

	if (!response.ok) throw new Error('Failed to fetch schedule');

	const data = await response.json();
	return data.schedules ?? [];
};

export const fetchTodaySchedule = async (fetchFn: typeof fetch = fetch): Promise<ScheduleEvent[]> => {
	const startOfDay = new Date();
	startOfDay.setHours(0, 0, 0, 0);

	const endOfDay = new Date(startOfDay);
	endOfDay.setHours(23, 59, 59, 999);

	return fetchScheduleViaProxy(fetchFn, startOfDay, endOfDay, 43200);
};

export const fetchWeekSchedule = async (fetchFn: typeof fetch = fetch): Promise<ScheduleEvent[]> => {
	const startOfWeek = new Date();
	startOfWeek.setHours(0, 0, 0, 0);

	const endOfWeek = new Date(startOfWeek);
	endOfWeek.setDate(endOfWeek.getDate() + 6);
	endOfWeek.setHours(23, 59, 59, 999);

	return fetchScheduleViaProxy(fetchFn, startOfWeek, endOfWeek, 604800);
};

export const fetchArtists = async (fetchFn: typeof fetch = fetch): Promise<Artist[]> => {
	const response = await fetchFn('/api/artists?maxAge=604800');

	if (!response.ok) throw new Error('Failed to fetch artists');

	const data = await response.json();
	return data.artists ?? [];
};

export const groupScheduleByDay = (events: ScheduleEvent[]): Map<string, ScheduleEvent[]> => {
	const days = new Map<string, ScheduleEvent[]>();

	for (const event of events) {
		const day = new Date(event.start).toLocaleDateString('en-AU', {
			weekday: 'long',
			timeZone: event.timezone
		});

		if (!days.has(day)) days.set(day, []);
		days.get(day)!.push(event);
	}

	return days;
};

export const formatEventTime = (isoDate: string, timezone: string) =>
	new Date(isoDate).toLocaleTimeString('en-AU', {
		hour: 'numeric',
		minute: '2-digit',
		timeZone: timezone
	});
