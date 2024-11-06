<script setup lang="ts">
import { ref, computed } from 'vue';
import type { Ref } from 'vue';
import fitty from 'fitty';

import Button from 'primevue/button';

import useConfigStore from '@/stores/configuration';

import { books as allBooks } from '../books';
import type { Book, Passage } from '../books';

const configuration = useConfigStore();

const emit = defineEmits<{
  selectBook: [Passage | null];
}>();

const paused = ref(false);
const togglePause = () => {
  const action = paused.value ? 'resume' : 'pause';
  paused.value = !paused.value;
  if (action === 'pause') {
    // Draw one more time so people can't game the results by pausing when they
    // see something they like
    redraw();
    emit('selectBook', displayedPassage.value);
  } else {
    emit('selectBook', null);
  }
};

const convertRemToPixels = (rem: number): number => {
  return rem * parseFloat(getComputedStyle(document.documentElement).fontSize);
};

/**
 * Returns a random number between min (inclusive) and max (exclusive)
 */
const randomNumberInclIncl = (min: number, max: number) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const randomizeByBook = (selectedBooks: Book[]): Pick<Passage, 'book' | 'chapter'> => {
  const bookIndex = randomNumberInclIncl(0, selectedBooks.length - 1);
  const chapter = randomNumberInclIncl(0, selectedBooks[bookIndex].chapters);

  if ((bookIndex === 65 && chapter === 21) || (bookIndex === 0 && chapter === 0)) {
    console.log('selecting', bookIndex, chapter);
  }
  return { book: selectedBooks[bookIndex], chapter };
};

const randomizeByAllChapters = (selectedBooks: Book[]): Pick<Passage, 'book' | 'chapter'> => {
  const totalChapters = selectedBooks.reduce((acc, book) => acc + book.chapters, 0);
  const targetChapter = randomNumberInclIncl(0, totalChapters);
  let acc = 0;
  for (const book of selectedBooks) {
    for (let i = 0; i < book.chapters; i++) {
      if (acc === targetChapter) {
        if ((book.abbr === 'REV' && i === 21) || (book.abbr === 'GEN' && i === 0)) {
          console.log('selecting', book.abbr, i + 1);
        }
        // Books are 1-indexed in the bible
        return { book, chapter: i + 1 };
      }

      acc += 1;
    }
  }
  throw new Error(`Did not find the target chapter: ${targetChapter}`);
};

const randomizeFn = computed(() =>
  configuration.weightBooksEvenly ? randomizeByBook : randomizeByAllChapters
);

const displayedPassage = ref({
  book: allBooks[0],
  chapter: 1,
  translation: configuration.translation
}) as Ref<Passage>;
const redraw = () => {
  if (paused.value === true) {
    return;
  }

  const startBook = configuration.selectedBookRange.range[0];
  const endBook = configuration.selectedBookRange.range[1];
  displayedPassage.value = {
    ...displayedPassage.value,
    ...randomizeFn.value(allBooks.slice(startBook, endBook))
  };

  fitty('#spinner', {
    minSize: convertRemToPixels(0.5),
    maxSize: convertRemToPixels(3),
    multiLine: false
  });
};

// We want to explicitly throttle on time, not frame rate. High-refresh mobile
// displays still feel caffeinated if we lock on framerate. 180 is an arbitrary
// magic number that feels right when I see it on screen.
setInterval(redraw, 180);
redraw();
</script>

<template>
  <div class="flex flex-col items-center">
    <!-- We need the fixed height because when we display long books (Song of
    Solomon) on narrow screens, fitty shrinks the text, which shrinks the
    natural height of the container, which makes everything below it move around
    as the randomizer does its thing. -->
    <div id="spinner" class="jost text-center text-5xl mb-4 whitespace-nowrap h-12">
      <span>{{ displayedPassage.book.human }} {{ displayedPassage.chapter }}</span>
    </div>
    <Button @click.prevent="togglePause" :label="paused ? 'Shuffle' : 'Stop!'" severity="primary" />
  </div>
</template>
