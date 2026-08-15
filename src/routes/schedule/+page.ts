import { fetchWeekSchedule, groupScheduleByDay } from '$lib/radiocult-schedule';
import type { PageLoad } from './$types';

export const load: PageLoad = ({ fetch }) => {
	return {
		scheduleByDay: fetchWeekSchedule(fetch).then(groupScheduleByDay)
	};
};
