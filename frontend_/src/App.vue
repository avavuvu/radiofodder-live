<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import RadioPlayer from './components/player/RadioPlayer.vue';
import Logo from './components/index/Logo.vue';
</script>

<template>
    <header class="bg-[blue]">
        <div class="wrapper text-white mb-4">
            <nav class="flex gap-4 justify-center underline text-2xl">
                <RouterLink to="/">Radio Fodder</RouterLink>
                <RouterLink to="/schedule">Schedule</RouterLink>
            </nav>
        </div>
    </header>

    <a href="/" class="sticky top-0 bg-black mix-blend-difference">
    </a>

    <RouterView />
    <RadioPlayer/>
</template>