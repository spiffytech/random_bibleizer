import './assets/main.css'

// TODO: Break this into individual imports so we don't get a 500KB JS payload
import '@shoelace-style/shoelace'

import '@shoelace-style/shoelace/dist/themes/light.css'
import { setBasePath } from '@shoelace-style/shoelace/dist/utilities/base-path.js'

setBasePath('https://cdn.jsdelivr.net/npm/@shoelace-style/shoelace@2.16.0/cdn/')

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

createApp(App).use(createPinia()).use(router).mount('#app')
