import './assets/main.css';

import PrimeVue from 'primevue/config';

import { createApp } from 'vue';
import { createPinia } from 'pinia';

import App from './App.vue';
import router from './router';

createApp(App)
  .use(createPinia())
  .use(router)
  .use(PrimeVue, {
    theme: 'none'
  })
  .mount('#app');
