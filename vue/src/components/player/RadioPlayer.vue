<script setup lang="ts">
    import { computed, onMounted, ref, useTemplateRef, watch } from 'vue'
    import { Drawer, Skeleton, Button } from 'primevue'
    import PausePlayControls from './PausePlayControls.vue'
    import AudioControls from './AudioControls.vue'
    import { useNowPlayingData } from '@/lib/useNowPlayingData'
    import { playStore } from '@/lib/playState'

    const { data, isLoading, isError, isSuccess } = useNowPlayingData()

    const audioElement = ref<HTMLAudioElement>()

    const volume = ref(.75)
    const muted = ref(false)
    const hasLoaded = ref(false)
    const playHasBeenPressed = ref(false)

    const playState = computed<"paused" | "playing" | "loading">(() => {
        if(playHasBeenPressed.value && !hasLoaded.value) {
            playStore.state = "loading"
            return "loading"
        }

        if(playHasBeenPressed.value && hasLoaded.value) {
            playStore.state = "playing"
            return "playing"
        }

        playStore.state = "paused"
        return "paused"
    })

    const togglePlaying = async () => {
        if(audioElement.value?.paused) {
            //play
            playHasBeenPressed.value = true

            // this is hack to force a reload. it tricks the browser into thinking its a new resource. 
            // the cache-bust query is completely irrelevant.
            // i swear this used to just work without needing to do the cache busting, but it stopped,
            // at least for me on firefox.
            const url = "https://radio-fodder.radiocult.fm/stream?cache-bust=" + new Date().getTime();
            audioElement.value.src = url
            audioElement.value.load()

            await audioElement.value.play()

        }else if(!audioElement.value?.paused) {
            //pause
            audioElement.value?.pause()
            hasLoaded.value = false
            playHasBeenPressed.value = false
        }
    }

    onMounted(() => {
        audioElement.value?.addEventListener("canplay", () => {
            hasLoaded.value = true
        })
    })
</script>

<template>
    <div class="sticky w-screen bottom-0 p-2 bg-white border-t border-t-black z-50">
        <audio 
            ref="audioElement"
            :muted="muted"
            preload="auto"
            :volume="volume" >
            
            <source src="https://radio-fodder.radiocult.fm/stream" />

            <!-- fallback -->
            Your browser does not support the audio element.
        </audio>

        <div class="h-24 grid grid-cols-[6rem_auto] gap-2 max-w-main mx-auto">
            <PausePlayControls 
                @togglePlaying="togglePlaying"
                :playState="playState"/>
    
            <div class="flex-1">
                <div class="min-w-52 grid grid-rows-2 h-full">
                    <div>
                        <div v-if="isLoading">
                            <Skeleton width="14rem" class="my-1"/>
                            <Skeleton width="5rem" class="my-1"/>
                        </div>
                        <div v-else-if="isError">
                            ERRROR
                        </div>
                        <div v-else-if="isSuccess">
                            <h1 class="line-clamp-1 text-ellipsis font-bold">{{ data!.metadata.title }}</h1>
                            <h2>{{ data!.metadata.artist }}</h2>
                        </div>
                    </div>
                    
                    <AudioControls 
                        @update:muted="(value) => muted = value"
                        @update:volume="(value) => volume = value"
                        :muted="muted"
                        :volume="volume" />
    
                </div>
            </div>


        </div>
    </div>

</template>
