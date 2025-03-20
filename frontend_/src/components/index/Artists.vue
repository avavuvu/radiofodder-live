<script setup lang="ts">
    import ArtistsList from '@/components/index/ArtistsList.vue';
    import { Skeleton } from 'primevue'
</script>

<template>
    <section>
        <h1 class="text-2xl text-center lg:text-left md:text-left">Our Shows</h1>
        <Suspense>
            <template #default>
                <ArtistsList />
            </template>
            <template #fallback>
                <ul class="ml-8">
                    <li v-for="artist in ['','','']" >
                        <div class="flex h-24 gap-2 m-4">
                            <div class="h-full aspect-square border-2 border-surface-900">
                                <div class="h-full ">
                                </div>
                            </div>

                            <div>
                                <Skeleton width="12rem" class="my-1"/>
                
                                <Skeleton width="24rem" class="my-1"/>

                                <Skeleton width="6rem" class="my-1"/>

                            </div>

                            
                        </div>
                    </li>
                </ul>
            </template>
        </Suspense>
    </section>
</template>