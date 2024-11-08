<script setup lang="ts">
import { ref, watchEffect } from "vue";

import Button from "primevue/button";
import Skeleton from "primevue/skeleton";

import type { Passage } from "../books";

import useConfigStore from "@/stores/configuration";

const configuration = useConfigStore();

const props = defineProps<{
  passage: Passage;
  quiz: boolean;
  quizShowResults: boolean;
}>();

const emit = defineEmits<{
  requestResults: [undefined];
}>();

const loading = ref(true);

const getBibleAppURL = () => {
  const {
    passage: { book, chapter },
  } = props;

  const baseUrl = new URL("https://www.bible.com");
  const urlPath = `/bible/${configuration.translation.id}/${book.abbr}.${chapter}.${configuration.translation.local_abbreviation.toLowerCase()}`;
  baseUrl.pathname = urlPath;
  return baseUrl.toString();
};

watchEffect(() => {
  if (props.passage && configuration.openInBibleAppAuotmatically) {
    window.open(getBibleAppURL(), "_blank");
  }
});

const onload = () => {
  // Changing the translation will change the iframe URL, which re-kicks the
  // onload event, which re-scrolls down to the iframe, which the user didn't
  // ask for. So, only kick onload if we _expected_ to be loading.
  if (loading.value === false) {
    return;
  }

  loading.value = false;
  // This has to be a microtask, because if it's run immediately, Android
  // calculates the scroll position based on the not-yet-removed skeleton
  // elements and we scroll too far.
  queueMicrotask(() =>
    iframe.value?.scrollIntoView({ behavior: "smooth", block: "start" })
  );
};
const iframe = ref<HTMLIFrameElement>();
</script>

<template>
  <template v-if="!configuration.openInBibleAppAuotmatically">
    <div
      v-if="loading"
      class="flex flex-col gap-2 max-w-md mx-auto mb-4"
      v-for="i in 5"
      :key="i"
    >
      <span class="flex gap-2">
        <Skeleton class="w-5/12" effect="sheen" />
        <Skeleton class="w-3/12" effect="sheen" />
      </span>

      <span class="flex gap-2">
        <Skeleton class="w-4/12" effect="sheen" />
        <Skeleton class="w-2/12" effect="sheen" />
        <Skeleton class="w-5/12" effect="sheen" />
        <Skeleton class="w-1/12" effect="sheen" />
      </span>

      <span class="flex gap-2">
        <Skeleton class="w-4/12" effect="sheen" />
        <Skeleton class="w-2/12" effect="sheen" />
        <Skeleton class="w-4/12" effect="sheen" />
      </span>

      <span class="flex gap-2">
        <Skeleton class="w-7/12" effect="sheen" />
        <Skeleton class="w-7/12" effect="sheen" />
        <Skeleton class="w-1/12" effect="sheen" />
        <Skeleton class="w-2/12" effect="sheen" />
      </span>
    </div>

    <div
      id="iframe-cover-top"
      v-if="quiz && !quizShowResults"
      class="flex flex-col items-center justify-center"
    >
      <Button @click="emit('requestResults', undefined)" label="Show Answer" />
    </div>
    <iframe
      :src="getBibleAppURL()"
      ref="iframe"
      frameborder="0"
      style="width: 100%; height: 10000px"
      :class="{ invisible: loading }"
      @load.prevent="onload"
    ></iframe>
  </template>
</template>

<style>
#iframe-cover-top,
#iframe-cover-bottom {
  position: absolute;
  background-color: white;
  width: 100vw;
}
#iframe-cover-top {
  height: 250px;
}
#iframe-cover-bottom {
  bottom: 0;
  height: 250px;
}
</style>
