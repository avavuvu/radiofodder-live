import type { Artist } from "./types";

export const fetchArtists = async (): Promise<Artist[]> => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/artists`)
    
    if (!response.ok) throw new Error('Failed to fetch');
    const data = await response.json()

    return data["artists"]
}