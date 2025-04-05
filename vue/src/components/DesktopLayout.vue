<script setup lang="ts">
    import { RouterLink, RouterView } from 'vue-router'
    import RadioPlayer from './player/RadioPlayer.vue';
    import Logo from './index/Logo.vue';
    import Marquee from './Marquee.vue';
    import Footer from './index/Footer.vue';
    import { nextTick, ref } from 'vue';
import { playStore } from '@/lib/playState';
import SpinningLogo from './SpinningLogo.vue';

    const isChatOpen = ref(false)
    const isChatLoaded = ref(false)

    const toggleChat = async () => {
        isChatOpen.value = !isChatOpen.value

        if(isChatLoaded.value === false) {
            isChatLoaded.value = true

            await nextTick()

            desktopChatContainer.value!.appendChild(chatIframe.value!)
        }
    }

    const chatIframe = ref<HTMLElement | null>(null);
    const desktopChatContainer = ref<HTMLElement | null>(null);

</script>

<template>
    <div>
        <iframe
            v-if="isChatLoaded"
            ref="chatIframe"
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
    </div>

    <div id="desktop-layout" class="hidden md:block lg:block">
        <div class="flex">
            <div class="w-full h-full min-h-screen grid grid-cols-[10%_auto]">
                <div class="">
                    <a href="/" class="router-link-active router-link-exact-active" aria-current="page">
                        <div class="flex justify-center p-2" href="/">
                            <SpinningLogo></SpinningLogo>
                        </div>
                    </a>

                    <div class="[writing-mode:vertical-lr] w-full flex flex-col justify-center">
                        <h1 class="text-4xl">Radio Fodder</h1>
                        <p>The University of Melbourne Student Radio Station</p>
                    </div>
                </div>

                <div>
                    <header class="">
                        <div class="text-color">
                            <div clas="underline text-xl">
                                <div class="flex justify-between p-1 mb-4"></div>
                                <div class="border-y border-y-surface-950 italic p-1">
                                    <Marquee :repeats="2">
                                        <p>Radio Fodder Live - The University of Melbourne’s Official Student Radio
                                            Station</p>
                                    </Marquee>
                                </div>
                            </div>
                        </div>
                    </header>
                    <div class="sticky bg-surface-50 z-40 top-0 flex justify-between text-xl p-2">
                        <nav class="flex gap-4">
                            <RouterLink to="/">
                                <span class="underline">
                                    Listen
                                </span>
                            </RouterLink>
                            <RouterLink to="/schedule">
                                <span class="underline">
                                    Schedule
                                </span>
                            </RouterLink>
                            <a href="https://instagram.com/radiofodder" target="_blank" rel="noopener noreferrer"
                                class="">
                                <span class="pr-1 underline ">Instagram</span>
                                <i class="pi pi-external-link" style="font-size: .75rem"></i>
                            </a>
                        </nav>
                        <span class="bg-primary text-primary-contrast border-surface-950 border px-2">
                            <button @click="toggleChat">
                                Join the Chat!
                            </button>
                        </span>
                    </div>

                    <RouterView />

                </div>
            </div>
            <div 
                class="sticky top-0 h-[calc(100vh-6rem)] bg-black desktop-chat-container" 
                :class="isChatOpen ? '' : 'chat-hidden' " 
                ref="desktopChatContainer">
            </div>
        </div>

        <Footer></Footer>
    </div>

    <RadioPlayer />
</template>

<style lang="css" scoped>
    .desktop-chat-container {
        width: 30rem;
        transition: width 0.3s ease-in-out;
    }

    .desktop-chat-container.chat-hidden {
        width: 0rem;
    }

    .fodder-circle {
        animation: spin 50s linear infinite;
        transform-origin: center center;
    }

    .paused {
        animation-play-state: paused;
    }

    @keyframes spin {
        from {
            transform: rotate(0deg);
        }

        to {
            transform: rotate(360deg);
        }
    }
</style>
    