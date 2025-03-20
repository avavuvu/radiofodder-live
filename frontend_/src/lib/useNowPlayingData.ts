import { useQuery } from "@tanstack/vue-query";
import type { RadioCultLiveData } from "./types";

export const fetchRadioData = async (): Promise<RadioCultLiveData> => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/schedule/live`)
    
    if (!response.ok) throw new Error('Failed to fetch');
    return response.json();
}

export const useNowPlayingData = () => {
    return useQuery({ 
        queryKey: ['result'],
        queryFn: fetchRadioData,
        refetchOnWindowFocus: true,
    })
}

//   staleTime: async (query) => {
//     const { metadata } = await query.fetch()
//     const songDurationRemainingMs = (metadata.playoutStartUnixTimestamp * 1000) - (Date.now()) + (metadata.duration * 1000)
//     return Math.max(20 * 1000, songDurationRemainingMs)
// }