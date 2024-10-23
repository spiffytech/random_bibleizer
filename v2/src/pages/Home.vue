<script setup lang="ts">
import { ref } from 'vue';
import type { Ref } from 'vue';

import type { Passage } from '../books';

import Spinner from '../components/Spinner.vue';
import Configurator from '@/components/Configurator.vue';
import YouVersion from '@/components/YouVersion.vue';

const passage = ref(null) as Ref<Passage | null>;
</script>

<template>
  <Spinner @select-book="passage = $event" />

  <div class="mx-auto md:max-w-md lg:max-w-lg">
    <Configurator />
  </div>
  <YouVersion v-if="passage" :passage="passage" />
</template>
