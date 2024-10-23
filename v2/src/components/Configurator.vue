<script setup lang="ts">
import Checkbox from 'primevue/checkbox';
import IftaLabel from 'primevue/iftalabel';
import RadioButton from 'primevue/radiobutton';
import Select from 'primevue/select';

import useConfigStore from '@/stores/configuration';
import { translations, bookRanges } from '../books';

const configuration = useConfigStore();
</script>

<template>
  <form class="bg-sky-50 px-4 py-2 rounded-lg">
    <IftaLabel>
      <Select
        v-model="configuration.translation"
        :options="translations"
        optionLabel="title"
        filter
        inputId="translation"
      />
      <label for="translation">Translation</label>
    </IftaLabel>

    <label class="flex items-center gap-2">
      <Checkbox v-model="configuration.openInBibleAppAuotmatically" binary />
      Open in Bible App
    </label>

    <div class="flex flex-wrap gap-4 mt-4">
      <fieldset class="flex flex-col">
        <legend>Shuffle mode</legend>

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
        <legend>Passages</legend>

        <label v-for="subset in bookRanges" :key="subset.name" class="block">
          <RadioButton :value="subset" v-model="configuration.selectedBookRange" />
          {{ subset.name }}
        </label>
      </fieldset>
    </div>
  </form>
</template>
