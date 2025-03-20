import { reactive } from 'vue'

interface Store {
    state: "paused" | "playing" | "loading",
    artistImageSources: string[],
    addImage(source: string): void
    clearImages(): void
}

export const playStore = reactive<Store>({
    state: "paused",

    artistImageSources: [],

    addImage(source: string) {
        this.artistImageSources.push(source)
    },
    clearImages() {
        this.artistImageSources = []
    }
})