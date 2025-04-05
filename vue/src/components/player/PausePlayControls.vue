<script setup lang="ts">
import { Button } from 'primevue';
import { ref, watch } from 'vue';

type Props = {
    playState: "paused" | "playing" | "loading"
}
const { playState } = defineProps<Props>()

const canShowSpinner = ref(false)

watch(() => playState === "loading", async (shouldStartTimer) => {
    if (!shouldStartTimer) {
        return
    }

    canShowSpinner.value = false
    await new Promise(resolve => setTimeout(resolve, 100))
    canShowSpinner.value = true
})

</script>

<template>
    <button
        @click="$emit('togglePlaying')"
        class="grid grid-cols-1 grid-rows-1 aspect-square transition-colors border-black border 
            hover:bg-primary hover:text-white active:bg-black">
        
        <div class="row-start-1 row-end-2 col-start-1 col-end-2 flex justify-center items-center !text-4xl">
            <span v-if="playState === 'paused'" style="font-size: 2.5rem;" class="pi pi-play"></span>
            <span v-else-if="playState === 'playing'" style="font-size: 2.5rem;" class="pi pi-pause"></span>
            <span v-else-if="playState === 'loading'  && canShowSpinner" style="font-size: 2.5rem;" class="pi pi-spinner pi-spin"></span>
            <span v-else class="pi pi-play" style="font-size: 2.5rem;"></span>
        </div>
    </button>
</template>