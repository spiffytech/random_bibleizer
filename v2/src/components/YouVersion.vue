<script setup lang="ts">
import { ref, watchEffect } from 'vue';

import Skeleton from 'primevue/skeleton';

import type { Passage } from '../books';

import useConfigStore from '@/stores/configuration';

const configuration = useConfigStore();

const props = defineProps<{
  passage: Passage;
}>();

const loading = ref(true);

const getBibleAppURL = () => {
  const {
    passage: { book, chapter }
  } = props;

  const baseUrl = new URL('https://www.bible.com');
  const urlPath = `/bible/${configuration.translation.id}/${book.abbr}.${chapter}.${configuration.translation.local_abbreviation.toLowerCase()}`;
  baseUrl.pathname = urlPath;
  return baseUrl.toString();
};

watchEffect(() => {
  if (props.passage && configuration.openInBibleAppAuotmatically) {
    window.open(getBibleAppURL(), '_blank');
  }
});
</script>

<template>
  <template v-if="!configuration.openInBibleAppAuotmatically">
    <div v-if="loading" class="flex flex-col gap-2 max-w-md mx-auto mb-4" v-for="i in 5" :key="i">
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

    <iframe
      ref="bible.com"
      :src="getBibleAppURL()"
      frameborder="0"
      style="width: 100%; height: 10000px"
      :class="{ invisible: loading }"
      @load.prevent="loading = false"
    ></iframe>
  </template>
</template>
