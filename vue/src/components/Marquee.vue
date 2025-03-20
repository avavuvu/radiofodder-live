
<script setup lang="ts">
    const { repeats  } = defineProps<{repeats: number}>()
</script>

<template>
    <div class="marquee">
        <ul class="marquee-content">
            <li v-for="index in Array.from({length: repeats})">
                <slot></slot>
            </li>
        </ul>
        <ul class="marquee-content" aria-hidden="true">
            <li v-for="index in Array.from({length: repeats})">
                <slot></slot>
            </li>
        </ul>
    </div>
</template>

<style>
    .marquee {
        margin: 0px;
        --gap: 1rem;
        display: flex;
        overflow: hidden;
        user-select: none;
        gap: var(--gap);
    }
    
    .marquee-content {
        list-style-type: "";
        
        margin: 0px;
        flex-shrink: 0;
        display: flex;
        justify-content: space-around;
        min-width: 100%;
        gap: var(--gap);
        animation: scroll 45s linear -30s infinite;
    }

    @keyframes scroll {
        from {
            transform: translateX(0);
        }
        to {
            transform: translateX(calc(-100% - var(--gap)));
        }
    }
</style>