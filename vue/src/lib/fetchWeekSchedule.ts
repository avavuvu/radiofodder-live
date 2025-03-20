import { useQuery } from "@tanstack/vue-query";
import type { RadioCultLiveData } from "./types";
import type { ScheduleEvent } from "./scheduleTypes";

export const fetchWeekSchedule = async (): Promise<ScheduleEvent[]> => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/schedule/week`)
    
    if (!response.ok) throw new Error('Failed to fetch');
    return response.json();
}
