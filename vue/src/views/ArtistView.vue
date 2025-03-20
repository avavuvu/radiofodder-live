<script lang="ts">
import { fetchArtist } from '@/lib/fetchArtists';

export default {
    data() {
        return {
            slug: ''
        }
    },
    async beforeRouteEnter(to, from, next) {
        // Access route params from the 'to' object
        const slug = to.params.slug;
        
        if(typeof slug !== "string") {
            next(false);
            return;
        }
    
        try {
            const data = await fetchArtist(slug);
            if(!data) {
                throw new Error("Unable to find artist");
            }

            next()
        }
        catch (e) {
            throw e
        }
  }
}
</script>

<template>
  <h1>{{ slug }}</h1>
</template>