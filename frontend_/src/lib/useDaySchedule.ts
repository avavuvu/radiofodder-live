import { useQuery } from "@tanstack/vue-query";
import type { ScheduleEvent } from "./scheduleTypes";

export const fetchDaySchedule = async (): Promise<ScheduleEvent[]> => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/schedule/latertoday`)
    
    if (!response.ok) throw new Error('Failed to fetch');
    const data = response.json()

    return data
}

export const useDaySchedule = () => {
    return useQuery({ 
        queryKey: ['schedules'],
        queryFn: fetchDaySchedule,
        refetchOnWindowFocus: false
    })
}
