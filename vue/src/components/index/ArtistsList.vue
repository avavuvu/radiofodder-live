<script setup lang="ts">
    import { fetchArtists, fetchArtist } from '@/lib/fetchArtists';
    import PlaceholderArtwork from '../placeholder/PlaceholderArtwork.vue';
    import { getBasicJsonContent, getHtmlFromTipTapJson, getYamlFromTipTapJson } from '@/lib/getJsonContent';
    import { fetchDaySchedule } from '@/lib/useDaySchedule';
    import type { Artist, CustomShowMetadata } from '@/lib/types';

    // const fetchArtistsAndSchedule = async () => {
    //     const daySchedule = await fetchDaySchedule()

    //     let artists: Artist[] = []

    //     for (const scheduleEvent of daySchedule) {
    //         const artistId = scheduleEvent.artistIds?.[0]

    //         if (!artistId) {
    //             //TODO: return a default "show" object
    //             console.log("No artsit attachted to event:", scheduleEvent)
    //             continue
    //         }

    //         console.log(await fetchArtist(artistId))

    //         artists.push(await fetchArtist(artistId))
    //     }

    //     return artists
    // }

    const artists: {artist: Artist, metadata: CustomShowMetadata | null}[] = (await fetchArtists()).map(artist => {
        let metadata: null | CustomShowMetadata = null
        
        if(artist.description) {
            metadata = getYamlFromTipTapJson(artist.description)
        }

        return {
            artist,
            metadata: metadata
        }
    })

    interface SocialsInterface  {
        twitterHandle?: string;
        instagramHandle?: string;
        facebook?: string;
        mixcloud?: string;
        soundcloud?: string;
        site?: string;
    }

    const socialsMap: {[K in keyof SocialsInterface]: { icon: string, site: string}} = {
        "twitterHandle": {
            icon: "pi-twitter",
            site: "https://twitter.com/"
        },
        "instagramHandle": {
            icon: "pi-instagram",
            site: "https://instagram.com/"
        },
        "facebook": {
            icon: "pi-facebook",
            site: ""
        },
        "mixcloud": {
            icon: "pi-headphones",
            site: ""
        },
        "soundcloud": {
            icon: "pi-cloud",
            site: ""
        },
        "site": {
            icon: "pi-link",
            site: ""
        }
    } as const
</script>

<template>
    <ul class="">
        <li v-for="{artist, metadata} in artists" >
            <div class="flex h-32 gap-2 m-4 max-w-[100ch]">
                <component
                    :is="artist.socials?.instagramHandle ? 'a' : 'span'"
                    :href="artist.socials?.instagramHandle ? `https://instagram.com/${artist.socials.instagramHandle}`: ''"
                    target="_blank" rel="noopener noreferrer"
                    class="h-full aspect-square border-2 border-surface-900 block">
                    <img v-if="artist.logo?.default" class="h-full object-cover" :src="artist.logo?.default">
                    <div v-else class="h-full">
                        <PlaceholderArtwork/>
                    </div>
                </component>

                <div class="w-full">
                    <component 
                        :is="artist.socials?.instagramHandle ? 'a' : 'span'"
                        :href="artist.socials?.instagramHandle ? `https://instagram.com/${artist.socials.instagramHandle}`: ''"
                        target="_blank" rel="noopener noreferrer"
                        class="inline-flex justify-between w-full"
                        v-if="artist.name" >
                        <span>
                            <span class="font-bold">
                                {{ artist.name }} 
                            </span>
                            <span v-if="metadata && metadata.hosts"> 
                                – with {{ metadata.hosts }}
                            </span> 
                        </span>
                        <span v-if="artist.socials?.instagramHandle">
                            <i class="pi pi-external-link" style="font-size: .75rem"></i>
                        </span>
                    </component> 
                    <span v-else class="italic font-bold">no artist name</span>
    
                    <div class="line-clamp-2 ml-2" 
                        v-if="artist.description" 
                        v-html="getHtmlFromTipTapJson(artist.description)"></div>

                    <span v-if="metadata && metadata.showtime">
                        {{ metadata.showtime }}
                    </span>

                </div>

                
            </div>
        </li>
    </ul>
</template>