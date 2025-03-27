<script setup lang="ts">
    import { useNowPlayingData } from '@/lib/useNowPlayingData'
    import { Skeleton } from 'primevue'
    import PlaceholerArtwork from "@/components/placeholder/PlaceholderArtwork.vue"
    import { useDaySchedule } from '@/lib/useDaySchedule';
    import { DateTime } from 'luxon';
    import ArtistsList from '@/components/index/ArtistsList.vue';
        

    const { data, isLoading, isError, isSuccess, error } = useNowPlayingData()

    const { data: dayData, isLoading: isDayLoading, isError: isDayError, isSuccess: isDaySuccess, error: dayError }  = useDaySchedule()

    const convertIsoTimeStringToHuman = (isoTime: string) => {
        return DateTime.fromISO(isoTime).toFormat('h:mma').toLowerCase() 
    }
</script>

<template >
    <div class="flex items-center justify-center min-h-[500px] gap-8 flex-col md:flex-row lg:flex-row">
        <div class="flex  gap-2 flex-col md:flex-row lg:flex-row w-full lg:w-auto">
            <div class="w-52 md:w-96 lg:w-96 aspect-square border-2 border-black">
                <div v-if="isSuccess && data?.metadata.artwork">
                    <img 
                        class="w-full h-full p-8"
                        :src="data!.metadata.artwork!.default">
                </div>
                <div v-else class="p-8">
                    <PlaceholerArtwork/>
                </div>
            </div>
    
            <div class="w-48 md:w-96 lg:w-96 mx-auto lg:mx-0">
                <div class="flex gap-2">
                    <h2 class="w-24">Now Playing:</h2>
                    <div v-if="isLoading">
                        <Skeleton width="14rem" class="my-1"/>
                        <Skeleton width="5rem" class="my-1"/>
                    </div>
                    <div v-else-if="isError">
                        ERROR: {{ error?.message }}
                    </div>
                    <div v-else-if="isSuccess">
                        <h1 class="line-clamp-1 text-ellipsis font-bold">{{ data!.metadata.title }}</h1>
                        <h2>{{ data!.metadata.artist }}</h2>
                    </div>
                </div>
    
                <div class="flex gap-2 mt-4">
                    <h2 class=" w-24">Coming Up:</h2>
                    <div v-if="isDayLoading">
                        <Skeleton width="14rem" class="my-1"/>
                    </div>
                    <div v-else-if="isDayError">
                        ERROR: {{ dayError?.message }}
                    </div>
                    <div v-else-if="isDaySuccess">
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
        <h1 class="text-2xl">Our Shows</h1>
        <Suspense>
            <template #default>
                <ArtistsList />
            </template>
            <template #fallback>
                <ul class="ml-8">
                    <li v-for="artist in ['','','']" >
                        <div class="flex h-24 gap-2 m-4">
                            <div class="h-full aspect-square border-2 border-surface-900">
                                <div class="h-full ">
                                </div>
                            </div>

                            <div>
                                <Skeleton width="12rem" class="my-1"/>
                
                                <Skeleton width="24rem" class="my-1"/>

                                <Skeleton width="6rem" class="my-1"/>

                            </div>

                            
                        </div>
                    </li>
                </ul>
            </template>
        </Suspense>
    </section>


</template>