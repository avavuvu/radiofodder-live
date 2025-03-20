<script setup lang="ts">
    import { computed, onMounted, ref, useTemplateRef, watch } from 'vue'
    import { Drawer, Skeleton, Button } from 'primevue'
    import PausePlayControls from './PausePlayControls.vue'
    import AudioControls from './AudioControls.vue'
    import { useNowPlayingData } from '@/lib/useNowPlayingData'

    const { data, isLoading, isError, isSuccess } = useNowPlayingData()

    const showChatDrawer = ref(false)
    const openChat = () => {
        showChatDrawer.value = true
    }

    const audioElement = ref<HTMLAudioElement>()

    const volume = ref(.75)
    const muted = ref(false)
    const hasLoaded = ref(false)
    const playHasBeenPressed = ref(false)

    const playState = computed<"paused" | "playing" | "loading">(() => {
        if(playHasBeenPressed.value && !hasLoaded.value) {
            return "loading"
        }

        if(playHasBeenPressed.value && hasLoaded.value) {
            return "playing"
        }

        return "paused"
    })

    const togglePlaying = async () => {
        if(audioElement.value?.paused) {
            //play
            playHasBeenPressed.value = true
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
    <div class=" sticky bottom-0 bg-primary border-t-surface-950 border-t-2 z-50">
        <audio 
            ref="audioElement"
            :muted="muted"
            :volume="volume" >
            
            <source src="https://radio-fodder.radiocult.fm/stream" />

            <!-- fallback -->
            Your browser does not support the audio element.
        </audio>

        <div class=" min-h-24 max-h-12 
            flex max-w-main mx-auto">
            <PausePlayControls 
                @togglePlaying="togglePlaying"
                :playState="playState"/>
    
            <div class="flex-1">
                <div class="min-w-52 grid grid-rows-2 h-full">
                    <div>
                        <div v-if="isLoading">
                            <Skeleton width="14rem" class="my-1 !bg-primary-100"/>
                            <Skeleton width="5rem" class="my-1 !bg-primary-100"/>
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
    
    
            <div class="min-w-24 hidden lg:block md:block !p-2">
                <Button class="!mx-auto !w-full !h-full !aspect-square !bg-highlight" icon="pi pi-comment" aria-label="Open Chat" @click="openChat">
                </Button>
            </div>

        </div>
    </div>

    <Drawer 
        position="right"
        class="sm:!w-[80%] md:!w-80 lg:!w-[30rem]"
        v-model:visible="showChatDrawer">
        <template #container="{ closeCallback }" class="h-[100dvh]">

            <iframe
                title="Radio Fodder chat room"
                src="https://app.radiocult.fm/embed/chat/radio-fodder?theme=midnight&primaryColor=%23e1c7ff&corners=rounded&removeRcBranding=true"
                width="100%"
                height="100%"
                scrolling="no"
                frameborder="0"
                seamless
                allowtransparency="true"
                style=""
                >
            </iframe>

        </template>
    </Drawer>

</template>
