<script setup lang="ts">
    import { generateScheduleData } from '@/lib/generateScheduleData';
    import type { ScheduleEvent } from '@/lib/scheduleTypes';
    import { DateTime } from 'luxon';
    import ScheduleItem from './ScheduleItem.vue';
    import { fetchWeekSchedule } from '@/lib/fetchWeekSchedule';

    const schedule = await fetchWeekSchedule()

    const startOfSchedule = DateTime.local();

    const horses = [
        "assets/horse/horse1.svg",
        "assets/horse/horse2.svg",
        "assets/horse/horse3.svg",
        "assets/horse/horse4.svg",
        "assets/horse/horse5.svg",
        "assets/horse/horse6.svg",
    ];

    const getHorseSource = (index: number) => horses[index % horses.length]

    const toOrdinal = (value: number) => {
        var s = ["th", "st", "nd", "rd"];
        var v = value % 100;
        return value + (s[(v - 20) % 10] || s[v] || s[0]);
    };
</script>

<template>
    <div class="max-w-[800px] mx-auto px-2 text-black">
        <div class="font-serif text-center pb-8">
            <h1 class="text-6xl font-bold">
                {{startOfSchedule.year}} Schedule
            </h1>
            <p>for the week starting on {{startOfSchedule.toFormat("DDDD")}}</p>
        </div>

        
        <div v-for="([weekday, events], index) in generateScheduleData(schedule)" >
            <div
                class="grid grid-cols-[1fr_1fr_1fr] font-serif h-[50vh] max-w-[400px] mx-auto">
                <div
                    class="col-start-1 col-end-3 row-start-1 row-end-2 aspect-square
                    bg-primary"
                ></div>
                <div
                    class="col-start-1 col-end-4 row-start-1 row-end-2 relative"
                >
                    <img
                        class="absolute right-0"
                        :src="getHorseSource(index)"
                        alt=""
                    />
                </div>
                <div
                    class="col-start-2 col-end-4 row-start-1 row-end-2 flex items-center justify-end text-right">
                    <h1
                        class="text-6xl scale-y-150 my-auto h-24 overflow-hidden lg:overflow-visible"
                    >
                        {{weekday}}
                    </h1>
                </div>
                <div
                    class="text-right italic mt-4 mr-8 relative z-50
                    col-start-2 col-end-4 row-start-1 row-end-2 flex items-center justify-end"
                >
                    <p>
                        {{startOfSchedule.plus({day: index}).monthLong}}
                        {{toOrdinal(startOfSchedule.plus({day: index}).day)}}
                    </p>
                </div>
            </div>

            <div class="relative z-50">
                <div class="mb-20">
                    <div v-for="event in events">
                        <ScheduleItem
                             v-if="event.type === 'schedule'"
                            :event>
                        </ScheduleItem>

                        <div
                            v-else-if="event.type === 'break'" 
                            class="mx-auto max-w-[200px]">
                            <div class="border-y-black border-y-2 mt-4 bg-[white]">
                                <p class="italic ">
                                    no programming between {{event.start.toFormat("h:mma")}} and {{event.end.toFormat("h:mma")}}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div v-if="events.length === 0" class="mx-auto max-w-[200px]">
                        <div class="border-y-black border-y-2 mt-4 bg-white">
                            <p class="italic ">
                                no programming on {{weekday}}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>