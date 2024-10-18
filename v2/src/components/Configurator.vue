<script setup lang="ts">
import { ref, watchEffect } from 'vue';

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
    <sl-radio-group
      label="Randomization method"
      :value="configuration.weightBooksEvenly"
      @sl-change="configuration.weightBooksEvenly = $event.target.value"
    >
      <sl-radio :value="true"> Yes, random books </sl-radio>
      <sl-radio :value="false"> No, random chapters </sl-radio>
    </sl-radio-group>

    <sl-radio-group
      label="What to randomize"
      :value="configuration.selectedBookRange.name"
      @sl-change="
        configuration.selectedBookRange = bookRanges.find((s) => s.name === $event.target.value)!
      "
    >
      <sl-radio v-for="subset in bookRanges" :key="subset.name" :value="subset.name">
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
