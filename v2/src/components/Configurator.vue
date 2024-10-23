<script setup lang="ts">
import { ref, watchEffect } from 'vue';

import RadioButton from 'primevue/radiobutton';
import Select from 'primevue/select';

import useConfigStore from '@/stores/configuration';
import { translations, bookRanges } from '../books';

const configuration = useConfigStore();
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

    <Select
      v-model="configuration.translation"
      :options="translations"
      optionLabel="title"
      filter
    />

    <label>
      Open in Bible App
      <input type="checkbox" v-model="configuration.openInBibleAppAuotmatically" />
    </label>
  </form>
</template>
