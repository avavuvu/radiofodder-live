<script setup lang="ts">
    import { useNowPlayingData } from '@/lib/useNowPlayingData'
    import { Skeleton } from 'primevue'
    import PlaceholerArtwork from "@/components/placeholder/PlaceholderArtwork.vue"
    import { useDaySchedule } from '@/lib/useDaySchedule';
    import { DateTime } from 'luxon';
    import Artists from '@/components/index/Artists.vue';
    import { formatMetadata, type FormattedMetadata } from '@/lib/formatLiveMetadata';
    import { effect, ref, watch } from 'vue';
        
    const { data, isLoading, isError, isSuccess, error } = useNowPlayingData()

    const { data: dayData, isLoading: isDayLoading, isError: isDayError, isSuccess: isDaySuccess, error: dayError }  = useDaySchedule()

    const convertIsoTimeStringToHuman = (isoTime: string) => {
        return DateTime.fromISO(isoTime).toFormat('h:mma').toLowerCase() 
    }

    const currentArtistData = ref<FormattedMetadata | undefined>(undefined)


    effect(async () => {
        if(!data.value) { return }

        currentArtistData.value = await formatMetadata(data.value)
        document.title = `${currentArtistData.value.title} – Radio Fodder`
    })

</script>

<template >
    <div class="min-h-[500px] flex items-center">
        <div class="flex justify-center gap-2 flex-col md:flex-row lg:flex-row w-full lg:w-auto">
            <div class="w-64 md:w-96 md:h-96 lg:w-96 lg:h-96 aspect-square border-2 border-surface-950 mx-auto lg:mx-0">
                <div v-if="isSuccess && currentArtistData">
                    <img 
                        class="w-full h-full"
                        :src="currentArtistData.imageSource">
                </div>
                <div v-else class="">
                    <PlaceholerArtwork/>
                </div>
            </div>
    
            <div class="max-w-[520px] mx-auto px-8">
                <div class="mb-2 min-h-[5rem]">
                    <h2 class="w-24">Now Playing:</h2>
                    <div class="ml-4" v-if="isLoading">
                        <Skeleton width="14rem" class="my-1"/>
                        <Skeleton width="10rem" class="my-1"/>
                        <Skeleton width="4rem" class="my-1"/>
                    </div>
                    <div v-else-if="isError">
                        <span class="ml-4">ERROR: {{ error?.message }}</span>
                    </div>
                    <div class="ml-4" v-else-if="isSuccess && currentArtistData">
                        <component 
                            :is="currentArtistData?.instagramLink ? 'a' : 'span'"
                            :href="currentArtistData?.instagramLink  ? currentArtistData?.instagramLink : ''"
                            target="_blank" rel="noopener noreferrer"
                            class="inline-flex justify-between w-full">
                            <span>
                                <span class="font-bold">
                                    {{ currentArtistData.title  }} 
                                </span>
                            </span>
                            <span v-if="currentArtistData?.instagramLink">
                                <i class="pi pi-external-link" style="font-size: .75rem"></i>
                            </span>
                        </component> 

                        <span v-if="currentArtistData.description.type === 'html'" v-html="currentArtistData?.description.data"></span>
                        <p v-else> {{ currentArtistData.description.data }}</p>
                    </div>
                </div>

                <hr class="border-t-surface-950">
    
                <div class=" gap-2 mt-4">
                    <h2 class=" w-24">Coming Up:</h2>
                    <div class="ml-4" v-if="isDayLoading">
                        <Skeleton width="14rem" class="my-1"/>
                        <Skeleton width="12rem" class="my-1"/>
                        <Skeleton width="3rem" class="my-1"/>
                    </div>
                    <div class="ml-4" v-else-if="isDayError">
                        ERROR: {{ dayError?.message }}
                    </div>
                    <div class="ml-4" v-else-if="isDaySuccess">
                        <ul class="">
                            <li v-for="schedule in dayData">
                                <span class="font-bold"> {{convertIsoTimeStringToHuman(schedule.start) }}</span>
                                <span class="ml-2"> {{ schedule.title }}</span>
                            </li>
                        </ul>
                        <span v-if="dayData?.length === 0" class="italic">nothing on for the rest of today</span>
                    </div>
                </div>
            </div>

        </div>
    </div>

    <section>
        <Artists/>
    </section>


</template>