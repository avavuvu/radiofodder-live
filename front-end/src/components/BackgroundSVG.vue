<script setup lang="ts">
    import { playStore } from '@/lib/playState';
import { ref, watch } from 'vue';

    const size = 1080

    const artistImages = ref<{
        x: number,
        y: number,
        source: string
    }[]>([])

    watch(() => playStore.artistImageSources.length, (newValue, oldValue) => {
        console.log(oldValue, newValue)
        if (newValue > oldValue) {
            artistImages.value.push({
                x: getRandomPosition(),
                y: getRandomPosition(),
                source: playStore.artistImageSources.at(-1)!
            })
        }else if(newValue < oldValue) {
            artistImages.value = []
        }
    }, { deep: true })

    const getRandomPosition = () => {
        const position = Math.random() * size - 300

        return position
    }
</script>

<template>
    <svg id="" xmlns="http://www.w3.org/2000/svg" :viewBox="`0 0 ${size} ${size}`" preserveAspectRatio="none">

        <g v-for="image in artistImages">
            <image 
                :x="image.y"
                :y="image.x"
                :href="image.source">
                
            </image>

        </g>
    </svg>
</template>

<style lang="css" scoped>
    svg {
        pointer-events: none;
        position: fixed;
        top: 0;
        left: 0;
        height: 100%;
        width: 100%;
        z-index: -100;
    }
</style>