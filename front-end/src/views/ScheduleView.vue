<script setup lang="ts">
    import Schedule from '@/components/schedule/Schedule.vue';
</script>

<template>
    
    <Suspense>
        <template #default>
            <Schedule/>
        </template>
        <template #fallback>
            <div class="h-screen flex flex-col justify-center items-center align-middle">

                <i class="pi pi-spin pi-spinner text-5xl"></i>
                <span>loading...</span>

            </div>
        </template>
    </Suspense>
</template>