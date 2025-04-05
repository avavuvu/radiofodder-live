import { fetchArtist } from "./fetchArtists";
import { getHtmlFromTipTapJson } from "./getJsonContent";
import type { RadioCultLiveData } from "./types";

export type FormattedMetadata = {
    title: string,
    description: {
        type: "text",
        data: string
    } | {
        type: "html"
        data: string
    }
    imageSource?: string,
    instagramLink?: string
}

export const formatMetadata = async (data: RadioCultLiveData) => {
    // default playlist is playing
    const formatted: FormattedMetadata = {
        title: `${data.metadata.title}`,
        description: {
            type: "text",
            data: `by ${data.metadata.artist}`
        },
        imageSource: data.metadata.artwork?.default || undefined
    }

    if(data.status === "schedule" && data.content.media.type === "live") {
        const artistId = data.content.artistIds?.at(0)
        if(artistId) {
            const artist = await fetchArtist( artistId )

            formatted.title = artist.name ?? "Live"

            if(artist.description) {
                formatted.description = {
                    type: "html",
                    data: getHtmlFromTipTapJson(artist.description)
                }
            } else {
                formatted.description = { type: "text", data: ""}
            }

            formatted.imageSource = artist.logo?.default
            if(artist.socials?.instagramHandle) {
                formatted.instagramLink = `https://instagram.com/${artist.socials?.instagramHandle}`
            }
        }
        
    } else if(data.status === "offAir") {
        formatted.title = "Radio Fodder is Off Air"
        formatted.description = {
            type: "html",
            data: "If you believe this to be a mistake, please contact the webmaster"
        }
    }

    return formatted
}