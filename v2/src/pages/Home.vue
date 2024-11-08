<script setup lang="ts">
import { ref } from 'vue';
import type { Ref } from 'vue';

import type { Passage } from '../books';

import Spinner from '../components/Spinner.vue';
import Configurator from '@/components/Configurator.vue';
import YouVersion from '@/components/YouVersion.vue';

defineProps<{ quiz: boolean }>();
const quizShowResults = ref(false);

const passage = ref(null) as Ref<Passage | null>;
</script>

<template>
  <Teleport to="#title-suffix" v-if="quiz">Quiz Mode</Teleport>

  <Spinner
    @shuffle-start="
      passage = null;
      quizShowResults = false;
    "
    @shuffle-stop="passage = $event"
    :quiz
    :quizShowResults
  />

  <div class="mx-auto mt-8 md:max-w-md lg:max-w-lg mb-8">
    <Configurator />
  </div>
  <YouVersion
    v-if="passage"
    :passage
    :quiz
    :quizShowResults
    @request-results="quizShowResults = true"
  />
</template>
