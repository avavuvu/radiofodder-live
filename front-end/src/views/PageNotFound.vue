<script setup lang="ts">
import { useRoute } from 'vue-router';


    const route = useRoute()
    
    
</script>

<template>
    <div class="flex justify-center align-middle w-full  items-center flex-col text-center px-8 pb-24">
        <h1 class="text-7xl scale-y-150 mt-32"> 
            404 
        </h1>
        <p class="text-gray-500">
            An error has occured accessing the page <span class="text-red-700">{{ route.path }}</span>
        </p>
        <p>
            If you believe this to be a mistake, please contact the webmaster.
        </p>

    </div>
</template>