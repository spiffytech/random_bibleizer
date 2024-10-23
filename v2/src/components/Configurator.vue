<script setup lang="ts">
import { ref, watchEffect } from 'vue';

import RadioButton from 'primevue/radiobutton';

import useConfigStore from '@/stores/configuration';
import { translations, bookRanges } from '../books';

const configuration = useConfigStore();

const translationsDatalistModel = ref(configuration.translation.title);
const translationDatalistValid = ref(true);
watchEffect(() => {
  const translation = translations.find((t) => t.title === translationsDatalistModel.value);
  if (translation) {
    configuration.translation = translation;
    translationDatalistValid.value = true;
  } else {
    translationDatalistValid.value = false;
  }
});
</script>

<template>
  <form>
    <fieldset>
      <label>
        <RadioButton v-model="configuration.weightBooksEvenly" :value="true" />
        Randomize each book
      </label>
      <label>
        <RadioButton v-model="configuration.weightBooksEvenly" :value="false" />
        Randomize all chapters at once
      </label>
    </fieldset>

    <fieldset>
      <legend>What to randomize</legend>

      <label v-for="subset in bookRanges" :key="subset.name" class="block">
        <RadioButton :value="subset" v-model="configuration.selectedBookRange" />
        {{ subset.name }}
      </label>
    </fieldset>

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

    <label>
      Open in Bible App
      <input type="checkbox" v-model="configuration.openInBibleAppAuotmatically" />
    </label>
  </form>
</template>
