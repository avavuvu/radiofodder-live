import './index.css'
import 'primeicons/primeicons.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import PrimeVue from "primevue/config"
import Aura from "@primevue/themes/aura"
import { VueQueryPlugin, QueryClient } from '@tanstack/vue-query'
import { definePreset } from '@primevue/themes'

const app = createApp(App)

const customRadioFodderTheme = definePreset(Aura, {
    primitive: {
        borderRadius: {
            none: '0',
            xs: '0',
            sm: '0',
            md: '0',
            lg: '0',
            xl: '0'
        },
    },
    semantic: {
        colorScheme: {
            light: {
                surface: {
                    0: '#ffffff',
                    50: 'ffffff',
                    100: '{slate.100}',
                    200: '{slate.200}',
                    300: '{slate.300}',
                    400: '{slate.400}',
                    500: '{slate.500}',
                    600: '{slate.600}',
                    700: '{slate.700}',
                    800: '{slate.800}',
                    900: '{slate.900}',
                    950: '{slate.950}'
                },
                text: {
                    color: '#000000',
                    hoverColor: '{surface.800}',
                    mutedColor: '{surface.500}',
                    hoverMutedColor: '{surface.600}'
                },
                primary: {
                    color: '#418BFC',
                    inverseColor: '#000000',
                    hoverColor: '#eed258',
                    activeColor: '{zinc.800}', 
                    contrastColor: '#ffffff',
                },
                highlight: {
                    background: '#0000ff',
                    focusBackground: '#0000ff',
                    hoverColor: "#295aa2",
                    color: '#ffffff',
                    focusColor: '#0000ff',
                    contrastColor: '#ffffff'
                }
            },
            dark: {
                primary: {
                    color: '#418BFC',
                    contrastColor: '#ffffff',
                },
                surface: {
                    0: '#0000000',
                    50: '{neutral.900}',
                    100: '{slate.100}',
                    200: '{slate.200}',
                    300: '{slate.300}',
                    400: '{slate.400}',
                    500: '{slate.500}',
                    600: '{slate.600}',
                    700: '{slate.700}',
                    800: '{slate.800}',
                    900: '{slate.900}',
                    950:  '{slate-50}'
                },
            }
        }
    },
    components: {
        accordion: {
            header: {
                padding: "0px",
                fontWeight: 'normal',
            }
        }
    }
    
})

app.use(PrimeVue, {
    theme: {
        preset: customRadioFodderTheme,
        cssLayer: {
            name: "primvevue",
            order: 'tailwind-base, primevue, tailwind-utilities'
        }
    }
})
app.use(router)

const queryClient = new QueryClient()
app.use(VueQueryPlugin, { queryClient })

app.mount('#app')
