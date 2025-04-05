<script setup lang="ts">
import { Button, Slider } from 'primevue';
import { computed } from 'vue';

const { volume, muted } = defineProps<{volume: number, muted: boolean}>()

const emit = defineEmits<{
    'update:volume': [value: number]
    'update:muted': [value: boolean]
}>()

const volumeIcon = computed(() => {
    if(muted) {
        return "pi pi-times"
    }

    if(volume >= .65) {
        return "pi pi-volume-up"
    } else if(volume <= 0.65 && volume > 0) {
        return "pi pi-volume-down"
    }

    return "pi pi-volume-off"
})

const updateVolumeSlider = (event: Event) => {
    const target = event.target as HTMLInputElement;
    emit("update:volume", target.valueAsNumber)
}

const updateMutedButton = () => {
    emit("update:muted", !muted)
}

</script>

<template>
    <div class="flex text-color">
        <button class="aspect-square h-12 w-12" aria-label="Volume Controls" @click="updateMutedButton">
            <i :class="volumeIcon" ></i>
        </button>
        <input 
            type="range"
            class="max-w-24"
            @input="updateVolumeSlider"
            :min="0" :max="1" :step="0.1"/>

    </div>
</template>