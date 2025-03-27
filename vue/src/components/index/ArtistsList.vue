<script setup lang="ts">
    import { fetchArtists, fetchArtist } from '@/lib/fetchArtists';
    import PlaceholderArtwork from '../placeholder/PlaceholderArtwork.vue';
    import { getJsonContent } from '@/lib/getJsonContent';
    import { fetchDaySchedule } from '@/lib/useDaySchedule';
    import type { Artist } from '@/lib/types';

    const fetchArtistsAndSchedule = async () => {
        const daySchedule = await fetchDaySchedule()

        let artists: Artist[] = []

        for (const scheduleEvent of daySchedule) {
            const artistId = scheduleEvent.artistIds?.[0]

            if (!artistId) {
                //TODO: return a default "show" object
                console.log("No artsit attachted to event:", scheduleEvent)
                continue
            }

            console.log(await fetchArtist(artistId))

            artists.push(await fetchArtist(artistId))
        }

        return artists
    }

    const artists = await fetchArtistsAndSchedule()



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
    <ul class="ml-8">
        <li v-for="artist in artists" >
            <div class="flex h-24 gap-2 m-4">
                <div class="h-full aspect-square border-2 border-surface-900">
                    <img v-if="artist.logo?.default" class="h-full object-cover" :src="artist.logo?.default">
                    <div v-else class="h-full ">
                        <PlaceholderArtwork/>
                    </div>
                </div>

                <div>
                    <span v-if="artist.name" class="font-bold">{{ artist.name }}</span>
                    <span v-else class="italic font-bold">no artist name</span>
    
    
                    <p v-if="artist.description">{{ getJsonContent(artist.description) }}</p>

                    <p v-if="artist.socials">{ 
                        <span v-for="[key, handle] in Object.entries(artist.socials!)">
                            <a :href="`${socialsMap[key as keyof SocialsInterface]!.site}${handle}`">
                                <i :class="`pi ${socialsMap[key as keyof SocialsInterface]!.icon}`"></i>
                                <span class="ml-2">{{ handle }}</span>
                            </a>
                        </span>
                    }</p>

                </div>

                
            </div>
        </li>
    </ul>
</template>