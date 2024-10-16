<script setup lang="ts">
import { ref, watchEffect, computed } from 'vue';
import type { Ref, UnwrapRef } from 'vue';

import { books as allBooks, translations } from '../books';
import type { Book, Passage } from '../books';

const emit = defineEmits<{
  selectBook: [Passage | null];
}>();

// Mobile Safari disables LocalStorage when "block all cookies" is enabled
const canUseLocalstorage = (() => {
  try {
    localStorage.getItem('bogus');
    return true;
  } catch (ex) {
    return false;
  }
})();

const localstorageTryGet = (key: string) => {
  if (canUseLocalstorage) {
    return localStorage.getItem(key);
  }
  return null;
};
const localstorageTrySet = (key: string, value: string) => {
  if (canUseLocalstorage) {
    return localStorage.setItem(key, value);
  }
};

/**
 * Returns a random number between min (inclusive) and max (exclusive)
 */
const randomNumberInclExcl = (min: number, max: number) => {
  return Math.random() * (max - min) + min;
};

const randomizeByBook = (selectedBooks: Book[]): Pick<Passage, 'book' | 'chapter'> => {
  var book_index = Math.floor(Math.random() * selectedBooks.length);
  var chapter = Math.ceil(Math.random() * selectedBooks[book_index].chapters);

  return { book: selectedBooks[book_index], chapter };
};

const randomizeByAllChapters = (selectedBooks: Book[]): Pick<Passage, 'book' | 'chapter'> => {
  const totalChapters = selectedBooks.reduce((acc, book) => acc + book.chapters, 0);
  const targetChapter = randomNumberInclExcl(0, totalChapters + 1);
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

      acc += i;
    }
  }
  throw new Error('Did not find the target chapter');
};

const localStorageValue = <T,>(key: string, defaultValue: T): Ref<T> => {
  const storedValue = localstorageTryGet(key);
  // No idea why the cast is necessary
  const valueRef = ref(defaultValue) as Ref<T>;
  if (storedValue) {
    try {
      valueRef.value = JSON.parse(storedValue) as T;
    } catch {
      // The old version of the app just stored keys willy-nilly and made every
      // read/write a special snowflake operation.
      valueRef.value = storedValue as T;
    }
  }
  watchEffect(() => localstorageTrySet(key, JSON.stringify(valueRef.value)));
  return valueRef;
};

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

const weightBooksEvenly = localStorageValue('weightBooksEvenly', true);
const randomizeFn = computed(() =>
  weightBooksEvenly.value ? randomizeByBook : randomizeByAllChapters
);
const lsOpenAuto = localStorageValue('openInBibleAppAuotmatically', true);
const selectedTranslation = localStorageValue('savedTranslation', 'GW');
interface Subset {
  name: string;
  range: [number, number];
}
const subsets: Subset[] = [
  { name: 'Whole Bible', range: [0, 66] },
  { name: 'Old Testament', range: [0, 39] },
  { name: 'New Testament', range: [39, 66] },
  { name: 'Psalms and Proverbs', range: [18, 20] }
];
const selectedSubset = ref(subsets[0]) as Ref<Subset>;

const displayedPassage = ref({
  book: allBooks[0],
  chapter: 1,
  translation: translations.find((t) => t.abbreviation === 'GW')!
}) as Ref<Passage>;
const redraw = () => {
  if (paused.value === true) {
    return;
  }

  const startBook = selectedSubset.value.range[0];
  const endBook = selectedSubset.value.range[1];
  displayedPassage.value = {
    ...displayedPassage.value,
    ...randomizeFn.value(allBooks.slice(startBook, endBook))
  };
};

let lastDrawTime = performance.now();
const animationFrameCallback = () => {
  // We want to explicitly throttle on time, not frame rate.
  // High-refresh mobile displays still feel caffeinated if we lock on
  // framerate. 180 is an arbitrary magic number that feels right when I see it
  // on screen.
  if (lastDrawTime <= performance.now() - 180) {
    redraw();
    lastDrawTime = performance.now();
  }
  requestAnimationFrame(animationFrameCallback);
};
requestAnimationFrame(animationFrameCallback);
const $window = window;

const translationsDatalistModel = ref(displayedPassage.value.translation.title);
const translationDatalistValid = ref(true);
watchEffect(() => {
  const translation = translations.find((t) => t.title === translationsDatalistModel.value);
  if (translation) {
    displayedPassage.value.translation = translation;
    translationDatalistValid.value = true;
  } else {
    translationDatalistValid.value = false;
  }
});

let vals = ref(['alpha', 'bravo', 'charlie', 'delta']);
</script>

<template>
  <div>{{ displayedPassage.book.human }} {{ displayedPassage.chapter }}</div>
  <sl-button @click.prevent="togglePause">
    <span v-if="paused">Randomize</span><span v-else>Stop shuffling</span>
  </sl-button>

  <form>
    <sl-radio-group
      label="What to randomize"
      :value="selectedSubset.name"
      @sl-change="selectedSubset = subsets.find((s) => s.name === $event.target.value)!"
    >
      <sl-radio v-for="subset in subsets" :key="subset.name" :value="subset.name">
        {{ subset.name }}
      </sl-radio>
    </sl-radio-group>

    <label class="flex flex-col" :class="[!translationDatalistValid && 'border-2 border-red-500']">
      <span>Translation</span>
      <input
        type="text"
        list="translations"
        class="px-4 py-2 border-2 border-gray-200 rounded-md"
        v-model="translationsDatalistModel"
      />
      <datalist id="translations">
        <option
          v-for="translation in translations"
          :key="translation.abbreviation"
          :__value="translation.title"
        >
          {{ translation.title }}
        </option>
      </datalist>
    </label>
  </form>
</template>
