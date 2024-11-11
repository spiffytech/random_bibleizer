import { createApp } from "vue";
import { createPinia } from "pinia";

import PrimeVue from "primevue/config";

import Honeybadger from "@honeybadger-io/js";
import HoneybadgerVue from "@honeybadger-io/vue";

import App from "./App.vue";
import router from "./router";

import "./assets/main.css";

const app = createApp(App).use(createPinia()).use(router).use(PrimeVue, {
  theme: "none",
});

if (import.meta.env.VITE_honeybadgerKey) {
  const config = {
    apiKey: import.meta.env.VITE_honeybadgerKey,
    environment: "production",
  };
  app.use(HoneybadgerVue, config);
}

app.mount("#app");
