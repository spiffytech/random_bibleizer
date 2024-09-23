<script setup lang="ts">
import type { Passage, Translation } from '../books';

const props = defineProps<{
  passage: Passage;
  translation: Translation;
}>();

const emit = defineEmits<{}>();

const onLoad = () => {};

const getBibleAppURL = () => {
  const {
    translation,
    passage: { book, chapter }
  } = props;

  const baseUrl = new URL('https://www.bible.com');
  const urlPath = `/bible/${translation.id}/${book.abbr}.${chapter}.${translation.local_abbreviation.toLowerCase()}`;
  baseUrl.pathname = urlPath;
  return baseUrl.toString();
};
</script>

<template>
  <iframe
    ref="bible.com"
    :src="getBibleAppURL()"
    frameborder="0"
    style="width: 100%; height: 10000px"
    @load.prevent="onLoad"
  ></iframe>
</template>
