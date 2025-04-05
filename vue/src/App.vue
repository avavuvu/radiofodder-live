<script setup lang="ts">
import { onMounted, ref } from 'vue';

    import DesktopLayout from './components/DesktopLayout.vue';
    import MobileLayout from './components/MobileLayout.vue';

    const isMobile = ref(false);

    onMounted(() => {
        isMobile.value = window.innerWidth <= 768;
    });

    window.addEventListener('resize', () => {
        isMobile.value = window.innerWidth <= 768;
    });
</script>

<template>
    <component :is="isMobile ? MobileLayout : DesktopLayout" />
</template>
