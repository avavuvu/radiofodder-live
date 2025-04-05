<script setup lang="ts">
    import {type EventDisplay, type FormattedScheduleEvent } from '@/lib/generateScheduleData';
    import type { Artist } from '@/lib/types';

    const { event } = defineProps<{
        event: FormattedScheduleEvent,
        artist?: Artist
    }>()

</script>

<template>
    <div class="mx-auto max-w-[600px] font-sans">
        <h1 class="bg-surface-50 w-fit font-bold">
            {{ event.start.toFormat("h:mma") }} - {{ event.end.toFormat("h:mma") }}
        </h1>
    
        <div
            class="border-b-surface-950 border-b-2 max-w-[66%]"
        ></div>
    
        <div
            :style='{backgroundColor: event.color === "white" ? "purple" : event.color}'
            class="grid grid-cols-[15%_15%_auto]
            max-w-[72] mx-auto ml-4 text-white"
        >
            <div
                class="[writing-mode:vertical-rl] ml-auto flex items-center justify-center"
            >
                <h3 class="">
                    {{
                        {
                            playlist: "PLIST",
                            mix: "PRE",
                            live: "LIVE",
                        }[event.media]
                    }}
                </h3>
            </div>
            <div
                class="flex items-center justify-center text-2xl">
                {{ event.media === "playlist" ? "♫" : "☆" }}
            </div>
            <div>
                <h2
                    class="font-bold overflow-ellipsis overflow-hidden min-h-12 inline-block break-all"
                >
                    <span>
                        {{ event.title }}
                    </span>
                </h2>
            </div>
        </div>
    </div> 

</template>