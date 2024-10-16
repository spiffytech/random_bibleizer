<script setup lang="ts">
import { ref } from 'vue';

import type { Passage, Translation } from '../books';

const props = defineProps<{
  passage: Passage;
}>();

const emit = defineEmits<{}>();

const loading = ref(true);

const getBibleAppURL = () => {
  const {
    passage: { book, chapter, translation }
  } = props;

  const baseUrl = new URL('https://www.bible.com');
  const urlPath = `/bible/${translation.id}/${book.abbr}.${chapter}.${translation.local_abbreviation.toLowerCase()}`;
  baseUrl.pathname = urlPath;
  return baseUrl.toString();
};
</script>

<template>
  <div v-if="loading" class="flex flex-col gap-2 max-w-md mx-auto">
    <span class="flex gap-2">
      <sl-skeleton class="w-5/12" effect="sheen" />
      <sl-skeleton class="w-3/12" effect="sheen" />
    </span>

    <span class="flex gap-2">
      <sl-skeleton class="w-4/12" effect="sheen" />
      <sl-skeleton class="w-2/12" effect="sheen" />
      <sl-skeleton class="w-5/12" effect="sheen" />
      <sl-skeleton class="w-1/12" effect="sheen" />
    </span>

    <span class="flex gap-2">
      <sl-skeleton class="w-4/12" effect="sheen" />
      <sl-skeleton class="w-2/12" effect="sheen" />
      <sl-skeleton class="w-4/12" effect="sheen" />
    </span>

    <span class="flex gap-2">
      <sl-skeleton class="w-7/12" effect="sheen" />
      <sl-skeleton class="w-7/12" effect="sheen" />
      <sl-skeleton class="w-1/12" effect="sheen" />
      <sl-skeleton class="w-2/12" effect="sheen" />
    </span>
  </div>

  <iframe
    ref="bible.com"
    :src="getBibleAppURL()"
    frameborder="0"
    style="width: 100%; height: 10000px"
    @load.prevent="loading = false"
  ></iframe>
</template>
