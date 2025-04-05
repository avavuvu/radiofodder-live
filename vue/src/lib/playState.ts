import { reactive } from 'vue'

interface Store {
    state: "paused" | "playing" | "loading",
}

export const playStore = reactive<Store>({
    state: "paused"
})