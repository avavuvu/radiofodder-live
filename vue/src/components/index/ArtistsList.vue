<script setup lang="ts">
    import { fetchArtists, fetchArtist } from '@/lib/fetchArtists';
    import PlaceholderArtwork from '../placeholder/PlaceholderArtwork.vue';
    import { getBasicJsonContent, getHtmlFromTipTapJson, getYamlFromTipTapJson } from '@/lib/getJsonContent';
    import { fetchDaySchedule } from '@/lib/useDaySchedule';
    import type { Artist, CustomShowMetadata } from '@/lib/types';
    import { Accordion, AccordionPanel, AccordionHeader, AccordionContent } from 'primevue';

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
</script>

<template>
    <Accordion class="transition-all" >
        <AccordionPanel 
            v-for="{artist, metadata}, index in artists" 
            :value="index" class="mb-12 max-w-[100ch] px-2" >

            <AccordionHeader class="flex h-32 gap-2 m-4 !text-color hover:!text-color">
                <component
                    :is="artist.socials?.instagramHandle ? 'a' : 'span'"
                    :href="artist.socials?.instagramHandle ? `https://instagram.com/${artist.socials.instagramHandle}`: ''"
                    target="_blank" rel="noopener noreferrer"
                    class="h-32 aspect-square border-2 border-surface-900 block">
                    <img v-if="artist.logo?.default" class="h-full object-cover" :src="artist.logo?.default">
                    <div v-else class="h-32">
                        <PlaceholderArtwork/>
                    </div>
                </component>

                <div class="w-full px-4">
                    <span 
                        v-if="artist.name" >
                        <span>
                            <span class="font-bold">
                                {{ artist.name }} 
                            </span>
                            <span v-if="metadata && metadata.hosts"> 
                                – with {{ metadata.hosts }}
                            </span> 
                        </span>
                    </span> 
                    <span v-else class="italic font-bold">no artist name</span>
    
                    

                </div>                
            </AccordionHeader>
            <AccordionContent >
                <div class="px-8 py-2">
                    <div class="" 
                        v-if="artist.description" 
                        v-html="getHtmlFromTipTapJson(artist.description)">
                    </div>
                    <div class="" 
                        v-else-if="artist.description === undefined" >
                        <p class="italic">No description</p>
                    </div>  
    
                    <div class="mt-4 flex flex-col">
                        <span class="" v-if="metadata && metadata.showtime">
                            <i class="pi pi-clock pr-2" style="font-size: .85rem"></i>{{ metadata.showtime }}
                        </span>
                        <a v-if="artist.socials?.instagramHandle" 
                            :href="`https://instagram.com/${artist.socials.instagramHandle}`"
                            target="_blank" rel="noopener noreferrer">
    
                            <i class="pi pi-instagram pr-2" style="font-size: .85rem"></i>
                            <span class="underline text-primary">{{ artist.socials.instagramHandle }}</span>
                        </a>
    
                    </div>

                </div>
            </AccordionContent>
        </AccordionPanel>
    </Accordion>
</template>

<style lang="css">
</style>