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
  Honeybadger.beforeNotify(function (notice) {
    if (notice?.url) {
      // We're trying to suppress errors from inside the Bible.com iframe. I
      // can't do anything about them, and they're very noisy.
      const host = new URL(notice.url).hostname;
      if (host !== "randombibleizer.spiffy.tech") {
        return false;
      }
    }
  });
  app.use(HoneybadgerVue, config);
}

app.mount("#app");
